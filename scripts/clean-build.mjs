import { rm } from 'node:fs/promises';

// Resolve relative to this script, not the caller's working directory.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
console.log('Removed previous production output.');
