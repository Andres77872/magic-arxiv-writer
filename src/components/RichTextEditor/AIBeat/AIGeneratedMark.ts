import { Mark, Editor } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';

// Define Range type for our use
type Range = { from: number; to: number };

// Track if the confirmation dialog is currently shown
let isConfirmationShown = false;

// Track if we're currently processing an edit to avoid infinite loops
let isProcessingEdit = false;

// Keep track of last edit time to throttle processing
let lastEditTime = 0;
const THROTTLE_MS = 300; // Throttle checks to avoid excessive processing

// Helper function to find corresponding node in new doc
// Define node types to make TypeScript happy
type ProseMirrorNode = any;
type ProseMirrorMark = any;

function findCorrespondingNodeInDoc(doc: ProseMirrorNode, oldPos: number): [ProseMirrorNode, number] | null {
  let result: [ProseMirrorNode, number] | null = null;
  doc.nodesBetween(0, doc.content.size, (node: ProseMirrorNode, pos: number) => {
    if (result) return false; // Already found
    
    if (node.isText && Math.abs(pos - oldPos) < 10) { // Fuzzy position match
      // Check for matching marks
      const sameMarks = node.marks.some((mark: ProseMirrorMark) => 
        mark.type.name === 'aiGenerated');
        
      if (sameMarks) {
        result = [node, pos];
        return false;
      }
    }
    return true;
  });
  return result;
}

export const AIGeneratedMark = Mark.create({
  name: 'aiGenerated',
  
  addAttributes() {
    return {
      // This attribute can be used to distinguish between accepted and pending AI content
      status: {
        default: 'pending',
        parseHTML: element => element.getAttribute('data-ai-status') || 'pending',
        renderHTML: attributes => {
          return {
            'data-ai-status': attributes.status,
          };
        },
      },
    };
  },

  // Specify how to parse this mark from HTML
  parseHTML() {
    return [
      {
        tag: 'span[data-ai-generated]',
      },
    ];
  },

  // Specify how to render this mark to HTML
  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, 'data-ai-generated': true }, 0];
  },
  
  // Add plugin to handle click events on AI-generated content
  addProseMirrorPlugins() {
    return [
      new Plugin({
        // Track content changes to detect when AI content is edited
        appendTransaction: (transactions, oldState, newState) => {
          // Skip if no transactions or they are all selection-only
          const isContentChange = transactions.some(tr => tr.docChanged);
          if (!transactions.length || !isContentChange) return null;
          
          // Skip if marked to prevent auto-accept
          if (transactions.some(tr => tr.getMeta('preventAutoAccept'))) return null;
          
          // Throttle processing to avoid excessive checks
          const now = Date.now();
          if (now - lastEditTime < THROTTLE_MS) return null;
          lastEditTime = now;
          
          // Use a global flag to avoid recursion during processing
          if (isProcessingEdit) return null;
          
          // Process in next tick to avoid call stack issues
          setTimeout(() => {
            if (isProcessingEdit) return; // Double-check flag
            
            try {
              isProcessingEdit = true;
              let contentChanged = false;
              
              // Simple traversal to find AI content in old state
              oldState.doc.descendants((oldNode: ProseMirrorNode, oldPos: number) => {
                if (contentChanged) return false;
                
                if (!oldNode.isText) return true;
                
                // Check if node has AI mark with pending status
                const hasPendingAIMark = oldNode.marks.some((mark: ProseMirrorMark) => 
                  mark.type.name === 'aiGenerated' && 
                  mark.attrs.status === 'pending');
                  
                if (hasPendingAIMark) {
                  // Find corresponding node in new state
                  const newNodePos = findCorrespondingNodeInDoc(newState.doc, oldPos);
                  if (newNodePos) {
                    const [newNode] = newNodePos;
                    
                    // Check if content changed
                    if (newNode.text !== oldNode.text) {
                      contentChanged = true;
                      
                      // Trigger contentEdited event in next tick
                      setTimeout(() => {
                        document.dispatchEvent(new CustomEvent('contentEdited'));
                      }, 0);
                      
                      return false;
                    }
                  }
                }
                return true;
              });
            } finally {
              isProcessingEdit = false;
            }
          }, 0);
          
          return null;
        },
        props: {
          handleClick(view: any, pos: number, event: MouseEvent) {
            // Get the document and position information
            const { state } = view;
            const { doc } = state;
            
            // If a confirmation is already shown for this content, close it instead of taking further actions
            if (isConfirmationShown) {
              // Dispatch event to close the dialog without any text changes
              document.dispatchEvent(
                new CustomEvent('aiContentDialogClose')
              );
              
              // Close the dialog
              isConfirmationShown = false;
              
              // Prevent editor from handling this click (important to prevent text selection/deletion)
              return true;
            }
            
            // Find if the click was on AI-generated content
            let clickedOnAIContent = false;
            let aiContentRange: Range | null = null;
            
            // Get the position of the clicked node
            const clickPos = pos;
            
            // Find node at click position
            const node = doc.nodeAt(clickPos);
              
            // If the node has text and it's AI-generated, process it
            if (node && node.isText) {
              // If the cursor is within the AI-generated content, get all AI nodes in sequence
              const isAIGenerated = node.marks.some((mark: ProseMirrorMark) => 
                mark.type.name === 'aiGenerated' && 
                mark.attrs.status === 'pending');
                
              if (isAIGenerated) {
                // Find start and end of the continuous AI content
                let start = clickPos;
                let end = clickPos;
                
                // Find start of continuous AI content by looking backward
                for (let i = clickPos - 1; i >= 0; i--) {
                  const pos = state.doc.resolve(i);
                  const marksAtPos = pos.marks();
                  if (!marksAtPos.some((mark: ProseMirrorMark) => mark.type.name === 'aiGenerated')) {
                    break;
                  }
                  start = i;
                }
                
                // Find end of continuous AI content by looking forward
                for (let i = clickPos; i < doc.content.size; i++) {
                  const pos = state.doc.resolve(i);
                  const marksAtPos = pos.marks();
                  if (!marksAtPos.some((mark: ProseMirrorMark) => mark.type.name === 'aiGenerated')) {
                    break;
                  }
                  end = i;
                }
                
                aiContentRange = { from: start, to: end + 1 };
              }
            }
            // If we didn't click on AI-generated content, don't handle
            
            if (clickedOnAIContent && aiContentRange) {
              // Get the DOM node for the clicked position to calculate proper positioning
              const domAtPos = view.domAtPos(clickPos);
              const node = domAtPos.node;
              let rect;
              
              if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
                // For text nodes, get the parent element's rect
                rect = (node.parentNode as Element).getBoundingClientRect();
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                // For element nodes, get the element's rect
                rect = (node as Element).getBoundingClientRect();
              } else {
                // Fallback to using the click coordinates
                rect = { left: event.clientX, top: event.clientY, bottom: event.clientY };
              }
              
              // Dispatch custom event to show confirmation dialog
              // Position at left-top of the AI-generated text as requested
              const detail = {
                range: aiContentRange,
                position: { 
                  x: rect.left, 
                  y: rect.top - 5 // Position at the top with a small gap
                }
              };
              
              // Mark that confirmation dialog is shown
              isConfirmationShown = true;
              
              // Dispatch custom event to show the confirmation dialog
              document.dispatchEvent(
                new CustomEvent('aiContentClick', { detail })
              );
              
              // Prevent default editor behavior on this content
              return true; // Mark event as handled
            }
            
            return false; // Let other handlers process the event
          },
        },
      }),
    ];
  },
});

