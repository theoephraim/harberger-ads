# ETHSF2018 - Client

> front end

## Getting started

- Install node via [NVM](https://github.com/creationix/nvm) (check .nvmrc file for version you need)
- Install vue.js devtools [chrome plugin](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en)
- Add `127.0.0.1 local.ethsf.com` to your `/etc/hosts` file
- Run `npm install`
- (You will want to run the API if you are testing more than static pages)
- Ignore the security warning about the self-signed certificate

## Build & Dev Setup

- `npm run dev` - compile and run dev server w/ hot reloading at http://localhost:7000
- `npm run lint` - runs eslint in prod mode (more strict than during dev)
- `npm run build[:staging|production] [--report]` - build (for env) w/ optional bundle analyzer report

*Note* A list of pages to get pre-rendered is located under `build/webpack.prod.conf.js`. If a page path is not included here, it will show a default 'Loading' page briefly before loading.

### Configuration

Config lives in the config folder. The setup still needs a little work...
You will have to restart webpack for config changes to take effect.

To have specific config overrides for your local environment, put them in `config/local.js` (ignored from git).

These values get injected into the bundle using [webpack.DefinePlugin](https://webpack.js.org/plugins/define-plugin/).

*Note* All values get stringified as if coming via env vars - so expect strings, not booleans or numbers (`"true"` not `true`)


## Deployments

We use [Netlify](https://www.netlify.com/), which handles building the files,
hosting them, and caching on a CDN. It also makes extra optimizations, and can
be configured to do things like proxying/redirects/etc.

Builds are deployed directly from github automatically.

To deploy to production, just merge a PR to master.

Every branch and PR also has a preview deployment available automatically linked on the "status checks" section of the PR on Github.


## Coding standards & conventions

_Please try to follow the existing style and conventions_

We rely on [eslint](https://github.com/eslint/eslint) to enforce some coding standards.
The eslint-loader even fixes many simple errors (trailing commas, semi-colons, spacing, etc) for you on save!

We use the [airbnb javascript standards](https://github.com/airbnb/javascript) as our base with a few small modifications.

Check out our [.eslintrc.js](.eslintrc.js) file for specific details.

Occasionally it may make sense to use eslint-ignore rules to ignore an issue.
Just try to use them sparingly...



## Style / CSS

We use [less](http://lesscss.org/) to write our style rules.

There is a base reset ([normalize.css](https://necolas.github.io/normalize.css/)) along with some core style rules that can be found in the `src/assets/style` folder.
The files that start with an underscore (`_colors`, `_variables`, `_mixins`) are automatically loaded into your components, so please make use of them.

- Use classes only - never ids
- "Scoped" LESS is not working (yet), so try to wrap your style rules for components in a class - meaning add a class on the root element of the component, and put all your rules nested under that class.
- No need to add any browser prefixes, as they are automatically added during the build process
- We still have some work to do - picking naming conventions, grid system, more reusable classes -- so just try to keep the css to a minimum in the short term

## Made with...

- The website is built using [vue.js](https://vuejs.org/) as our front-end framework
- In conjunction with [vuex](https://github.com/vuejs/vuex) for sane state management
- We use [webpack](https://webpack.js.org/) as our build tool
- In our template files, we use [pug](https://pugjs.org/api/getting-started.html) and [less](http://lesscss.org/) to keep our brackets to a minimum
- Setup is based on [vue webpack template](https://github.com/vuejs-templates/webpack)
- Uses [vue-loader](http://vuejs.github.io/vue-loader) to allow single file components
- `await` and `async` for more sane promises, see [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Netlify](https://www.netlify.com/) for (continuous) deployments, hosting, cdn
