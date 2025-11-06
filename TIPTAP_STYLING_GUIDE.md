# Tiptap + Tailwind Styling Integration Guide

## Overview
Your project combines **Tailwind CSS** (with custom HSL design tokens) and **Tiptap** editor styles. The integration lives in `src/index.css` using Tailwind's `@layer` system.

## Architecture

### 1. Design System (`index.css`)
```
Tailwind Base → Custom CSS Variables → Tiptap Variable Mapping → Component Styles
```

### 2. File Structure
```
src/
├── index.css                          # Main styles (Tailwind + Tiptap integration)
├── components/
│   ├── TiptapEditor/
│   │   └── Editor.css                 # Editor-specific styles (images, links)
│   └── tiptap-ui-primitive/
│       ├── toolbar/toolbar.scss       # Toolbar component styles
│       ├── tooltip/tooltip.scss       # Tooltip styles
│       ├── popover/popover.scss       # Popover styles
│       └── ...                        # Other UI primitives
```

## CSS Variable Mapping

### From Tailwind → Tiptap
| Tiptap Variable | Maps to Tailwind | Purpose |
|----------------|------------------|---------|
| `--tt-toolbar-bg-color` | `hsl(var(--card))` | Toolbar background |
| `--tt-toolbar-border-color` | `hsl(var(--border))` | Toolbar border |
| `--tt-radius-lg` | `var(--radius)` | Border radius |
| `--tt-gray-light-a-100` | `hsl(var(--border))` | Light borders |
| `--tt-gray-light-a-400` | `hsl(var(--muted-foreground))` | Placeholders |

### Benefits
- **Single source of truth**: Change colors in `:root` → affects both Tailwind and Tiptap
- **Dark mode**: `.dark` class automatically applies to toolbar
- **Consistency**: All components use the same design tokens

## Styling Tiptap Components

### Option 1: Use Tailwind classes directly (recommended for new components)
```jsx
<div className="rounded-lg border border-border bg-card p-4">
  <EditorContent editor={editor} />
</div>
```

### Option 2: Use the predefined classes from `index.css`
```jsx
// These classes now use your design system
<div className="tiptap-editor">
  <EditorContent editor={editor} />
</div>
```

### Option 3: Extend with custom CSS (for complex layouts)
```css
/* In your component CSS */
.my-custom-editor {
  /* Inherit base styles */
  @extend .tiptap-editor;
  
  /* Add custom styles using design tokens */
  box-shadow: var(--tt-shadow-elevated-md);
  max-width: 800px;
  margin: 0 auto;
}
```

## Toolbar Button States

Buttons automatically style based on state:
- **Default**: Transparent background
- **Hover**: Uses `--accent` color
- **Active**: Uses `--secondary` color (when formatting is applied)
- **Disabled**: 50% opacity
- **Focus**: Ring outline using `--ring` color

Example:
```jsx
// This button automatically gets all states styled
<button 
  onClick={() => editor.chain().focus().toggleBold().run()}
  data-state={editor.isActive('bold') ? 'active' : ''}
>
  Bold
</button>
```

## Dark Mode Support

Automatically handled via Tailwind's `.dark` class:
```jsx
// In your root component
<div className="dark"> {/* or light */}
  <Editor />
</div>
```

Variables that change in dark mode:
- Background colors (card, toolbar)
- Border colors
- Shadow intensity
- Text colors

## Customizing Colors

### Change toolbar colors globally
Edit `src/index.css`:
```css
:root {
  --tt-toolbar-bg-color: hsl(240 100% 95%); /* Light blue toolbar */
  --tt-toolbar-border-color: hsl(240 50% 70%);
}

.dark {
  --tt-toolbar-bg-color: hsl(240 20% 15%); /* Dark toolbar */
}
```

### Change button hover colors
Edit your Tailwind config or `index.css`:
```css
:root {
  --accent: 250 70% 60%; /* Changes hover color for toolbar buttons */
}
```

## Mobile Responsiveness

The toolbar automatically adapts:
- **Desktop**: Fixed top toolbar with scrolling
- **Mobile** (< 480px): Bottom toolbar (sticky footer) with horizontal scroll

Controlled in `toolbar.scss`:
```scss
@media (max-width: 480px) {
  .tiptap-toolbar[data-variant="fixed"] {
    position: absolute;
    bottom: 0;
    // ... mobile-specific styles
  }
}
```

## Common Customizations

### 1. Change editor min-height
```css
/* In index.css */
.tiptap-editor {
  min-height: 500px; /* Default: 300px */
}
```

### 2. Add custom font to editor content
```css
.ProseMirror {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
```

### 3. Style specific content (headings, lists, etc.)
```css
/* Add to Editor.css or index.css */
.ProseMirror {
  h1 { font-size: 2em; font-weight: 700; margin: 1em 0 0.5em; }
  h2 { font-size: 1.5em; font-weight: 600; margin: 0.8em 0 0.4em; }
  ul { list-style: disc; padding-left: 1.5em; }
  ol { list-style: decimal; padding-left: 1.5em; }
  code { background: hsl(var(--muted)); padding: 0.2em 0.4em; border-radius: 4px; }
}
```

### 4. Custom toolbar button styles
```css
/* Override default button styles */
.tiptap-toolbar button {
  /* Your custom styles */
  border-radius: 4px;
  padding: 0.4rem 0.6rem;
}

.tiptap-toolbar button[data-state="active"] {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

## Troubleshooting

### Styles not applying?
1. Check import order in `main.jsx`:
   ```jsx
   import './index.css'; // Should be first
   import './App.css';   // Then component styles
   ```

2. Ensure Tailwind processes the file:
   ```js
   // tailwind.config.js
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ]
   ```

3. Clear Vite cache:
   ```powershell
   npm run dev -- --force
   ```

### Dark mode not working?
Ensure parent component has `.dark` class:
```jsx
// In App.jsx or layout
<div className={isDarkMode ? 'dark' : ''}>
  <Editor />
</div>
```

### Toolbar appearing under other elements?
Check `z-index` in toolbar.scss:
```scss
.tiptap-toolbar[data-variant="fixed"] {
  z-index: 10; // Increase if needed
}
```

## Best Practices

1. **Keep component styles modular**: Don't modify `toolbar.scss` directly; extend in `index.css` or component CSS
2. **Use CSS variables**: Always reference design tokens (`--border`, `--accent`) instead of hardcoded colors
3. **Test both themes**: Always check light and dark mode when styling
4. **Mobile-first**: Test toolbar on small screens (< 480px)
5. **Accessibility**: Maintain focus states and keyboard navigation styles

## Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tiptap Styling Guide](https://tiptap.dev/docs/editor/guide/styling)
- Your design system variables: `src/index.css` (lines 15-70)
