# Task Management Dashboard (MERN)

Full‑stack Task Management Dashboard with authentication and task CRUD.

## Tech Stack

### Frontend
- React (JSX only)
- Redux Toolkit
- React Hook Form
- Axios (with interceptors)
- CSS

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- express-validator
- dotenv + cors

### Application URL

- Frontend Production Url: `https://edutech-task-eight.vercel.app/`  

## Deployment (Render + Vercel)

### Backend → [Render](https://render.com) (Web Service)

1. **New → Web Service** → connect GitHub repo.  
2. **Root Directory:** `Backend` (monorepo).  
3. **Build Command:** `npm install` · **Start Command:** `npm start`  
4. **Environment variables** on Render:

   | Name | Notes |
   |------|--------|
   | `MONGO_URI` | MongoDB Atlas connection string |
   | `JWT_SECRET` | Strong secret (different from `.env.example`) |

   **Do not set `PORT` manually** — Render injects `process.env.PORT` (already used in `Backend/server.js`).

5. **MongoDB Atlas → Network Access:** allow **`0.0.0.0/0`** (or Render static outbound IPs if you use that plan) so the cloud API can reach the cluster.

6. **Health check (optional):** `GET https://YOUR-SERVICE.onrender.com/api/health`

7. **CORS:** In `Backend/app.js`, add your **frontend origin** inside `allowedOrigins` (e.g. `https://your-app.vercel.app`). Localhost entries can stay for dev.

---

### Frontend → [Vercel](https://vercel.com)

1. **Import project** → same repo · **Framework Preset:** **Vite**  
2. **Root Directory:** `Frontend` · **Install:** `npm install` · **Build:** `vite build` (default) · **Output:** `dist`

3. **Environment variables** (`Settings → Environment Variables`):

   - **Name:** `VITE_API_BASE_URL`  
   - **Value:** `https://YOUR-SERVICE.onrender.com/api` (your Render API URL, **must** include **`https://`** and end with **`/api`**)  
   - Apply to **Production** and **Preview** as needed, then **Redeploy.**  
     Vite bakes env at **build time** — changing the variable alone does not affect an old deployment until you redeploy.

4. **`Frontend/vercel.json`** SPA fallback reloads **`/login`**, **`/dashboard`**, etc. without a server 404. Keep it committed at the Frontend root next to `package.json`.

5. **`Backend` CORS:** must match the exact **`https://...vercel.app`** origin (scheme + host, usually no trailing slash).

---

### Quick deploy checklist

- [ ] Render service shows **Running** · `/api/health` returns `{ "success": true, ... }`   
- [ ] Vercel `VITE_API_BASE_URL` = Render base **`…/api`** · **Redeploy** after edits  
- [ ] Backend `allowedOrigins` includes the live Vercel URL  

## Folder Structure

```
Backend/
  config/db.js
  controllers/
  middleware/
  models/
  routes/
  utils/
  app.js
  server.js
  package.json

Frontend/
  src/
    app/store.js
    components/
    features/
    pages/
    services/axiosInstance.js
    styles/
    utils/
    App.jsx
    main.jsx
  package.json
  vercel.json          # SPA rewrites (/login reload → index.html)
  vite.config.js
```

## Setup

### 1) Backend setup

```bash
cd Backend
npm install
```

Create/update `Backend/.env`:

```bash
PORT=5000
MONGO_URI=mongo_db_uri
JWT_SECRET=change_me_in_production
```

Run backend:

```bash
npm run dev
```

Backend health check:
- `GET /api/health`

### 2) Frontend setup

```bash
cd Frontend
npm install
```

Create/update `Frontend/.env` (copy from `Frontend/.env.example`):

```bash
# Full backend base URL — must NOT be your Vercel URL
VITE_API_BASE_URL=https://your-service.onrender.com/api
```

Locally this points at your machine or Render URL; **on Vercel** set the **same variable name** with your **Render `/api`** URL and redeploy.

Run frontend:

```bash
npm run dev
```

## Troubleshooting: MongoDB Atlas DNS (ECONNREFUSED querySrv)

If you see an error like:

`querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net`

This is **not a backend code issue**. It usually means your current network/DNS blocks MongoDB Atlas **SRV record** lookup (`mongodb+srv://...`).

- **Recommended (assignment/dev)**: use local MongoDB (no SRV DNS required)

```bash
MONGO_URI=mongodb://127.0.0.1:27017/task_dashboard
```

- **Atlas without SRV**: use Atlas “Standard connection string” (`mongodb://...`) instead of `mongodb+srv://...`.

- **System DNS fix (developer machine setting)**:
  - Set DNS to Cloudflare `1.1.1.1` / `1.0.0.1` or Google `8.8.8.8` / `8.8.4.4`
  - Then run: `ipconfig /flushdns`

**PowerShell (Run as Administrator) quick test (Windows):**

```powershell
# Set Cloudflare DNS (IPv4) for your active network adapter
$iface = (Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object -First 1).InterfaceAlias
Set-DnsClientServerAddress -InterfaceAlias $iface -ServerAddresses ("1.1.1.1","1.0.0.1")
ipconfig /flushdns
```

**Revert to automatic DNS (DHCP):**

```powershell
$iface = (Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object -First 1).InterfaceAlias
Set-DnsClientServerAddress -InterfaceAlias $iface -ResetServerAddresses
ipconfig /flushdns
```

> Note: DNS configuration is a **system-level** setting and should not be changed by the app code. Documenting this here helps developers whose networks block SRV lookups.

## API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Tasks (protected)
- `POST /api/tasks`
- `GET /api/tasks` (supports `status`, `search`, `page`, `limit`)
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

## Response Format

All APIs return:

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

## Notes
- SPA hosting: reloading routes like **`/login`** needs **`vercel.json`** rewrites; otherwise static hosts return **404**.
- Tasks are user‑scoped (each user only sees their own tasks).
- Frontend stores JWT in `localStorage` and uses Axios interceptors to attach it to requests.
- UI includes filters, debounced search, pagination, skeleton loading, and delete confirmation.

