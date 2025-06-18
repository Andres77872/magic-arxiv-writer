import { EditorContent as TipTapEditorContent } from '@tiptap/react';
import { type EditorContentProps } from './types';
import './EditorContent.css';

export function EditorContent({ editor, height, isFullscreen }: EditorContentProps) {
  return (
    <div className="editor-content-wrapper">
      <div className="editor-scroll-container">
        <TipTapEditorContent editor={editor} />
      </div>
    </div>
  );
} 