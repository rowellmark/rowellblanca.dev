import type { PortfolioProject } from '@/components/ui/portfolio-card';

export type PluginCategory = 'SEO' | 'AI' | 'CRM' | 'Security' | 'Developer tools';
export type PluginPreview = 'serp' | 'login' | 'chat' | 'kanban' | 'schema';

export interface PluginEntry {
  key: string;
  name: string;
  tagline: string;
  category: PluginCategory;
  preview: PluginPreview;
  features: string[];
  /** Detail page: a dedicated plugin page or the project's case study. */
  href: string;
  meta?: string;
}

/**
 * Card copy for known plugins, keyed by the folder in the project's `url`
 * (wp-content/plugins/<folder>) so it survives permalink changes in the admin.
 * A plugin project without an entry here still gets a card, built from its description.
 */
const PLUGIN_META: Record<string, Partial<PluginEntry>> = {
  'buildforuser-leads': {
    name: 'BuildForUser Leads',
    tagline: 'A CRM inside WordPress: captures form leads into a Kanban pipeline and drafts AI follow-ups for you to approve.',
    category: 'CRM',
    preview: 'kanban',
    features: [
      'Captures Kadence, WPForms and Contact Form 7 submissions',
      'Kanban pipeline with notes, tasks and owners',
      'AI summaries, lead scoring and email drafts (OpenAI, Claude, Gemini, Ollama)',
      'Human review before any email is sent',
    ],
  },
  'buildforuser-chatbox': {
    name: 'BuildForUser Chatbot',
    tagline: 'An AI chat widget that answers from your own pages, posts and documents with a RAG knowledge base.',
    category: 'AI',
    preview: 'chat',
    features: [
      'Imports pages, posts, documents and FAQs into a knowledge base',
      'OpenAI or local Ollama models with your own persona',
      'Floating widget or [blanc_chatbox] shortcode',
      'React admin for transcripts and email alerts',
    ],
  },
  'buildforuser-schema-ld-generator': {
    name: 'BuildForUser Schema LD',
    tagline: 'A visual JSON-LD builder that merges site-wide and per-post schema into one valid graph.',
    category: 'SEO',
    preview: 'schema',
    features: [
      'Visual schema blocks in the editor and admin',
      'Deduplicated @graph output from a PSR-4 PHP pipeline',
      'Live AJAX preview of the exact JSON-LD',
      'Works alongside Yoast SEO and All in One SEO',
    ],
  },
  'buildforuser-login-customizer': {
    name: 'Login Customizer',
    tagline: 'A branded split-panel login screen and a secret login URL that hides wp-login.php from bots.',
    category: 'Security',
    preview: 'login',
    features: [
      'Branded split-panel login replacing wp-login.php',
      'Live logo, background, colour and tagline settings',
      'Custom login slug; /wp-login.php returns a 404',
      'Shares the BuildForUser Dashboard admin shell',
    ],
  },
};

/** BuildForUser SEO has its own page rather than a project row, so it is listed here. */
export const STANDALONE_PLUGINS: PluginEntry[] = [
  {
    key: 'buildforuser-seo',
    name: 'BuildForUser SEO',
    tagline: 'An all-in-one SEO engine with live SERP previews, multi-keyword audits, XML sitemaps and redirects, with no paywalls.',
    category: 'SEO',
    preview: 'serp',
    href: '/plugins/buildforuser-seo',
    meta: 'v1.0.0 · WP 5.8+ · PHP 7.4+',
    features: [
      'Live Google, Facebook & X previews with a pixel-width meter',
      'Primary + up to 5 secondary keyphrase audit',
      'XML sitemaps, 301/410 redirects and CSV import',
      'llms.txt endpoints for AI search',
    ],
  },
];

/** Names of the plugins with curated cards, for CTAs that list them without loading projects. */
export const PLUGIN_NAMES = [
  ...STANDALONE_PLUGINS.map((p) => p.name),
  ...Object.values(PLUGIN_META).map((m) => m.name as string),
];

export function isPluginProject(p: Pick<PortfolioProject, 'url' | 'permalink' | 'technologies'>) {
  return (
    Boolean(p.url?.startsWith('wp-content')) ||
    Boolean(p.permalink?.includes('plugin')) ||
    Boolean(p.technologies?.some((t) => t.toLowerCase().includes('plugin')))
  );
}

function guessCategory(text: string): PluginCategory {
  if (/\bai\b|chat|rag|gpt|llm/i.test(text)) return 'AI';
  if (/seo|schema|sitemap/i.test(text)) return 'SEO';
  if (/crm|lead/i.test(text)) return 'CRM';
  if (/security|login|firewall/i.test(text)) return 'Security';
  return 'Developer tools';
}

const PREVIEW_FOR: Record<PluginCategory, PluginPreview> = {
  SEO: 'serp',
  AI: 'chat',
  CRM: 'kanban',
  Security: 'login',
  'Developer tools': 'schema',
};

/** "1. Title: detail" lines from a description's HOW IT WORKS list. */
function featuresFrom(description = '') {
  return description
    .split('\n')
    .map((line) => line.match(/^\s*\d+\.\s*([^:]+):/)?.[1]?.trim())
    .filter((f): f is string => Boolean(f))
    .slice(0, 4);
}

export function pluginFromProject(project: PortfolioProject): PluginEntry {
  const folder = project.url?.match(/wp-content\/plugins\/([^/]+)/)?.[1] || '';
  const meta = PLUGIN_META[folder] || {};
  const text = `${project.sitename} ${(project.technologies || []).join(' ')}`;
  const category = meta.category || guessCategory(text);
  const firstSentence = (project.description || '').split('\n')[0].split(/(?<=\.)\s/)[0];
  return {
    key: project.permalink,
    name: meta.name || project.sitename.split(' — ')[0],
    tagline: meta.tagline || firstSentence,
    category,
    preview: meta.preview || PREVIEW_FOR[category],
    features: meta.features || featuresFrom(project.description),
    href: `/mywork/${project.permalink}`,
    meta: meta.meta || 'WordPress plugin',
  };
}

/** Every plugin: the standalone pages first, then plugin projects from the portfolio. */
export function pluginsFromProjects(projects: PortfolioProject[]): PluginEntry[] {
  return [...STANDALONE_PLUGINS, ...projects.filter(isPluginProject).map(pluginFromProject)];
}
