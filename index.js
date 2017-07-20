const os = require('os')
const fs = require('fs')

class InjectScriptWebpackPlugin {
  constructor(options = {}) {
    this.options = options
    this.canInject = !!this.options.inject || process.argv.indexOf('inject') > -1 || process.argv.indexOf('debug') > -1
  }

  getIp ()  {
    // default local
    let ip = '127.0.0.1'
    try {
      // only test macOS
      ip = os.networkInterfaces().en0.find(en => en.family === 'IPv4').address || '127.0.0.1'
    } catch (e) {
      console.error(e)
    }
    return ip
  }

  getScriptHtml () {
    let src = this.options.src || ''
    src = src.replace('[ip]', this.getIp())
    return `<script src="${src}"></script>`
  }

  apply (compiler) {
    compiler.plugin('emit', function (compilation, callback) {
      if (this.canInject) {
        const injectPosition = '</body>'
        const distPath = compilation.outputOptions.path || ''
        const htmlAssets = Object.keys(compilation.assets).filter(item => item.match(/(.html)$/))
        htmlAssets.forEach(function (htmlAsset) {
          const filePath = `${distPath}/${htmlAsset}`
          const injectHtml = this.getScriptHtml()
          const sourceHtml = compilation.assets[htmlAsset].source()
          const distHtml = sourceHtml.replace(injectPosition, `${injectHtml}${injectPosition}`)
          // insert this html asset into the Webpack build
          // replace the origin file
          compilation.assets[htmlAsset] = {
            source: () => distHtml,
            size: () => fs.statSync(filePath).size
          }
        }.bind(this))
      }
      callback()
    }.bind(this))
  }
}

module.exports = InjectScriptWebpackPlugin
