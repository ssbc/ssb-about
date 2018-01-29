const Server = require('scuttlebot')
const fs = require('fs')
const path = require('path')

const Config = require('ssb-config/inject')
const ssbKeys = require('ssb-keys')

const appName = 'ssb' // NOTE this is your default identity
const opts = null     // can set things in here

const config = Config(appName, opts)
Object.assign(config, { 
  appName,
  keys: ssbKeys.loadOrCreateSync(path.join(config.path, 'secret')),
})

// Install the plugin
Server
  .use(require('scuttlebot/plugins/master')) // required
  .use(require('ssb-about'))

// Start the server
const server = Server(config)


// Update manifest.json
// - this is required for ssb-client to consume
// - it's a list of methods that can be called remotely, without this code we won't be able to call our new plugin methods
// - this puts the manifest.json in the default location ssb-client will look for it
const manifest = server.getManifest()
fs.writeFileSync(path.join(config.path, 'manifest.json'), JSON.stringify(manifest))

