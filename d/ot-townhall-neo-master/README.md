# Townhall
This is an updated Townhall application that combines frontend and backend in a single project.

# To Run App
```js
// backend
cd backend
yarn install

// frontend
cd frontend
// paste credentials
vi .env
yarn install
yarn start
localhost:3001/{room-name}/moderator
```

# To Deploy the App in the AWS Instance

1. Create a new release from github and create a Tag associated to it.
2. SSH into the EC2 Instance
3. `git fetch` and `git checkout tags/{your-tag}`
4. `cd backend && yarn install && yarn build && cd ..`
5. `cd frontend && yarn install && yarn build && cd ..`
6. `pm2 restart townhall`
7. Check that the Express server is running `pm2 logs townhall`

```js

// frontend
cd frontend
// paste credentials
vi .env
yarn install
yarn start
localhost:3001/{room-name}/moderator
```