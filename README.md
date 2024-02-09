<h1 align="center">
Welcome to VolunTech Connect! 🚀
</h1>

VolunTech Connect is a platform that helps Non-Profit Organisations such as [Big At Heart](https://www.bigatheart.org/) to effortlessly manage volunteers, create opportunities for volunteers to sign up for, and so much more! 🌟

Say goodbye 👋 to the days of manually managing volunteers and opportunities. VolunTech Connect is here to help you automate and streamline the process. 🚀

Built with ❤️ by Joe and Devansh.

**Table of Contents**

- [Core Features](#core-features)
  - [Volunteer](#volunteer)
    - [Sign up and Create Profile](#sign-up-and-create-profile)
    - [Register for Opportunities](#register-for-opportunities)
    - [View Personal Volunteering History](#view-personal-volunteering-history)
    - [Download Certificates ⭐️](#download-certificates-️)
  - [Admin](#admin)
    - [Create Opportunities](#create-opportunities)
    - [Approve Volunteer Registrations](#approve-volunteer-registrations)
    - [Archive Opportunities](#archive-opportunities)
    - [Delete Opportunities](#delete-opportunities)
    - [Manage Volunteers](#manage-volunteers)
    - [View Volunteer's Details and History](#view-volunteers-details-and-history)
    - [View Summary Statistics ⭐️](#view-summary-statistics-️)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Appendix](#appendix)
  - [Info for developers](#info-for-developers)

---

# Core Features

In this user guide, we explain the core features of our application from the perspective of (1) a volunteer and, (2) an admin.

Let's dive in! 🏊‍♂️

## Volunteer

### Sign up and Create Profile

As a volunteer, you can easily sign up and create your profile. You just have to fill out a form and you're good to go! 🚀

And don't worry, you can always come back and update your profile details later if you need to.

> :warning: Note: You cannot update important personal information such as your first name, last name, email address, and date of birth. So, make sure you fill these in correctly when you sign up!

### Register for Opportunities

Once you've signed up and created your profile, you can easily browse through all the opportunities available to you.

All you have to do is click "Register" to sign up for an opportunity. It's that simple! 🎉

Once you've registered for an opportunity, the admin will review your registration and approve it. Once approved, you can view the opportunity in your personal volunteering history.

> Note: There are 3 main statuses for a volunteer's registration for an opportunity:
>
> - Pending: The volunteer has registered for the opportunity but the admin has not yet approved their registration
> - Registered: The admin has approved the volunteer's registration for the opportunity
> - Attended: The volunteer has attended the opportunity

### View Personal Volunteering History

Once you've attended an opportunity, you can view it in your personal volunteering history. This is a great way to keep track of all the opportunities you've volunteered for and to motivate yourself to continue volunteering! 🌟

### Download Certificates ⭐️

Once the admin has marked your attendance for an opportunity, you can download a certificate for volunteering for that opportunity _without troubling the admin_.

You can even post these online to convince your friends to join you in volunteering! 📢

> 💡 **Pro Tip**: Admins, this means that you don't have to manually create certificates for volunteers anymore! Hope this saves you a lot time :)

## Admin

### Create Opportunities

Creating a new opportunity only takes one click! 🖱️

Fill in the necessary details such as:

- Name of the opportunity
- Description: you can include any relevant information such as what the volunteers will be doing, the maximum number of volunteers who can sign up, registration deadline, etc. here.
- Start and end date (and time) of the opportunity 📆
- Location of the opportunity 📍
- Number of volunteering hours each volunteer will receive

> 💡 **Pro Tip**: You can also add a photo to make your opportunity more appealing to volunteers!

> :warning: Note: The capacity and registration deadline are not enforced by the system. The admin can manage the number of volunteers who can sign up for an opportunity and the deadline for registration.

### Approve Volunteer Registrations

When volunteers sign up for an opportunity, their registration is not automatically approved. This is to give the admin the flexibility to manage the number of volunteers who can sign up for an opportunity.

> 💡 **Pro Tip**: When there are pending registrations which have not yet been approved, there will be an icon visible on the main opportunities page.

For each opportunity, the admin can view a list of all volunteers who have registered for the opportunity. The admin can then approve the registrations of selected volunteers.

On the day of the event, the admin can also mark the attendance of the volunteers who showed up for the event.

> 💡 **Pro Tip**: Once the admin has marked attendance for a volunteer, the volunteer can download a certificate for volunteering for that opportunity!

### Archive Opportunities

We know that opportunities come and go. Once an opportunity has finished, the admin can easily archive it. This will remove the opportunity from the main opportunities page, but will not delete the data from the system. This is a great way to keep your opportunities page clean and easy to navigate!

> Note: Archived opportunities can still be viewed in a volunteer's personal history, and continues to count towards the total volunteering hours (and all other statistics).

### Delete Opportunities

If you accidentally created an opportunity, or if you simply want to remove an opportunity from the system, you can easily delete it. This will remove the opportunity from the system entirely, including all data associated with it (e.g., volunteer registrations)

> :warning: Warning: Once an opportunity is deleted, it cannot be recovered. So, be careful when deleting opportunities!

### Manage Volunteers

No more hunting through spreadsheets to find a volunteer's details!

You can easily **search**, **sort**, **filter**, and **view** all the details of your volunteers in one place. Oh, and did we forget to mention? You can also **download a CSV** of all your volunteers' details if you wish to export it!

### View Volunteer's Details and History

Want to know more about a volunteer? Simply click on their name to view their details and volunteering history. You can see _all_ their profile details, as well as a list of all the opportunities they registered for. You can even sort and filter this list to find the information you need!

> 💡 Note: "Registered" is not the same as "attended". A volunteer may have registered for an opportunity but the admin may decide to not approve their registration (e.g. due to capacity reasons) or the volunteer did not show up for the event. Hence, a volunteer is said to have "attended" an event only if the admin has approved their registration _and_ marked attendance.

### View Summary Statistics ⭐️

Curious to see the overall statistics of your volunteers and opportunities? We've got you covered! 😄

You can view the distribution of volunteers by:

- Age
- Gender
- Preferences (i.e., what type of opportunities are volunteers interested in)
- Immigrant status

You can also view how well your organisation is doing in terms of:

- Number of opportunities created in the past 6 months
- Number of volunteer attendances in the past 6 months

And of course, you can easily save these charts: simply right-click and "save as image" to add them to your reports and presentations!

# Tech Stack

Our application uses **modern enterprise-grade technologies** to ensure that it is **secure**, **scalable**, and **easy to maintain**.

We use third-party services to handle authentication and database management to guarantee that your data is secure and always available.

We're confident that our application can handle upto hundreds of thousands of volunteers and opportunities without breaking a sweat! 🚀

Oh, and did we mention that our entire tech stack is **completely free**! We don't use any paid tools or libraries, which means we can run this free of cost _forever_.

## Frontend

- **React**: A popular JavaScript library for building user interfaces
- **TypeScript**: A superset of JavaScript that adds static types to the language, making it easier to catch bugs early and write more maintainable code
- **Vite**: A modern build tool that is faster than Webpack and Parcel
- **Material-UI**: A popular React UI framework that provides a set of components and styles to build beautiful and responsive user interfaces

## Backend

- **NestJS**: A modern Node.js framework for building scalable and maintainable server-side applications
- **TypeScript**: A superset of JavaScript that adds static types to the language, making it easier to catch bugs early and write more maintainable code
- **Prisma ORM**: A modern database toolkit that provides a type-safe way to interact with your database using TypeScript
- **MySQL**: A popular open-source relational database management system
- **PlanetScale**: A cloud-hosted database service that provides a fully managed MySQL database

In particular, we use **Clerk** for authentication. Clerk is a third-party service that provides authentication and user management, along with integration with popular identity providers such as Google, Facebook, and more. This means that we never have to worry about the security of our authentication system, and we can focus on building the core features of our application. It also means that **we also don't store any passwords in our database**, which is a huge security win!

# Appendix

## Info for developers

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
    > 🚀 Your database is now in sync with your Prisma schema.
  - Click "Go to database overview"
  - To check that the schema has been applied to your database, click on the "Branches" tab, then click on branch "main". You should see the tables as defined in file `server/prisma/schema.prisma`
- Node version: v16.14.2
