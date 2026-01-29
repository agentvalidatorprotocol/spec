import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Agent Validator Protocol',
  tagline: 'Prompts as validators for AI coding agents',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: process.env.URL || 'https://agentvalidatorprotocol.com',
  baseUrl: '/',

  organizationName: 'agentvalidatorprotocol',
  projectName: 'spec',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/agentvalidatorprotocol/spec/tree/main/spec/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'AVP',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/agentvalidatorprotocol/spec',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Installation',
              to: '/installation',
            },
            {
              label: 'Introduction',
              to: '/introduction',
            },
            {
              label: 'Schema Reference',
              to: '/reference/schema',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/agentvalidatorprotocol/spec',
            },
          ],
        },
      ],
      copyright: `Agent Validator Protocol. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['yaml', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
