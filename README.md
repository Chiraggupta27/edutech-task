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
MONGO_URI=mongodb://127.0.0.1:27017/task_dashboard
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

Create/update `Frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Open:
- `http://localhost:5173`

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
- Tasks are user‑scoped (each user only sees their own tasks).
- Frontend stores JWT in `localStorage` and uses Axios interceptors to attach it to requests.
- UI includes filters, debounced search, pagination, skeleton loading, and delete confirmation.

