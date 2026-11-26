// Images retain their declared dimensions; no JS is needed to show a healthy image.
for (const image of document.querySelectorAll<HTMLImageElement>('img[data-managed-image]')) {
  const originalAlt = image.alt;
  const loaded = () => {
    if (image.dataset.imageState !== 'error') image.dataset.imageState = 'ready';
  };
  const failed = () => {
    if (image.dataset.imageState === 'error') return;
    image.dataset.imageState = 'error';
    if (image.hasAttribute('data-hero-image')) return; // Keep the readable dark hero surface.
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
    image.alt = originalAlt ? `Image unavailable: ${originalAlt}` : 'Image unavailable';
    // Inline fallback means a failed connection cannot prevent a second asset loading.
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360"><rect width="480" height="360" fill="#FAF7FB"/><path d="M204 142h72v56h-72z M208 192l18-22 13 15 13-10 20 17" fill="none" stroke="#70529A" stroke-width="3"/><circle cx="256" cy="156" r="5" fill="#70529A"/><text x="240" y="228" text-anchor="middle" font-family="sans-serif" font-size="17" fill="#6B6478">Image unavailable</text></svg>';
    image.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };
  image.dataset.imageState = 'loading';
  image.addEventListener('load', loaded);
  image.addEventListener('error', failed);
  if (image.complete) {
    if (image.naturalWidth > 0) loaded();
    else if (image.currentSrc || image.getAttribute('src')) failed();
  }
}
