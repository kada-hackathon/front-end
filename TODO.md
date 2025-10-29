# TODO: Convert Project to JSX (Remove TypeScript)

## Overview

Convert all .tsx files to .jsx by removing TypeScript annotations, and convert .ts config files to .js. Update references accordingly.

## Steps

- [ ] Convert all .tsx files in src/ to .jsx (remove TS syntax)
- [ ] Convert config files: tsconfig.json -> jsconfig.json, tailwind.config.ts -> tailwind.config.js, vite.config.ts -> vite.config.js
- [ ] Update package.json entry point from src/main.tsx to src/main.jsx
- [ ] Update index.html if needed
- [ ] Update any import statements that reference .tsx files
- [ ] Test build and run the project
