import { EditorContent as TipTapEditorContent } from '@tiptap/react';
import { type EditorContentProps } from './types';

export function EditorContent({ editor }: EditorContentProps) {
  return (
    <div className="editor-content-wrapper">
      <TipTapEditorContent editor={editor} />
    </div>
  );
} 