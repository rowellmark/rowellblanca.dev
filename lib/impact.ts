/**
 * Measured, per-project numbers for the /results page, keyed by project permalink.
 * Add only figures you can back up (analytics, PageSpeed reports, client sign-off): each
 * one is published as a claim. The "Measured improvements" section stays hidden while
 * this is empty.
 *
 * Example:
 *   'tower-fire': [
 *     { label: 'Mobile PageSpeed', before: '41', after: '96' },
 *     { label: 'Largest Contentful Paint', before: '4.8s', after: '1.3s' },
 *   ],
 */
export interface ImpactMetric {
  label: string;
  before?: string;
  after: string;
  /** Where the number comes from, e.g. "PageSpeed Insights, March 2026". */
  source?: string;
}

export const PROJECT_METRICS: Record<string, ImpactMetric[]> = {};

/** Headline figures already published on the About page; keep the two in sync. */
export const HEADLINE_FIGURES = [
  { value: '12+', label: 'Years building for the web', note: 'Since 2012: agency, product and freelance roles' },
  { value: '50+', label: 'Production builds shipped', note: 'Web apps, portals, WordPress sites and plugins' },
  { value: '100%', label: 'Upwork job success', note: 'Top Rated across US, UK and European clients' },
  { value: 'UK·US·AU', label: 'Client time zones covered', note: 'Plus Hong Kong and the Philippines' },
];
