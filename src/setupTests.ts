// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement scrolling; ScrollToTop calls it on every route change.
if (typeof window !== "undefined") {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

    // jsdom has no IntersectionObserver; scroll-in animations (framer-motion whileInView) need it.
    class MockIntersectionObserver {
        readonly root = null;
        readonly rootMargin = "";
        readonly thresholds: number[] = [];
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() { return []; }
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    // jsdom doesn't play media; the landing video calls play()/pause().
    window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = vi.fn();
}
