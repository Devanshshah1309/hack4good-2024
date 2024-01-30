# Info for developers

- Frontend is in directory `client/`
  - Using React, TypeScript, [Vite](https://vitejs.dev/guide/)

- Backend is in directory `server/`
  - Using [NestJS](https://docs.nestjs.com/first-steps), TypeScript
  - NestJS has a [CLI](https://docs.nestjs.com/cli/overview)  that you may or may not need

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

  # Open another terminal to run backend
  cd server
  pnpm install
  pnpm run start:dev
  ```

- Node version: v16.14.2

