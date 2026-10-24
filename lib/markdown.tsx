import React from 'react';

// Minimal, dependency-free Markdown renderer for blog posts (the admin editor
// stores Markdown). Renders to React elements (no innerHTML), so post content
// can't inject markup. Supports #–#### headings (relative levels), paragraphs, - / * / 1. lists,
// > quotes, ``` code fences, --- rules, and inline **bold**, *italic*, `code`
// and [links](url). Styling comes from `.case-study-content` in globals.css.

export interface MarkdownHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[`*_[\]()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const token = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (m[1]) out.push(<code key={key}>{token.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={key}>{renderInline(token.slice(2, -2), key)}</strong>);
    else if (m[3]) out.push(<em key={key}>{renderInline(token.slice(1, -1), key)}</em>);
    else if (m[4]) {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/) || [];
      const safe = /^(https?:|mailto:|\/|#)/i.test(href || '') ? href : '#';
      const external = /^https?:/i.test(safe);
      out.push(
        <a key={key} href={safe} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {renderInline(label, key)}
        </a>
      );
    }
    last = start + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function renderMarkdown(source: string): { nodes: React.ReactNode[]; headings: MarkdownHeading[] } {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const nodes: React.ReactNode[] = [];
  const headings: MarkdownHeading[] = [];
  const usedIds = new Map<string, number>();
  let i = 0;
  let k = 0;
  const depths = lines.map((l) => l.trim().match(/^(#{1,4})\s/)?.[1].length).filter(Boolean) as number[];
  const baseDepth = depths.length ? Math.min(...depths) : 2;

  const uniqueId = (text: string) => {
    const base = slugify(text) || 'section';
    const n = usedIds.get(base) || 0;
    usedIds.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Code fence
    if (trimmed.startsWith('```')) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      i++;
      nodes.push(
        <pre key={k++}>
          <code>{code.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Headings: the shallowest level a post uses becomes h2 (the page owns the h1),
    // the next level h3 (both listed in the table of contents), anything deeper h4.
    const h = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const depth = h[1].length;
      const text = h[2].replace(/\s+#+$/, '');
      const rank = depth - baseDepth;
      if (rank <= 1) {
        const level: 2 | 3 = rank <= 0 ? 2 : 3;
        const id = uniqueId(text);
        headings.push({ id, text: text.replace(/[*`]/g, ''), level });
        const Tag = level === 2 ? 'h2' : 'h3';
        nodes.push(
          <Tag key={k++} id={id}>
            {renderInline(text, `h${k}`)}
          </Tag>
        );
      } else {
        nodes.push(<h4 key={k++}>{renderInline(text, `h${k}`)}</h4>);
      }
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      nodes.push(<hr key={k++} />);
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) quote.push(lines[i++].trim().replace(/^>\s?/, ''));
      nodes.push(<blockquote key={k++}>{renderInline(quote.join(' '), `q${k}`)}</blockquote>);
      continue;
    }

    // Lists
    const isUl = (s: string) => /^[-*+]\s+/.test(s.trim());
    const isOl = (s: string) => /^\d+[.)]\s+/.test(s.trim());
    if (isUl(trimmed) || isOl(trimmed)) {
      const ordered = isOl(trimmed);
      const items: string[] = [];
      while (i < lines.length && (ordered ? isOl(lines[i]) : isUl(lines[i]))) {
        items.push(lines[i].trim().replace(ordered ? /^\d+[.)]\s+/ : /^[-*+]\s+/, ''));
        i++;
      }
      const List = ordered ? 'ol' : 'ul';
      nodes.push(
        <List key={k++}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item, `l${k}-${j}`)}</li>
          ))}
        </List>
      );
      continue;
    }

    // Paragraph: gather consecutive plain lines
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|```|>|[-*+]\s|\d+[.)]\s|-{3,}$|\*{3,}$)/.test(lines[i].trim())
    ) {
      para.push(lines[i++].trim());
    }
    nodes.push(<p key={k++}>{renderInline(para.join(' '), `p${k}`)}</p>);
  }

  return { nodes, headings };
}

/** Rough reading time at ~220 words per minute. */
export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
