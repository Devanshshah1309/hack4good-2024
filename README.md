# Info for developers

- Frontend is in directory `client/`
  - Using React, TypeScript, Vite

- Backend is in directory `server/`
  - Using NestJS, TypeScript

- We are using `pnpm` instead of `npm` for package management for both client and server
  - `pnpm` is faster than `npm`
  - Install `pnpm` [here](https://pnpm.io/installation)
  - Use `pnpm install` instead of `npm install`
  - Notice the `pnpm-lock.yaml` file instead of `package-lock.json`

- To run locally for development:
  
  ```bash
  # Run frontend
  cd client
  pnpm install
  pnpm run dev

  # Run backend
  cd ../server
  pnpm install
  pnpm run start:dev
  ```

- Node version: v16.14.2

