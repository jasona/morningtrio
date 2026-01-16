require('@testing-library/jest-dom');

// Polyfill structuredClone for jsdom
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock indexedDB for Dexie
require('fake-indexeddb/auto');
