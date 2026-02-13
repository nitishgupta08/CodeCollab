![CodeCollab Logo](/images/logo.png)

# CodeCollab

Collaborative coding spaces with real-time sync, shareable invite IDs, and role-aware editing.

## What CodeCollab Does

CodeCollab is a MERN-based web app where multiple users can work in the same code space. It supports authenticated workspace management and guest read-only access for shared space links.

## Key Features

- Real-time code collaboration powered by Socket.IO.
- Shareable space IDs for inviting collaborators.
- Authenticated dashboard to create, join, rename, and delete spaces.
- Guest mode: users without an account can open a space and join as read-only viewer.
- Role-aware permissions for editing code and file metadata.
- User settings for name, preferred language/theme, and password updates.
- Multiple language options in editor workflow (for example: JavaScript, Python, Java, C++).

## How to Use

1. Open CodeCollab and either:
   - Join an existing space with a space ID and display name, or
   - Sign up / log in to create and manage your own spaces.
2. Share the space ID with collaborators.
3. Collaborators join the same space and edits sync live.
4. Permissions apply by role:
   - `owner`: full control (rename/delete/edit/manage space data)
   - `editor`: edit code and file metadata
   - `viewer/guest`: read-only

## Local Setup

### 1) Clone the repository

```bash
git clone git@github.com:nitishgupta08/CodeCollab.git
cd CodeCollab
```

### 2) Backend setup

```bash
cd backend
npm install
npm run server:dev
```

Backend production run:

```bash
npm run server:prod
```

### 3) Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run start
```

Frontend additional commands:

```bash
npm run build
npm run test
npm run preview
```

## Environment Variables

Create a `.env` file in each app directory.

### `backend/.env`

- `MONGO_SERVER_URI`
- `JWT_SECRET`
- `PORT`

### `frontend/.env`

- `VITE_BACKEND_URL`
- `REACT_APP_BACKEND_URL` (supported as fallback)

## Available Scripts

### Backend (`/backend/package.json`)

- `npm run server:dev` - start backend with `nodemon`
- `npm run server:prod` - start backend with Node.js

### Frontend (`/frontend/package.json`)

- `npm run start` - start Vite dev server
- `npm run build` - create production build
- `npm run test` - run Vitest tests
- `npm run preview` - preview production build locally

## API and Realtime Summary

### Interactive API Docs

- Backend landing endpoint: `http://localhost:5000/` (service status + quick links)
- Open Swagger UI at `http://localhost:5000/docs`
- Raw OpenAPI spec is available at `http://localhost:5000/openapi.json`

### Swagger Quickstart (`/docs`)

1. Start backend: `cd backend && npm run server:dev`
2. Open `http://localhost:5000/docs`
3. Run `POST /users/register` or `POST /users/login` and copy `token` from response.
4. Click **Authorize** in Swagger UI.
5. Paste: `Bearer <your_token>`
6. Test protected endpoints such as `GET /users/me`, `GET /spaces`, or `PUT /spaces/{id}`.

### Realtime (Socket.IO)

- Clients join a space room and receive active-user updates.
- Code sync events propagate in real time.
- File metadata (name/language) sync is permission-aware.
- Viewer/guest sessions are read-only; edit events require owner/editor permissions.

## Tech Stack

- Frontend: React, Vite, Material UI, Redux, CodeMirror
- Backend: Node.js, Express, MongoDB, Mongoose
- Realtime: Socket.IO
- Auth: JWT

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with clear context and reproduction steps where applicable.

## Code of Conduct

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE)
