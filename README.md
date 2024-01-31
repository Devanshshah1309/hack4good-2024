# Info for developers

- Frontend is in directory `client/`
  - Using React, TypeScript, [Vite](https://vitejs.dev/guide/)

- Backend is in directory `server/`
  - Using [NestJS](https://docs.nestjs.com/first-steps), TypeScript, MySQL ([PlanetScale](https://planetscale.com/)), [Prisma ORM](https://www.prisma.io/docs/orm)
  - NestJS has a [CLI](https://docs.nestjs.com/cli/overview) that you may or may not need
  - NestJS uses Express.js behind the scenes

- We are using `pnpm` instead of `npm` for package management for both client and server
  - `pnpm` is faster than `npm`
  - Install `pnpm` [here](https://pnpm.io/installation)
  - Use `pnpm install` instead of `npm install`
  - Notice the `pnpm-lock.yaml` file instead of `package-lock.json`

- We are using [Clerk](https://clerk.com/docs) for authentication. They provide React components as well as Express.js authentication middleware.

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
  # Here, setup your development database on Planetscale - follow the steps below (this will add the DATABASE_URL environment variable to .env)
  pnpm run start:dev
  ```

- Setup your development database on PlanetScale (free tier)
  - Signup/Login to PlanetScale [here](https://planetscale.com/)
  - Create a new organization
  - In your organization, create a new database. You need to fill in your:
    - Database name: whatever you want
    - Region: `ap-southeast-1 (Singapore)`
    - Plan type: `Hobby`
    - Credit card info
  - After clicking "Create database", it will bring you to a page that says "Connect to your database"
  - Under "Select your language or framework", select "Prisma"
  - Create a password in the "Create a password" section
  - In the "Configure your Prisma application" section, skip everything except for the "Add credentials to .env" part. 
  - Run `npx prisma db push`. You should see:
    > 🚀  Your database is now in sync with your Prisma schema.
  - Click "Go to database overview"
  - To check that the schema has been applied to your database, click on the "Branches" tab, then click on branch "main". You should see the tables as defined in file `server/prisma/schema.prisma`
  
- Node version: v16.14.2

