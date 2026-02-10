import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'About AVP',
      items: ['introduction', 'installation'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'core-concepts/lifecycle',
        'core-concepts/triggers',
        'core-concepts/severity',
        'core-concepts/rulesets',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['reference/schema', 'reference/cli'],
    },
    {
      type: 'category',
      label: 'Examples',
      items: ['examples/overview', 'examples/no-secrets', 'examples/security-ruleset'],
    },
  ],
};

export default sidebars;