// Helper functions to accept or deny AI-generated content
export const acceptAIContent = (editor: Editor, range: Range) => {
  // Find all AI-generated content in the range and remove the mark
  editor.commands.setTextSelection(range);
  editor.commands.unsetMark('aiGenerated');
  
  // Reset dialog tracking state
  isConfirmationShown = false;
  
  // Focus editor after accepting content
  setTimeout(() => {
    editor.commands.focus();
  }, 10);
};

export const denyAIContent = (editor: Editor, range: Range) => {
  // Delete the AI-generated content in the range
  editor.commands.deleteRange(range);
  
  // Reset dialog tracking state
  isConfirmationShown = false;
  
  // Focus editor after deleting content
  setTimeout(() => {
    editor.commands.focus();
  }, 10);
};

// Close the confirmation dialog without taking any action
export const closeConfirmation = () => {
  isConfirmationShown = false;
};

// Helper to check if content is AI generated
export const isAIGenerated = (editor: Editor, position: number) => {
  const { state } = editor;
  const resolvedPos = state.doc.resolve(position);
  const marks = resolvedPos.marks();
  return marks.some((mark: ProseMirrorMark) => mark.type.name === 'aiGenerated');
};

// Helper to remove highlight from all AI generated content
export const removeAIHighlighting = (editor: Editor) => {
  // Find all AI-generated content and update its attribute to 'accepted'
  const { state } = editor;
  const { tr } = state;
  
  let transaction = tr;
  
  state.doc.descendants((node: ProseMirrorNode, pos: number) => {
    if (!node.isText) return true;
    
    const aiMark = node.marks.find((mark: ProseMirrorMark) => mark.type.name === 'aiGenerated');
    if (aiMark && aiMark.attrs.status === 'pending') {
      // Create a new mark with status 'accepted'
      const newMark = aiMark.type.create({ status: 'accepted' });
      
      // Replace the mark
      transaction = transaction.removeMark(pos, pos + node.nodeSize, aiMark.type);
      transaction = transaction.addMark(pos, pos + node.nodeSize, newMark);
    }
    
    return true;
  });
  
  if (transaction !== tr) {
    // Prevent triggering the auto-accept logic for this transaction
    transaction = transaction.setMeta('preventAutoAccept', true);
    
    // Use requestAnimationFrame instead of setTimeout for more reliable timing
    requestAnimationFrame(() => {
      // Check if editor is still valid
      if (editor && editor.view) {
        editor.view.dispatch(transaction);
      }
    });
  }
};
