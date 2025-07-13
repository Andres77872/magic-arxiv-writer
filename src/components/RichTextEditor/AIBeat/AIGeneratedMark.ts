import { Mark } from '@tiptap/core';

export const AIGeneratedMark = Mark.create({
  name: 'aiGenerated',

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
});
