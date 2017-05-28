# Let's Get Lunch API

### Setup
The following files must be manually added to `/src`. These files contain metadata for our database including secret keys. Both files are listed within our `.gitignore` and as a result are not checked in to our repo.

- `config.json` - configuration for local development

Structure:

```
{
  "port": 8080,
  "bodyLimit": "100kb",
  "testDB": "mongodb://localhost:27017/name-of-db",
  "secret": "supersecretkey",
  "zomato": "zomatokey"
}

```

### Scripts
- `gulp`: Compile `/src` (TS) to `/built` (JS)
- `npm run test`: Run tests using test DB `api-starter-test`
- `npm run api`: Run API using default DB `api-starter`
- `npm run api-test`: Clear DB via `npm run test` and then run API on test DB `api-starter-test`. Use for E2E FE tests that require a fresh DB.