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
