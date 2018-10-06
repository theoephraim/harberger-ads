# Harberger Ads API

## Getting started

If you are on a mac, use [Homebrew](http://brew.sh/)

- `brew install nvm` -- node via [NVM](https://github.com/creationix/nvm) (check .nvmrc file for version)
- `brew install postgres` -- Postgresql
- `npm install` -- install node dependencies
- `npm run dev` -- start the server in dev mode

### Development

Running `npm run dev` starts the server using nodemon so it will restart if it crashes.
It also lints your code as you save and fixes any easy issues using eslint.
If any fatal errors are detected, the server will be stopped, but will restart when they are fixed.

### Database Migrations

We use [node-pg-migrate](https://github.com/salsita/node-pg-migrate). Simple run `npm run migrate [args]` to interact with it.
Until we turn off the rails API, this should only be used for entirely new tables.

- `npm run migrate create description of migration` - create a new migration with description
- `npm run migrate up [N]` - migrate up (defaults to 1)
- `npm run migrate down [N]` - migrate down (defaults to 1)
- `npm run migrate redo [N]` - run down N then up N (defaults to 1)

### Tests

Our tests use [Jest](https://facebook.github.io/jest/).

On each run of the test suite, the test db is wiped clean and re-synced with our models (ie - migrations are not used). Most of the tests boot up a real api server and make api requests. The queues are not running but we can trigger queue jobs directly in order to test them.

- `npm test` will run the linter (in fix mode) run the tests, and watch files for changes to run again.
- `npm test:record` will record new fixtures using nockback - you can only run it on one test file at a time.

All options are passed along to jest, so check out their docs for all the options to run a single file, or grep
test descriptions for phrases, etc.

To run the tests just once without other config options, use `npm run test:once`


### Throwing Errors
`ctx.throw` is your friend when you're throwing directly from a route handler.
If you want to throw from a lib/helper etc. you can simply require `ApiError` and `throw new ApiError('BadRequest', 'Some message)` it's really handy and removes the obligation to pass the `ctx` around everywhere explicitly.

#### External service mocking -- Nock, Nockback

We use [Nock](https://github.com/nock/nock) to mock out http requests to external services.
It intercepts at the http level, so no need to modify our code or mock function calls.

Mostly we are using "NockBack", which records and replays automatically.

To use, start the recording before our code makes requests, and stop when they are done. Example:
```javascript
const { nockStart, nockFinish } = require('../helpers/nock');
let nockCtx;
beforeAll(async () => { nockCtx = nockStart(); });
afterAll(() => { nockFinish(nockCtx); });
```

Then run `npm test:record specific-file.test.js` (only one file at a time).
It will automatically delete the fixture that was created and record new ones.

It will name the fixture file the same as the test, replacing `.test.js` with `.fx.json`.

While not usually necessary, to break fixtures into several files for one test file,
pass a string to `nockStart()`.

Ex: `nockStart('setup')` will result in a fixture will be named `[test file name].setup.fx.json`.

When all the requests were made correctly (even if your tests are not passing) and you think
the fixture file is complete. Hit CTRL+C to stop watching for file changes and run not in
record mode.

All external requests will now be played back using the recorded fixtures.

### Gotchas
Doing operations [in bulk](http://docs.sequelizejs.com/manual/tutorial/instances.html#working-in-bulk-creating-updating-and-destroying-multiple-rows-at-once-) may cause some issues before [this pr](https://github.com/sequelize/sequelize/pull/9727) gets merged. To work around this simply pass in `sideEffects: false`. An example is

```
await Models.Card.update({businessId: 2}, { where: { id }, sideEffects: false})
```

## API URL Design
Generally the API tries to be RESTful, but there's no need to be super strict about it.
As long as it makes sense to bend the rules, don't be afraid of doing so.

We use the plural form of a word in the url for both singular and plural endpoints.
Use lower-dash-case for resource names.

- `/resources` -- fetch all of a resource (adjust paging with `?limit=X&offset=Y`)
- `/resources?key=val` -- search for resources based on some property
- `/resources/25` -- fetch a resource with a specific id
- `/resources/25/other-resources` -- fetch all other-resources connected to resource with ID 25

The API will accepts input in either form-urlencoded or json input, and as such, we should try to keep the input parameters relatively simple whenever possible (avoid complex JSON input formatting requirements).
