// React 18 doesn't know the camelCase `fetchPriority` prop: it warns and leaves it off
// the <img>, so the browser never gets the hint. The lowercase HTML attribute works.
// Spread it onto an image (plain <img> or framer-motion's motion.img):
//   <img {...fetchPriority('high')} />
export const fetchPriority = (value: 'high' | 'low' | 'auto') => ({ fetchpriority: value })
