import '@testing-library/jest-dom/vitest';

// jsdom n'implémente pas le défilement : on le simule.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
