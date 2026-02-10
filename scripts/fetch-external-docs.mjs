#!/usr/bin/env node

/**
 * Fetches external documentation at build time so it stays in sync
 * with upstream sources without being copied into this repository.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const EXTERNAL_DOCS = [
  {
    url: 'https://raw.githubusercontent.com/swissarmyhammer/swissarmyhammer/main/doc/src/reference/avp-cli.md',
    dest: 'docs/reference/cli.md',
    frontmatter: {
      sidebar_position: 2,
      title: 'CLI Reference',
      description: 'Command-line reference for the avp tool',
    },
  },
];

async function fetchDoc({ url, dest, frontmatter }) {
  console.log(`Fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  let body = await res.text();

  // Strip the clap-markdown footer if present
  body = body.replace(/<hr\/>\s*<small>.*?<\/small>\s*$/s, '').trimEnd();

  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? `"${v}"` : v}`)
    .join('\n');

  const content = `---\n${fm}\n---\n\n<!-- This file is auto-generated at build time. Do not edit directly. -->\n<!-- Source: ${url} -->\n\n${body}\n`;

  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, content, 'utf-8');
  console.log(`Wrote ${dest}`);
}

try {
  await Promise.all(EXTERNAL_DOCS.map(fetchDoc));
} catch (err) {
  console.error('Warning: failed to fetch external docs:', err.message);
  console.error('Build will continue with stale or missing CLI reference.');
}
