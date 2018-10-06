# Vuex + App State

We use Vuex for our state management system. So [READ THE DOCS](https://vuex.vuejs.org/en/intro.html).

Done? ok.

**Best practices:**

- Don't duplicate data in the store - store it denormalized and use getters to connect things together
- Don't put an array in the store, instead key items by ID, then use a getter to return an array if required
- All API requests should go through actions and the store
- Components can track ephemeral UI state themselves if it makes sense
- Mutations should be simple, use actions to string together more complex flows of multiple mutations


### API related actions

We have set up some wrappers/helpers to make it easier to create actions that make requests to our API. While not native to vue/vuex, this is sort of the recommended way of doing things - build your own system using their tools...

Each time an api request is made, there are a series of mutations to track the status of the request along with the actual change to the store using the data from the API. You can watch these mutations and their payloads in the Vue dev tools.

1. `GET_API_THING-PENDING` - stores a timestamp, marks request as pending
1. (if failure) `GET_API_THING-FAILURE` - completed timestamp, error message and status
1. (if success) `GET_API_THING-SUCCESS` - completed timestamp, success status, and performs actual mutation using the new data

The status and metadata about the requests are stored in a big object called `state.requests`, keyed by type of request (based on the mutation type). Note that some requests only need to have a single request tracked (ex: add new bank account) while others may need to be separated by some property like id or type (ex: update bank account 123, add airbnb account). This is set while defining the action using the option `keyRequestStatusBy` (can be a string or array of strings).

There is a getter `requestStatus` which will give you the status of a specific request (pending/success/fail, error message, timestamps, etc).

In a component, we use this getter to show a loader, disable a button, show an error message, or know if we can proceed in some UX flow.

## How to implement

To have the app interact with a new endpoint, you must do the following:

- Add a key to the initialState in [src/store/index.js file](../src/store/index.js) where the data will live
- Create the mutation type in [src/store/mutation-types.js file](../src/store/mutation-types.js)
- Create an action in [src/store/actions.js file](../src/store/actions.js)
- Create a mutation in [src/store/mutations.js file](../src/store/mutations.js)

Check out the [vuex-api-utils.js file](../src/utils/vuex-api-utils.js) to see how it is all strung together.

### Full Example


#### Create the initial state / mutation type / mutation / action
```
// in store/index.js
things: {},  // add to initialState

// in store/mutation-types.js
export const ADD_THING = makeAsyncMutationTypes('ADD_THING');

// in store/mutations.js
...makeAsyncMutations(types.ADD_THING, (state, payload) => {
  // use Vue.set to add new keys to store - for reactivity system
  Vue.set(state.things, payload.id, payload);
}),

// in store/actions.js
export const addThing = makeAsyncAction(types.ADD_THING, (ctx, payload) => ({
  method: 'post',
  url: '/v2/things',
  params: payload, // can do some stuff here or pick only some keys or...
  afterSuccess() { ctx.dispatch('anotherAction'); },
  afterFailure() {},
}));
```

#### In component
```
// in template
form-row(:error='addThingRequest.errorMessage')
  form-input(v-model='newThing.label')
  v-button(@click='addThing' :loading='addThingRequest.isPending' loading-text='Adding new thing...')

// in script
...
getters: {
  // can't use mapGetters with a param
  addThingRequest() { return this.$store.getters.requestStatus('ADD_THING'); },
},
methods: {
  addThing() { this.$store.dispatch('addThing'); },
}

```
