# Phaser 4 Filter Mask Clipping Cost Repro

Small Vite + TypeScript repro app for a Phaser 4 clipping performance issue.

The sample compares three modes on the same deterministic grid:

- `None`: baseline, no clipping.
- `Phaser Filter Mask`: every third container is clipped through Phaser 4 filter masks.
- `Rect/Bitmap Clip`: every third container uses a lightweight rectangular or bitmap clipping path.

The point is not that filters are bad. Filters are the right tool for effects that need filter
rendering. The issue is that simple rectangular or bitmap clipping is too common and too cheap as an
operation to require a per-item filter path.

Open the sample, compare FPS across the clipping modes, then increase grid size to amplify the cost.
The Phaser filter mask options are exposed to make the comparison fair, including the static-mask
best case with mask auto-update disabled.

## Local

```bash
pnpm install
pnpm dev
pnpm build
```

## StackBlitz

Create a Vite TypeScript project and copy these files:

- `package.json`
- `index.html`
- `tsconfig.json`
- `vite.config.ts`
- `src/main.tsx`
- `src/style.css`

The `package.json` uses normal npm dependencies so it can be pasted into StackBlitz.
