const React = require('react')
const ReactDOMServer = require('react-dom/server')
const WebSocket = require('ws')
const flush = require('styled-jsx/server').default
const fs = require('fs-extra')
const http = require('http')
const babel = require('@babel/core')
const chokidar = require('chokidar')
const path = require('path')
const Context = require('./Context')
const { esRequire, isJavaScript, injectScript, tree } = require('./util')

const babelConfig = {
  presets: [ '@babel/preset-env', '@babel/preset-react' ],
  plugins: [ 'babel-plugin-react-require', 'styled-jsx/babel' ]
}

module.exports.transformJavaScript = (src, dist) => {
  fs.emptyDirSync('.frozone')
  for (let file of tree(src)) {
    if (!isJavaScript(file)) continue

    const { code } = babel.transformFileSync(`${src}/${file}`, babelConfig)
    fs.outputFileSync(`${dist}/transformed/${file}`, code)
    delete require.cache[require.resolve(`${process.cwd()}/${dist}/transformed/${file}`)]
  }
}

module.exports.buildPages = (dist, appendLinkExtension) => {
  if (!fs.existsSync(`${dist}/transformed/pages/_document.js`)) {
    const { code } = babel.transformFileSync(require.resolve('./default/_document.js'), babelConfig)
    fs.outputFileSync(`${dist}/transformed/pages/_document.js`, code)
  }

  const requirePath = `${process.cwd()}/${dist}/transformed/pages/_document`
  delete require.cache[require.resolve(requirePath)]
  const Document = esRequire(requirePath)

  for (let file of tree(`${dist}/transformed/pages/`)) {
    if (file === '_document.js') continue
    const PageInner = esRequire(`${process.cwd()}/${dist}/transformed/pages/${file}`)

    const contextValue = { head: [], appendLinkExtension }
    const page = ReactDOMServer.renderToStaticMarkup(React.createElement(
      Context.Provider, { value: contextValue },
      React.createElement(PageInner)
    ))
    const styles = flush()

    const Main = () =>  React.createElement('div', {
      id: 'root',
      dangerouslySetInnerHTML: {
        __html: page
      }
    })
    const Head = (props) => React.createElement(
      React.Fragment, null,
      React.createElement('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }),
      React.createElement('meta', { charSet: 'UTF-8' }),
      styles, props.children, contextValue.head
    )

    const static = ReactDOMServer.renderToStaticMarkup(React.createElement(
      Context.Provider, { value: contextValue },
      React.createElement(Document, { Main, Head })
    ))
    fs.outputFileSync(`${dist}/final/${file.replace(/\..+$/, '.html')}`, static)
  }
}

module.exports.copyStaticFiles = (src, dist) => {
  if (fs.existsSync(`${src}/static/`)) {
    for (let file of tree(`${src}/static/`)) {
      const content = fs.readFileSync(`${src}/static/${file}`)
      fs.outputFileSync(`${dist}/final/static/${file}`, content)
    }
  }

  if (fs.existsSync(`${src}/public/`)) {
    for (let file of tree(`${src}/public/`)) {
      const content = fs.readFileSync(`${src}/public/${file}`)
      fs.outputFileSync(`${dist}/final/${file}`, content)
    }
  }
}

module.exports.copyStaticBuild = (dist, out) => {
  for (let file of tree(`${dist}/final/`)) {
    const content = fs.readFileSync(`${dist}/final/${file}`)
    fs.outputFileSync(`${out}/${file}`, content)
  }
}

module.exports.startLiveReload = (lrPort, src, dist, build) => {
  const wss = new WebSocket.Server({ port: lrPort })

  const buildAndReload = () => {
    const errored = build()
    if (errored) return
    for (let client of wss.clients) {
      client.send('reload')
    }
  }
  const ignored = (child) => !path.relative(dist, child).startsWith('..')

  chokidar.watch(`${process.cwd()}/${src}`, { ignoreInitial: true, ignored })
    .on('add', buildAndReload)
    .on('change', buildAndReload)
    .on('unlink', buildAndReload)

  return `
    const ws = new WebSocket('ws://localhost:${lrPort}/')
    ws.addEventListener('message', () => window.location.reload())
  `
}

module.exports.startServer = (port, dist, script) => {
  http.createServer((req, res) => {
    const possibilities = [
      `${dist}/final/${req.url}`,
      `${dist}/final/${req.url}.html`,
      `${dist}/final/${req.url}/index.html`
    ]
    let path = null
    for (let possibility of possibilities) {
      if (fs.existsSync(possibility) && fs.statSync(possibility).isFile()) {
        path = possibility
        break
      }
    }
    
    if (path && script && path.endsWith('.html')) {
      const content = fs.readFileSync(path)
      res.write(injectScript(content.toString(), script))
      res.end()
    } else if (path) {
      fs.createReadStream(path).pipe(res)
    } else {
      res.statusCode = 404
      res.write('Not found')
      res.end()
    }
  }).listen(port)
}