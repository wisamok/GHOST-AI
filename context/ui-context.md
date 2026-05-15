# UI Context

## Theme

[Describe the overall visual language — e.g. Dark only.
No light mode. The design language is a dark technical
workspace — near-black backgrounds, layered surfaces,
and vivid accent colors for interactive elements.]

## Colors

[Define your color tokens as CSS custom properties.
All components must use these tokens — no hardcoded
hex values.]

| Role             | CSS Variable             | Value                       |
| ---------------- | ------------------------ | --------------------------- |
| Page background  | `--bg-base`              | `#080809`                   |
| Surface          | `--bg-surface`           | `#111114`                   |
| Elevated surface | `--bg-elevated`          | `#18181c`                   |
| Subtle surface   | `--bg-subtle`            | `#1e1e23`                   |
| Default border   | `--border-default`       | `#2a2a30`                   |
| Subtle border    | `--border-subtle`        | `#3a3a42`                   |
| Primary text     | `--text-primary`         | `#f0f0f4`                   |
| Secondary text   | `--text-secondary`       | `#c0c0cc`                   |
| Muted text       | `--text-muted`           | `#808090`                   |
| Faint text       | `--text-faint`           | `#505060`                   |
| Brand accent     | `--accent-primary`       | `#00c8d4`                   |
| Brand dim        | `--accent-primary-dim`   | `rgba(0, 200, 212, 0.12)`   |
| AI accent        | `--accent-ai`            | `#6457f9`                   |
| AI text          | `--accent-ai-text`       | `#8b82ff`                   |
| Error            | `--state-error`          | `#ff4d4f`                   |
| Success          | `--state-success`        | `#34d399`                   |
| Warning          | `--state-warning`        | `#fbbf24`                   |

## Typography

| Role      | Font              | Variable      |
| --------- | ----------------- | ------------- |
| UI text   | [e.g. Geist Sans] | `--font-sans` |
| Code/mono | [e.g. Geist Mono] | `--font-mono` |

## Border Radius

| Context           | Class            |
| ----------------- | ---------------- |
| Inline / small UI | `rounded-[size]` |
| Cards / panels    | `rounded-[size]` |
| Modals / overlays | `rounded-[size]` |

## Component Library

[e.g. shadcn/ui on top of Tailwind. Components live
in components/ui/. Use the CLI to add new components
rather than writing from scratch.]

## Layout Patterns

- [Pattern — e.g. Editor: full-viewport split with
  left sidebar, center canvas, right sidebar]
- [Pattern — e.g. Sidebars: fixed width with border separator]
- [Pattern — e.g. Modals: centered overlay with backdrop blur]
- [Pattern — e.g. Navbar: top bar with bottom border]

## Icons

[e.g. Lucide React. Stroke-based icons only. Sizes:
h-4 w-4 for inline, h-5 w-5 for buttons.]
