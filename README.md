# Pixel & Ping — Showcase Website

> **Control your network. See everything.**
> A cinematic, immersive showcase website for the Pixel & Ping product.
> Frontend-only, static, deployable to GitHub Pages for free.

## 🌊 v3 — "Ink & Tide" premium redesign

A fusion of [Scrolltide](https://www.scrolltide.co/)'s cinematic aesthetic
with the Pixel & Ping immersive canvas:

| Token | Value | Role |
|---|---|---|
| Ink | `#07080a` / `#0b0d10` | deep neutral backgrounds |
| Bone | `#f3f5f8` | primary text |
| Tide | `#46b7ff` | the single hero accent |
| Deep ocean | `#2e7dff` | gradient partner |
| Seafoam | `#8bf3e6` | secondary highlight |

**Typography:** Bricolage Grotesque (display) · Inter (body) · Space Mono (labels)
**Motion:** ease-out-quint `cubic-bezier(.22,1,.36,1)` everywhere
**Geometry:** floating pill nav, rounded-2xl cards, hairline borders
**Signature details:** infinite module marquee, tide-glow hover lifts,
particle canvases retuned to ocean hues, pill CTAs in hero & finale.

This repository contains a premium, scroll-driven, WebGL-accelerated
showcase experience. It is **presentational only** — no backend, no
database, no API, no authentication, no fake data, no pricing, no
contact forms. Just the product, told as a continuous visual story.

---

## ⚡ Quick start (3 commands)

```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build into ./dist
```

> **Node 18+** is required (Node 20 LTS is recommended).

---

## 🚀 Deploy to GitHub Pages (one-time setup)

This repo already includes a GitHub Actions workflow
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) that
builds and deploys the site automatically on every push to `main`.

### Step 1 — Set the correct `base` path

Open [`vite.config.ts`](vite.config.ts). Near the top you'll see:

```ts
const repoName = 'pixel-ping-showcase';
```

Change this to **exactly match your GitHub repository name** (case-sensitive).
If your repo is `https://github.com/your-name/cool-site`, set:

```ts
const repoName = 'cool-site';
```

> If you are deploying to a **user/organization page**
> (`https://<username>.github.io/` — repo name `<username>.github.io`),
> the base path must be `/` (root). In that case set:
> `base: process.env.VITE_BASE_PATH || '/'`

### Step 2 — Push the code to GitHub

```bash
# from the project root
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Open your repo on GitHub → **Settings** → **Pages**
2. Under **"Build and deployment"** → **Source**, choose:
   **GitHub Actions** (not "Deploy from a branch")
3. Wait ~1 minute. The Actions tab will show a green ✓ when done.

Your site is now live at:

```
https://<your-username>.github.io/<repo-name>/
```

Every future `git push` to `main` will rebuild and redeploy automatically.

---

## 📁 Project structure

```
.
├── .github/workflows/deploy.yml   # GitHub Pages auto-deploy
├── public/                        # static assets (favicon, robots, sitemap)
├── src/
│   ├── components/                # reusable UI (Nav, Cursor, Canvas, …)
│   ├── sections/                  # one file per story section
│   ├── three/                     # React Three Fiber hero scene
│   ├── hooks/                     # useReducedMotion, useInView
│   ├── styles/global.css          # design system + tokens
│   ├── data/sections.ts           # section catalog (single source of truth)
│   ├── utils/math.ts              # small helpers
│   ├── App.tsx                    # app shell + smooth scroll
│   └── main.tsx                   # React entry
├── index.html                     # SEO meta, fonts, root
├── vite.config.ts                 # Vite + base path for GH Pages
├── tsconfig.json
└── package.json
```

---

## 🎨 Tech stack

- **Vite 5** + **React 18** + **TypeScript 5** — modern, fast, type-safe
- **Three.js** + **React Three Fiber** — 3D hero scene (particle network, glowing core)
- **Canvas 2D** — reliable procedural visualizations for the abstract sections
- **Lenis** — buttery-smooth scroll
- **CSS custom properties** — a single coherent design system (no Tailwind, no UI lib)
- **Zero backend. Zero paid services. Zero external APIs.**

---

## ♿ Accessibility & performance

- Full keyboard navigation, visible focus states, semantic HTML
- `prefers-reduced-motion: reduce` is respected everywhere — major animations
  are disabled, content remains fully visible
- WebGL fallback: if WebGL is unavailable, the hero shows a CSS-only animated
  core instead of a black screen
- Responsive: dedicated mobile layout (simplified 3D, fewer particles,
  stacked columns, compact menu)
- Lazy-loaded 3D scene keeps the initial JS bundle small

---

## 🛠️ Scripts

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start Vite dev server with HMR               |
| `npm run build`      | Type-check + production build into `./dist`  |
| `npm run build:fast` | Same as above, skip type-check               |
| `npm run preview`    | Preview the production build locally         |
| `npm run typecheck`  | Run `tsc --noEmit` only                      |

---

## 📝 Notes

- All product screenshots are real and used unmodified (only resized for
  performance). No fake numbers, no invented UI.
- The only external links on the site are the social links (Telegram, YouTube).
- No analytics, no tracking, no cookies.

---

## راهنمای فارسی — Deploy روی GitHub Pages

این پروژه آماده‌ست. برای پابلیش روی گیت‌هاب:

۱. فایل `vite.config.ts` رو باز کن و مقدار `repoName` رو دقیقاً همون اسم
   ریپوی گیت‌هاب خودت بذار (به حروف بزرگ/کوچیک حساسه).

۲. سه دستور زیر رو در ترمینال بزن (از پوشه پروژه):

```bash
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git branch -M main
git push -u origin main
```

۳. توی صفحه گیت‌هاب ریپو: **Settings → Pages → Source = GitHub Actions**

بعد از حدود یک دقیقه، سایتت روی این آدرس زنده می‌شه:

```
https://<USERNAME>.github.io/<REPO>/
```

هر بار که `git push` بزنی، سایت خودکار آپدیت می‌شه.
