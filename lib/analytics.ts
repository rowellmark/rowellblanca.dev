/**
 * Google Analytics (GA4) & GTM Event Tracking Utilities
 */

export interface GTagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

/**
 * Sends a custom event to Google Analytics (gtag.js)
 */
export const trackGtagEvent = ({ action, category, label, value, ...rest }: GTagEvent) => {
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: Function }).gtag === 'function') {
    (window as unknown as { gtag: Function }).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }
};

/**
 * Helper: Track contact form submissions (Lead Generation)
 */
export const trackContactForm = (method: string = 'contact_form') => {
  trackGtagEvent({
    action: 'generate_lead',
    category: 'Engagement',
    label: `Contact Form Submission via ${method}`,
  });
};

/**
 * Helper: Track CV / Resume downloads
 */
export const trackDownloadCV = () => {
  trackGtagEvent({
    action: 'file_download',
    category: 'Resource',
    label: 'Curriculum Vitae Download',
    file_name: 'resume.pdf',
  });
};

/**
 * Helper: Track testimonial review submissions
 */
export const trackReviewSubmission = (rating: number) => {
  trackGtagEvent({
    action: 'submit_review',
    category: 'Engagement',
    label: `Testimonial Rating: ${rating}`,
    value: rating,
  });
};

/**
 * Helper: Track project detail clicks
 */
export const trackProjectView = (projectTitle: string) => {
  trackGtagEvent({
    action: 'select_content',
    category: 'Portfolio',
    label: projectTitle,
    content_type: 'project',
  });
};
