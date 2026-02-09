# shipgate — Marketing site

One-page marketing site for shipgate (product + UX discovery studio). Deploys to GitHub Pages via Actions. Next.js 14 App Router, JavaScript, CSS Modules, contact form with Gmail via nodemailer.

## Run locally (Mac)

From the project root:

```bash
# Install dependencies
npm install

# Create env file (use your Gmail and App Password)
cp .env.local.example .env.local
# Edit .env.local: set GMAIL_USER, GMAIL_APP_PASSWORD, and optionally CONTACT_TO

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub Pages

Each push to `main` builds the site and pushes it to the `gh-pages` branch. To show the site (not the README):

1. **Settings** → **Pages**
2. **Build and deployment** → **Source**: choose **Deploy from a branch**
3. **Branch**: `gh-pages` · **Folder**: `/ (root)` · **Save**
4. After the next push, the site is at **https://&lt;username&gt;.github.io/producthero/**

## Create project from scratch (Mac)

If you need to create the project in a new folder:

```bash
mkdir producthero && cd producthero
npx create-next-app@latest . --js --no-typescript --no-tailwind --app --no-src-dir --import-alias "@/*"
# When prompted: use default options; say No to TypeScript and Tailwind.
npm install nodemailer
# Then copy in the app/, next.config.js, package.json (with nodemailer), .env.local.example, and .gitignore from this repo.
```

Or clone/copy this repo and run:

```bash
cd producthero
npm install
cp .env.local.example .env.local
# Edit .env.local with your Gmail credentials
npm run dev
```

## Env vars

| Variable | Required | Description |
|----------|----------|-------------|
| `GMAIL_USER` | Yes | Gmail address used to send mail |
| `GMAIL_APP_PASSWORD` | Yes | Gmail [App Password](https://support.google.com/accounts/answer/185833) (16 chars) |
| `CONTACT_TO` | No | Inbox for form submissions (defaults to `GMAIL_USER`) |

No secrets are committed; use `.env.local` (already in `.gitignore`).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — run Next.js lint

## File tree

```
producthero/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.js
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   └── page.module.css
├── .env.local.example
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```
