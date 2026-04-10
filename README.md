# Task Management App (Interview Assignment)

Simple full-stack Task Management App with authentication and task CRUD.

## Stack

- Backend: Express.js + TypeScript + MongoDB (Mongoose)
- Auth: JWT in HTTP-only cookie
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- API client: Axios

## Features

- Register/Login/Logout
- Protected task APIs
- Create, read, update, delete tasks
- Mark tasks as Completed/Pending
- Filter tasks by status (All, Pending, Completed)
- Responsive UI

## Project Structure

- `backend` - Express API
- `frontend` - Next.js frontend

## Environment Variables

Create these files:

- `backend/.env`
- `frontend/.env.local`

### backend/.env

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/task_management_system
JWT_SECRET=replace_with_strong_secret
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Run Locally

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB (local or Docker)
- Git

### Option 1: Run with Docker (Recommended)

1. **Start MongoDB container:**
   ```bash
   docker-compose up -d
   ```

2. **Setup backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   ```

4. **Create environment files:**

   Create `backend/.env`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/task_management_system
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   CLIENT_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

   Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

5. **Start the applications:**

   In one terminal (backend):
   ```bash
   cd backend
   npm run dev
   ```

   In another terminal (frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

### Option 2: Run Without Docker

1. **Install MongoDB locally** or ensure your MongoDB is running on `localhost:27017`

2. **Setup backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   ```

4. **Create environment files (same as Option 1)**

5. **Start the applications:**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

### Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Troubleshooting

- **MongoDB connection error:** Ensure MongoDB is running on port 27017
- **Port already in use:** Change PORT in `backend/.env` or kill the process using the port
- **CORS errors:** Verify `CLIENT_ORIGIN` in backend `.env` matches your frontend URL
- **API not responding:** Check that the backend server is running and `NEXT_PUBLIC_API_URL` in frontend `.env.local` is correct

1. Install dependencies:

```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

2. Start local MongoDB via Docker:

```bash
npm run mongo:up
```

If Docker is not available, use MongoDB Community Server instead (macOS):

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

The backend URI in `backend/.env` already matches this local setup:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/task_management_system
```

3. Start both backend and frontend:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5001

To stop local MongoDB:

```bash
npm run mongo:down
```

To stop MongoDB Community service:

```bash
brew services stop mongodb-community@7.0
```

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Tasks (Protected)

- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Quick Demo Script (2-3 minutes)

1. Register a new user.
2. Add 2-3 tasks.
3. Mark one as Completed.
4. Filter by Completed and Pending.
5. Edit one task.
6. Delete one task.
7. Logout and show redirect to login.
