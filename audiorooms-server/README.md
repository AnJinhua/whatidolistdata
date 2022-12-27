# AUDIOROOMS SERVER

Microservice for audiorooms prividing a REST api for crud operations on rooms and a a webscoket server for exchanging state in audiorooms in realtime

## Getting started

### 1. Install dependencies

```
npm install
```

### 2. Database

Prisma ORM is used for database operations. You can mofify the database structure by editing the prisma config file in `./prisma/schema.prisma`

### 3. Start the Server in Development Mode

```
npm run dev
```

### 3. Start the Server in Production Mode

```
npm run start
```
