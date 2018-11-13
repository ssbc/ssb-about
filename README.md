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


`server.about.socialValueStream`
`server.about.socialValuesStream`
`server.about.latestValueStream`
`server.about.valueFromStream`

`server.about.socialValue({ key, dest }, cb)`
`server.about.latestValue({ key dest }, cb)`
`server.about.socialValues({ key, dest }, cb)`
`server.about.latestValues({ key, dest }, cb)`



### `server.about.get(cb)`

Get the current state of the about view. This will wait until the view is up to date, if necessary.

`cb(err, data)` is a standard callback function where `data` is of the form:

```
{
  [target]: {          // target we're saying things about
    [trait]: {         // trait we're asserting about that target
      [user]: [        // a user with an opinion about target's trait
        value,         // value of that opinion
        timestamp      // when that opinion was stated
      ]
    }
  }
}
```

e.g. Here, concerning `@3r4+IyB5NV...` (a user) there are two opinions about the user's `name` (by the user themself, and by another user), and one opinion about their `image`:
```js
{ 
  "@3r4+IyB5NVl2in6QOZHIu9oSrZud+NuVgl2GX3x2WG8=.ed25519": {
    "name": {
      "@3r4+IyB5NVl2in6QOZHIu9oSrZud+NuVgl2GX3x2WG8=.ed25519": [
        "Richard D. Bartlett",
        1502124087565
      ],
      "@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519": [
        "rich",
        1513603872659
      ],
    },
    "image": {
      "@3r4+IyB5NVl2in6QOZHIu9oSrZud+NuVgl2GX3x2WG8=.ed25519": [
        "&asrg0Mb/w3lLC+yZIJr/4aY0nkWT9Wn+32zrqhaIvy4=.sha256",
        1516829827534
      ],
    }
  }
}
```

### `sbot.about.stream` => pull-stream source

Be careful, this is a stream which provides:
- an initial value
- 'change' values (for all values after the initial value)
- `{ sync: true }` values when the view is up to date with the db (if you use the `{live: true}` option)

For details see : [https://github.com/flumedb/flumeview-reduce](https://github.com/flumedb/flumeview-reduce#dbnamestreamlive-boolean--pullsource)


## License

MIT
