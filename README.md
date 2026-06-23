# Townhall
This is an updated Townhall application that combines frontend and backend in a single project.

# To Run App
```js
cd backend/public
// paste credentials if needed
vi .env

cd ../..
yarn build
yarn start:prod
http://localhost:3000/{room-name}/moderator
```

# To Deploy the App in the AWS Instance

1. Create a new release from github and create a Tag associated to it.
2. SSH into the EC2 Instance
3. `git fetch` and `git checkout tags/{your-tag}`
4. `yarn build`
5. `pm2 restart townhall`
6. Check that the Express server is running `pm2 logs townhall`

# VCR Config

Use the sample config in `vcr.yml.sample` and create a local `vcr.yml` with real values before deployment.

```bash
cp vcr.yml.sample vcr.yml
# edit vcr.yml and set your secrets
```

```js
// run production service
yarn start:prod
```