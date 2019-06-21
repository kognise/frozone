const React = require('react')
const ReactDOMServer = require('react-dom/server')
const flush = require('styled-jsx/server').default
const chalk = require('chalk')
const fs = require('fs-extra')
const rl = require('readline')
const babel = require('@babel/core')

// Constants
const babelConfig = {
  presets: [ '@babel/preset-env', '@babel/preset-react' ],
  plugins: [ 'babel-plugin-react-require', 'styled-jsx/babel' ]
}

const endOfBodyRegex = /<\s*\/\s*body\s*>/

// Internal utils
const cleanPath = (path) => path.replace(/\/+/g, '/').replace(/(^\/)|(\..+)$/, '')
const esRequire = (path) => {
  const required = require(path)
  return required.__esModule ? required.default : required
}

const tree = (directory, files = [], root = directory.length) => {
  for (let item of fs.readdirSync(directory)) {
    const path = `${directory}/${item}`

    if (fs.statSync(`${directory}/${item}`).isDirectory()) {
      tree(`${directory}/${item}`, files, root)
    } else {
      files.push(path.slice(root + 1))
    }
  }

  return files
}

const getCustomDocument = (dist) => {
  if (!fs.existsSync(`${dist}/pages/_document.js`)) {
    const { code } = babel.transformFileSync(require.resolve('./default/_document.js'), babelConfig)
    fs.outputFileSync(`${dist}/pages/_document.js`, code)
  }

  const requirePath = `${process.cwd()}/${dist}/pages/_document`
  delete require.cache[require.resolve(requirePath)]
  return esRequire(requirePath)
}

const isJavaScript = (path) => /^.+\.(js|jsx|ts|tsx)$/.test(path)

// Exported utils
module.exports.resolve = (route, pages) => {
  const options = [
    cleanPath(route),
    cleanPath(`${route}/index`)
  ]

  for (let option of options) {
    if (option in pages) return pages[option]
  }

  return null
}

module.exports.transformAll = (src, dist) => {
  for (let file of tree(src)) {
    if (!isJavaScript(file)) {
      fs.copyFileSync(`${src}/${file}`, `${dist}/${file}`)
      continue
    }

    const { code } = babel.transformFileSync(`${src}/${file}`, babelConfig)
    fs.outputFileSync(`${dist}/${file}`, code)
    delete require.cache[require.resolve(`${process.cwd()}/${dist}/${file}`)]
  }
}

module.exports.getPages = (dist) => {
  const pages = {}
  const Document = getCustomDocument(dist)

  for (let file of tree(`${dist}/pages/`)) {
    if (!isJavaScript(file) || file === '_document.js') continue
    const PageInner = esRequire(`${process.cwd()}/${dist}/pages/${file}`)

    const page = ReactDOMServer.renderToStaticMarkup(React.createElement(PageInner))
    const styles = flush()

    const Main = () => React.createElement('div', {
      id: 'root',
      dangerouslySetInnerHTML: {
        __html: page
      }
    })
    const Head = (props) => React.createElement(React.Fragment, null, styles, props.children)

    const static = ReactDOMServer.renderToStaticMarkup(React.createElement(Document, { Main, Head }))
    const cleaned = cleanPath(file)
    pages[cleaned] = `<!DOCTYPE html>${static}`
  }

  return pages
}

module.exports.inject = (script, markup) => {
  if (endOfBodyRegex.test(markup)) {
    return markup.replace(endOfBodyRegex, `<script>${script}</script></body>`)
  } else {
    return `${markup}<script>${script}</script>`
  }
}

module.exports.log = (message, noReplace, color = 'blue') => {
  rl.cursorTo(process.stdout, 0)
  rl.clearLine(process.stdout)

  process.stdout.write(chalk[color](`> ${message}`))
  if (noReplace) process.stdout.write('\n')
}