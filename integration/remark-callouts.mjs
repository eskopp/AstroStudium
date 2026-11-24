import { visit } from 'unist-util-visit';

const TYPES = ['note', 'tip', 'important', 'warning', 'caution'];

export default function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const first = node.children[0];
      const text = first?.type === 'paragraph' ? first.children[0] : null;
      if (text?.type !== 'text') return;

      const match = text.value.match(/^\[!(\w+)\][ \t]*([^\n]*)\n?/);
      if (!match || !TYPES.includes(match[1].toLowerCase())) return;

      const type = match[1].toLowerCase();
      const title = match[2].trim() || type.charAt(0).toUpperCase() + type.slice(1);
      text.value = text.value.slice(match[0].length);
      if (!text.value) first.children.shift();
      if (first.children.length === 0) node.children.shift();

      node.data = { hName: 'div', hProperties: { className: ['callout', `callout-${type}`] } };
      node.children.unshift({
        type: 'paragraph',
        data: { hProperties: { className: ['callout-title'] } },
        children: [{ type: 'text', value: title }],
      });
    });
  };
}
