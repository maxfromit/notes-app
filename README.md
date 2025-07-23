# Notes App (Nuxt 3)

A minimal, modern single-page application for managing notes, each containing its own todo list. Built with Nuxt 3, Vue 3 Composition API, Pinia, and Tailwind CSS, this project demonstrates best practices in state management, UI/UX, and frontend architecture.

## Project Goal

The goal is to provide a simple, robust, and user-friendly interface for creating, editing, and managing notes with todo lists. The app is designed as a technical test assignment, focusing on clean code, maintainability, and a great developer experience.

## Main Features

- **Notes with Todos:**  
  Each note has a title and a list of todo items (checkbox + label).
- **Two-Page SPA:**
  - Main page: Lists all notes with a preview of their todos (read-only).
  - Edit page: Full editing of a note and its todos.
- **Note Actions:**
  - Create, edit, and delete notes (with confirmation dialogs).
  - Undo/redo changes while editing.
  - Cancel editing (with confirmation).
- **Todo Actions:**
  - Add, edit, delete, and mark todos as completed.
- **Persistent State:**  
  All notes and todos are saved in local storage and restored on reload.
- **Responsive & Cross-Browser:**  
  Fully responsive layout and cross-browser compatibility.
- **Modern UI:**  
  Built with Tailwind CSS and Nuxt UI for a clean, accessible interface.
- **Dockerized:**  
  Includes Dockerfile and docker-compose.yaml for easy local deployment.

## Interesting Aspects

- Uses Vue 3 Composition API and Pinia for state management.
- Undo/redo functionality for todos and notes.
- All state changes are persisted, ensuring no data loss on refresh.
- Modular, scalable codebase with best practices for Vue/Nuxt projects.
- Quick local setup with Docker.

## Tech Stack

- **Framework:** Nuxt 3, Vue 3 (Composition API)
- **State Management:** Pinia (+ persisted state plugin)
- **Styling:** Tailwind CSS, Nuxt UI
- **Utilities:** Lodash, Day.js
- **TypeScript:** Full type safety
- **Containerization:** Docker, Docker Compose

---

## Setup

Install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Preview the production build locally:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Docker

To run the app locally with Docker:

```bash
docker-compose up
```
