# ssb-about

[scuttlebot](http://scuttlebutt.nz/) plugin for indexing reduced "about" state.

## Usage

For a detailed example, see `example.js` in this repo.

```js
const Server = require('scuttlebot')
const config = { ... } // needs options

// Install the plugin
Server
  .use(require('scuttlebot/plugins/master')) // required
  .use(require('ssb-backlinks')) // required
  .use(require('ssb-about'))


// Start the server
const server = Server(config)
```

## API

### `server.about.socialValue({ key, dest }, cb)`

Where `dest` is a FeedId/ MessageId which is being described by some `about` messages, and `key` is the specific `about` property you want to know e.g.

```js
server.about.socialValue({ key: 'name', dest: '@3r4+IyB5NVl2in6QOZHIu9oSrZud+NuVgl2GX3x2WG8=.ed25519' }, (err, value) => {
  console.log(value)
  // => 'Richard'
})
```

The algorithm for the socialValue is based of the following priorities:
1. the most recent value I have set for that `dest`/ `key` (if it exists)
2. the most recent value that the 'owner' `dest` set for that key (if they've self assigned it)
3. the most recent + 'popular' value for the `dest` / `key` (from all data in your network)

### `server.about.latestValue({ key dest }, cb)`

Same as socialValue, except only gets the most recent value that's been announced by anyone for this `dest` / `key`

### `server.about.socialValues({ key, dest }, cb)`

Returns the most abouts for all people who have published things for this `key` / `dest`

```js
server.about.socialValues({ key: 'name', dest: '@3r4+IyB5NVl2in6QOZHIu9oSrZud+NuVgl2GX3x2WG8=.ed25519' }, (err, values) => {
  console.log(values)
  // => {
     '@3r4+IyB5NVl2in6QOZHIu9oSrZud+NuVgl2GX3x2WG8=.ed25519': 'Richard',
     '@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519': 'Dick'
  }
})
```

### `server.about.latestValues({ keys, dest }, cb)`

NOTE - takes `keys` an Array of properties to return about a `dest`
Uses the same algorithm as latestValue, except you can get more than one value at once.

e.g.
```js
server.about.latestValues({ keys: ['title', 'image', 'location'], dest: '%Z1Kk8Aj8Bnw5+t4d73kRPHMA0Nj2bL1bx7n7obZhVZg=.sha256' }, (err, values) => {
  console.log(values)
  // => {
    title: 'Picnic Birthday Party',
    image: '&asrg0Mb/w3lLC+yZIJr/4aY0nkWT9Wn+32zrqhaIvy4=.sha256',
    location: 'Scorching Bay'
  }
})
```

### `server.about.socialValueStream({ key, dest })` => source

Similar to socialValue, except served over a stream. If the value changes a new value is sent down the stream

```js
pull(
  server.about.socialValueStream({ key: 'avatar', dest: '@3r4+IyB5NVl2in6QOZHIu9oSrZud+NuVgl2GX3x2WG8=.ed25519' }),
  pull.drain(avatar => {
    console.log(avatar)
    // => '&asrg0Mb/w3lLC+yZIJr/4aY0nkWT9Wn+32zrqhaIvy4=.sha256'
    // (later) => '&gwEYOFxfKxHSviAqeGub34eOIGXuuwn3G6odVNW9UtQ=.sha256'
  })
)
```

### `server.about.socialValuesStream({ key, dest })` => source

Similar to socialValues, except served over a stream. If the values change **only the new values** are emitted.

```js
pull(
  server.about.socialValueStream({ key: 'name', dest: '@3r4+IyB5NVl2in6QOZHIu9oSrZud+NuVgl2GX3x2WG8=.ed25519' }),
  pull.drain(title => {
    console.log(title)
    // => {
    //   '@3r4+IyB5NVl2in6QOZHIu9oSrZud+NuVgl2GX3x2WG8=.ed25519': 'Richard',
    //   '@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519': 'Dick'
    // }
    // (later) => {
    //   '@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519': 'Rich'
    // }
  })
)
```

### `server.about.latestValueStream({ key, dest, authorId = null })` => source

Same as latestValue expect a stream. First value emitted is the current value, subsequent are new values.

```js
pull(
  server.about.socialValueStream({ key: 'title', dest: '%Z1Kk8Aj8Bnw5+t4d73kRPHMA0Nj2bL1bx7n7obZhVZg=.sha256' }),
  pull.drain(title => {
    console.log(title)
    // => 'Picnic Birthday Party'
    // (later) => 'Beach Party'
  })
)
```

If `authorId` is present, this provides a stream of values for a particular `dest` `key`, as asserted by that particular `authorId`

## License

MIT
