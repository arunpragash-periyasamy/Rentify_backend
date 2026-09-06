# Rentify Backend

REST API for Rentify, a rental listings platform that connects house owners with people looking
to rent a place. This service handles user accounts and house-listing data for the
[Rentify frontend](https://github.com/arunpragash-ap/Rentify_Frontend).

## Status

**Prototype.** Core signup/login and house-listing create/read flows work end to end against
MongoDB, but there is no authentication enforcement on any route (see
[Known Issues](./ARCHITECTURE.md#known-limitations)), no update/delete endpoints for listings, no
automated tests, and no CI.

## Overview

House owners submit property details (address, amenities, images, price, terms) and tenants browse
listings. The API issues a JWT on login, stores it in a cookie, and persists houses as a set of
related MongoDB documents (house, address, place, amenities) created together in a single
transaction. Property images are uploaded via `multipart/form-data` and stored on local disk,
served back through a dedicated route.

## Tech stack

- **Runtime:** Node.js, Express 4
- **Database:** MongoDB via Mongoose 8
- **Auth:** `jsonwebtoken` (JWT) + `bcrypt` (password hashing), token delivered via `cookie-parser`
- **File uploads:** `multer` (disk storage)
- **Other:** `cors`, `dotenv`
- **Dev tooling:** `nodemon`

## Features

- User signup with unique username/email/phone and bcrypt-hashed passwords (`Models/user.js`)
- Login issuing a JWT set as a cookie (`Controllers/auth.js`)
- Create a house listing with address, place, and amenities created in one Mongoose transaction,
  plus image upload handling (`Controllers/house.js:addHouse`)
- List all houses with a trimmed field set for a card/list view (`Controllers/house.js:getHouses`)
- Fetch full details for one house, including populated address/place/amenities
  (`Controllers/house.js:getHouse`)
- Serve an uploaded house image by filename (`Controllers/house.js:getHouseImage`)

Not implemented: editing or deleting a listing, admin endpoints, password reset, and any route
protection (JWT verification exists in `utils/jwtToken.js` but is never applied to a route).

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the component diagram, database schema, and a
folder-by-folder tour.

## Folder structure

```
.
├── Controllers/    # Request handlers: auth.js (signup/login), house.js (create/read houses)
├── Models/         # Mongoose schemas: user.js (User), house.js (House, Address, Place, Amenity)
├── Routes/         # Express routers mounted in index.js
├── db/             # conn.js — Mongoose connection setup
├── utils/          # fileUploads.js (multer wrapper), jwtToken.js (sign/verify JWT)
└── index.js        # App entry point — middleware and route mounting
```

## Getting started

Requires a running MongoDB instance (local or Atlas).

```bash
npm install

# create a .env file in the repo root:
# MONGO_URI=mongodb://localhost:27017/rentify
# JWT_SECRET=<any secret string>
# PORT=3000   (optional, defaults to 3000)

npm start
```

`npm start` runs `nodemon index.js` (per `package.json`), so the server restarts on file changes.
The API listens on `http://localhost:3000` by default and is mounted at `/api/auth` and
`/api/house`.

## Usage example

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","userName":"jane01","email":"jane@example.com","phone":9999999999,"password":"secret","userType":"tenant"}'

# Log in (sets a "token" cookie)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"jane01","password":"secret"}' -c cookies.txt

# List houses
curl http://localhost:3000/api/house/houses
```

## License

No license file is present in this repository.
