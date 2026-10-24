const KNOWN_EXISTING_FILES = new Set([
  'bellemere.jpg',
  'burger-house.jpg',
  'car-landing.jpg',
  'community-scheduler.jpg',
  'healthy-food.jpg',
  'indonesian-cusine.jpg',
  'joy-homes.jpg',
  'juliettehohnen.jpg',
  'lateeze.jpg',
  'macmanus-mobile.png',
  'macmanusfd-full.png',
  'macmanusfd.jpg',
  'meal-plan.jpg',
  'minimalist-studio-slider.jpg',
  'minimalist-studio-slider2.jpg',
  'my-cv-screenshot.jpg',
  'my-portfolio.jpg',
  'opengraph-image.png.jpg',
  'smoot-fruit-cake(blob-animate).jpg',
  'yogo-site.jpg'
]);

export function resolveValidImageSrc(imgSrc?: string | null): string {
  if (!imgSrc || !imgSrc.trim() || imgSrc === 'null' || imgSrc === 'undefined' || imgSrc === 'placeholder-portfolio.jpg') {
    return '/no-image-placeholder.svg';
  }
  let cleaned = imgSrc.trim();
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://') || cleaned.startsWith('data:')) {
    return cleaned;
  }
  if (cleaned.startsWith('/')) {
    cleaned = cleaned.slice(1);
  }
  if (cleaned.startsWith('uploads/')) {
    return `/${cleaned}`;
  }
  if (KNOWN_EXISTING_FILES.has(cleaned.toLowerCase())) {
    return `/${cleaned}`;
  }
  return '/no-image-placeholder.svg';
}

// Hosts allowed in next.config.js `images.remotePatterns`.
const OPTIMIZABLE_HOST = /(^|\.)public\.blob\.vercel-storage\.com$|^images\.unsplash\.com$/;

/**
 * Whether next/image can resize/convert this source. Local raster files and
 * allow-listed remote hosts can; SVGs, data URLs and unknown hosts must stay
 * `unoptimized` (the optimizer would reject them).
 */
export function canOptimizeImage(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith('data:') || /\.svg(\?|$)/i.test(src)) return false;
  if (src.startsWith('/')) return !src.startsWith('//');
  try {
    return OPTIMIZABLE_HOST.test(new URL(src).hostname);
  } catch {
    return false;
  }
}
