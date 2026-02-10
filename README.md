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
| `POCKETBASE_URL` | No | PocketBase API URL (e.g. `http://127.0.0.1:8090`) for storing inquiries and scorecard submissions |
| `POCKETBASE_ADMIN_EMAIL` | No | PocketBase admin email (for server-side writes) |
| `POCKETBASE_ADMIN_PASSWORD` | No | PocketBase admin password |
| `INTERNAL_DASH_PASSWORD` | No | Password for the internal dashboard at `/internal` (read-only view of inquiries and scorecard data) |

No secrets are committed; use `.env.local` (already in `.gitignore`).

## PocketBase (optional)

The site can store **contact inquiries** and **Discovery Scorecard submissions** in [PocketBase](https://pocketbase.io/) for a lightweight database and an internal read-only dashboard.

### Local DB connection (.env.local)

For the contact form and scorecard to save to PocketBase, add these to `.env.local` (same file as Gmail vars):

```
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@local.dev
POCKETBASE_ADMIN_PASSWORD=admin123
INTERNAL_DASH_PASSWORD=your-internal-password
```

Use the same email/password you set when creating the PocketBase superuser (e.g. via `./pocketbase superuser create EMAIL PASS` or the first-time admin UI). Restart the Next.js dev server after changing `.env.local`.

### Quick start (PocketBase + internal dashboard)

Do this once to run the DB and internal dashboard locally:

1. **Download PocketBase** for your OS from [releases](https://github.com/pocketbase/pocketbase/releases). Put the `pocketbase` binary inside the repo’s `pocketbase/` folder.

2. **Start PocketBase** (in a separate terminal):
   ```bash
   cd pocketbase && ./pocketbase serve
   ```

3. **Create admin user**: open http://127.0.0.1:8090/_/ and set an email + password.

4. **Add to `.env.local`** (same file as Gmail):
   ```bash
   POCKETBASE_URL=http://127.0.0.1:8090
   POCKETBASE_ADMIN_EMAIL=your@email.com
   POCKETBASE_ADMIN_PASSWORD=yourpassword
   INTERNAL_DASH_PASSWORD=your-internal-dash-password
   ```

5. **Create collections** (from project root, one time):
   ```bash
   node scripts/init-pocketbase.js
   ```
   (Uses the env vars above. If it fails, create the two collections manually in the Admin UI using the schema below.)

6. **Restart the Next dev server** so it picks up the new env vars.

7. **Use the site**: contact form and scorecard submissions are stored in PocketBase. Open **http://localhost:3000/internal**, enter `INTERNAL_DASH_PASSWORD`, to view and search records.

### Run PocketBase locally (detail)

1. **Download the binary** from [PocketBase releases](https://github.com/pocketbase/pocketbase/releases) for your OS. Place the `pocketbase` executable in the `pocketbase/` folder.
2. **Start PocketBase:**
   ```bash
   cd pocketbase && ./pocketbase serve
   ```
   - API: http://127.0.0.1:8090  
   - Admin UI: http://127.0.0.1:8090/_/
3. **Create an admin user** (first time only) in the Admin UI.
4. **Create the two collections** (first time only). Either run the init script from the project root:
   ```bash
   POCKETBASE_URL=http://127.0.0.1:8090 POCKETBASE_ADMIN_EMAIL=your@email.com POCKETBASE_ADMIN_PASSWORD=yourpassword node scripts/init-pocketbase.js
   ```
   Or create them manually in the Admin UI. See `pocketbase/README.md` and the schema below.

### Collections schema

- **inquiries**: `email` (text, required), `name`, `company`, `role`, `message` (required), `website`, `source`, `page_url`, `utm_source`, `utm_medium`, `utm_campaign`, `status` (select: new, triaged, responded, closed; default new), `notes`, `created` (auto). If you created the collection before `website` was added, add a Text field `website` (optional) in PocketBase Admin → Collections → inquiries.
- **scorecard_submissions**: `email` (text, required), `score_total` (number, required), `tier` (select: guessing, partial_clarity, defensible_bet), `answers` (json, required), `ip_hash`, `user_agent`, `source`, `page_url`, `created` (auto). Indexes: email, tier, created.

### Production

Run PocketBase on your server (e.g. `./pocketbase serve` or via Docker/systemd). Set `POCKETBASE_URL` and admin credentials in your app env. Persist the `pocketbase/pb_data` directory so data survives restarts.

### Internal dashboard

With `INTERNAL_DASH_PASSWORD` set, open **/internal** on the site. Enter the password to view read-only stats, search by email, and browse recent inquiries and scorecard submissions. Each record can be opened in the PocketBase Admin UI for full editing.

### Verifying storage and searching actual records

If nothing appears to be stored:

1. **Check env** — In `.env.local` you must have `POCKETBASE_URL`, `POCKETBASE_ADMIN_EMAIL`, `POCKETBASE_ADMIN_PASSWORD`, and (for the dashboard) `INTERNAL_DASH_PASSWORD`. Restart the Next.js dev server after changing env.
2. **PocketBase running** — In a separate terminal: `cd pocketbase && ./pocketbase serve`. The API should be at http://127.0.0.1:8090.
3. **Collections exist** — From project root: `POCKETBASE_URL=http://127.0.0.1:8090 POCKETBASE_ADMIN_EMAIL=your@email.com POCKETBASE_ADMIN_PASSWORD=yourpassword node scripts/init-pocketbase.js`. This creates `inquiries` and `scorecard_submissions`.
4. **Contact form** — The form only accepts **company emails** (no Gmail, Yahoo, etc.). For a quick test use something like `you@yourcompany.com` or add a test domain.
5. **Scorecard** — Submit the Discovery Scorecard with any valid email; it writes to `scorecard_submissions`.

**Where to search:**

- **Internal dashboard** — Open **http://localhost:3000/internal**, log in with `INTERNAL_DASH_PASSWORD`. You’ll see total counts and “Recent inquiries” / “Recent scorecard submissions”. Use the **Search by email** field to filter by email (partial match). Click a row to open the full record.
- **PocketBase Admin** — Open **http://127.0.0.1:8090/_/**, log in with your PocketBase admin email/password. Go to **Collections** → **inquiries** or **scorecard_submissions** to view, filter, and search all records.

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
