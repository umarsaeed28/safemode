# PocketBase

Lightweight backend for storing contact inquiries and Discovery Scorecard submissions.

## Run locally

1. **Download the PocketBase binary**
   - Go to [Releases](https://github.com/pocketbase/pocketbase/releases) and download the archive for your OS (e.g. `pocketbase_*_darwin_arm64.zip` for Mac M1/M2).
   - Unzip and place the `pocketbase` executable inside this folder (`/pocketbase/pocketbase`).

2. **Start PocketBase**
   ```bash
   cd pocketbase
   ./pocketbase serve
   ```
   - API: http://127.0.0.1:8090  
   - Admin UI: http://127.0.0.1:8090/_/

3. **Create admin user (first time only)**  
   Open the Admin UI, set an email and password. These are used by the app to write records and by the init script to create collections.

4. **Create collections (first time only)**  
   From the project root, with PocketBase running and env set:
   ```bash
   POCKETBASE_URL=http://127.0.0.1:8090 POCKETBASE_ADMIN_EMAIL=your@email.com POCKETBASE_ADMIN_PASSWORD=yourpassword node scripts/init-pocketbase.js
   ```
   Or create the two collections manually in the Admin UI using the schema in the main README (PocketBase section).

## Production

- Run PocketBase on your server (same `./pocketbase serve`) or use a process manager (systemd, Docker, etc.).
- Set `POCKETBASE_URL` in your app to the production PocketBase URL (e.g. `https://pb.yourdomain.com`).
- Use the same admin credentials (or a dedicated token) in `POCKETBASE_ADMIN_EMAIL` and `POCKETBASE_ADMIN_PASSWORD` for the Next.js server.
- Ensure `pb_data` is persisted (volume or host directory) so data survives restarts.

## Data location

- Local data is stored in `pocketbase/pb_data/` (created on first run). This folder is gitignored.
