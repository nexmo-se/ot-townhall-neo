# Townhall Application - Backend
Backend service for genering rooms, questions, polling and many more. This Backend is linked to Townhall Application.

This backend server uses `Postgre SQL` and `MongoDB` for the database. However, not ORM is introduced in this backend code. 

Why do we have 2 databases? At first I thought PGSQL is enought. However, since the application support multi tenant, and we want to store configuration for each tenant in JSON format. I believe, `MongoDB` will help a lot.

## Database Migration
You need to create your own migration script inside `src/api/database.js`. There are samples inside.

## Commands

- Install dependencies: `npm install`
- How to build: `yarn build` or `npm run build`
- How to start development server: `npm run start:dev`
- How to start production server: `yarn start:prod` or `npm run start:prod`
