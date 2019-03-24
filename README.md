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

**NOTE** - this is now just a convenience wrapper around [`ssb-social-index`](https://github.com/ssbc/ssb-social-index). See that module for API details

## License

MIT
