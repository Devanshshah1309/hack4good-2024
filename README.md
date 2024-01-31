# Info for developers

- Frontend is in directory `client/`
  - Using React, TypeScript, [Vite](https://vitejs.dev/guide/)

- Backend is in directory `server/`
  - Using [NestJS](https://docs.nestjs.com/first-steps), TypeScript, MySQL ([Planetscale](https://planetscale.com/))
  - NestJS has a [CLI](https://docs.nestjs.com/cli/overview)  that you may or may not need

- We are using `pnpm` instead of `npm` for package management for both client and server
  - `pnpm` is faster than `npm`
  - Install `pnpm` [here](https://pnpm.io/installation)
  - Use `pnpm install` instead of `npm install`
  - Notice the `pnpm-lock.yaml` file instead of `package-lock.json`

- We are using [Clerk](https://clerk.com/docs) for authentication. They provide React components as well as Express authentication middleware.

- To run locally for development:
  
  ```bash
  # Run frontend
  cd client
  pnpm install
  cp .env.template .env
  pnpm run dev

  # Open another terminal to run backend
  cd server
  pnpm install
  cp .env.template .env 
  # You need to fill in the environment variables in .env - get them from Joe. 
  pnpm run start:dev
  ```

- Node version: v16.14.2

