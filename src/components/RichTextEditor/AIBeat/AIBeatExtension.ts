import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AIBeat } from './index';

export const AIBeatExtension = Node.create({
  name: 'aiBeat',
  
  group: 'block',
  
  // AI Beat should be treated as an atom - a single unit
  atom: true,
  
  // This will ensure it's not merged with other nodes
  defining: true,
  
  // Isolate from the rest of the document during editing
  isolating: true,
  
  draggable: true,
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="ai-beat"]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'ai-beat', class: 'ai-beat-container' })];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(AIBeat);
  },
  
  addAttributes() {
    return {
      id: {
        default: () => `ai-beat-${Date.now()}`,
      },
    };
  },
});
