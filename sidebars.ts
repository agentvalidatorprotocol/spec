import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'About AVP',
      items: ['installation', 'introduction'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'core-concepts/lifecycle',
        'core-concepts/triggers',
        'core-concepts/severity',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['reference/schema'],
    },
    {
      type: 'category',
      label: 'Examples',
      items: ['examples/overview', 'examples/no-secrets'],
    },
  ],
};

export default sidebars;
