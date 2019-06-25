import React, { FunctionComponent } from 'react'
import ReactDOMServer from 'react-dom/server'
import WebSocket from 'ws'

import flush from 'styled-jsx/server'
import fs from 'fs-extra'
import http from 'http'
// @ts-ignore: No Babel typings
import { transformFileSync } from '@babel/core'
import chokidar from 'chokidar'
import path from 'path'

import Context, { ContextValue } from './Context'
import { Config, isCode, injectScript, tree } from './util'

export const transformJavaScript = (config: Config, src: string, dist: string) => {
  fs.emptyDirSync('.frozone')
  for (let file of tree(src)) {
    if (!path.relative('node_modules/', file).startsWith('..')) continue

    if (!isCode(config, file)) {
      const content = fs.readFileSync(`${src}/${file}`)
      fs.outputFileSync(`${dist}/transformed/${file}`, content)
    } else {
      const { code } = transformFileSync(`${src}/${file}`, {
        presets: config.babelPresets,
        plugins: config.babelPlugins
      })
      fs.outputFileSync(`${dist}/transformed/${file}`, code)
      delete require.cache[require.resolve(`${process.cwd()}/${dist}/transformed/${file}`)]
    }
  }
}

export const buildPages = async (config: Config, dist: string, isStatic: boolean) => {
  if (!fs.existsSync(`${dist}/transformed/pages/_document.js`)) {
    const { code } = transformFileSync(`${__dirname}/default/_document.js`, {
      presets: config.babelPresets,
      plugins: config.babelPlugins
    })
    fs.outputFileSync(`${dist}/transformed/pages/_document.js`, code)
  }

  const requirePath = `${process.cwd()}/${dist}/transformed/pages/_document`
  delete require.cache[require.resolve(requirePath)]
  const DocumentImported = await import(requirePath)
  const Document = DocumentImported.__esModule ? DocumentImported.default : DocumentImported

  for (let file of tree(`${dist}/transformed/pages/`)) {
    if (file === '_document.js' || !isCode(config, file)) continue
    const PageInnerImported = await import(`${process.cwd()}/${dist}/transformed/pages/${file}`)
    const PageInner = PageInnerImported.__esModule ? PageInnerImported.default : PageInnerImported

    let pageProps = {}
    if (PageInner.getInitialProps) {
      pageProps = await PageInner.getInitialProps()
    }

    const contextValue: ContextValue = {
      head: [],
      useLinkSuffix: isStatic ? config.staticUseLinkSuffix : false
    }
    const page = ReactDOMServer.renderToStaticMarkup(
      <Context.Provider value={contextValue}>
        <PageInner {...pageProps} />
      </Context.Provider>
    )
    const styles = flush()

    const Main: FunctionComponent = () => (
      <div id='root' dangerouslySetInnerHTML={{ __html: page }} />
    )
    const Head: FunctionComponent = ({ children }) => (
      <>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta charSet='UTF-8' />
        {styles} {children} {contextValue.head}
      </>
    )

    const markup = ReactDOMServer.renderToStaticMarkup(
      <Context.Provider value={contextValue}>
        <Document Main={Main} Head={Head} />
      </Context.Provider>
    )
    fs.outputFileSync(`${dist}/final/${file.replace(/\..+$/, '.html')}`, markup)
  }
}

export const copyStaticFiles = (config: Config, src: string, dist: string) => {
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

export const copyStaticBuild = (config: Config, dist: string, out: string) => {
  for (let file of tree(`${dist}/final/`)) {
    const content = fs.readFileSync(`${dist}/final/${file}`)
    fs.outputFileSync(`${out}/${file}`, content)
  }
}

export const startLiveReload = (config: Config, lrPort: number, src: string, dist: string, build: () => boolean | Promise<boolean>) => {
  const wss = new WebSocket.Server({ port: lrPort })

  const buildAndReload = async () => {
    const errored = await build()
    if (errored) return
    for (let client of wss.clients) {
      client.send('reload')
    }
  }
  const ignored = (child: string) => !path.relative(dist, child).startsWith('..')

  chokidar.watch(`${process.cwd()}/${src}`, { ignoreInitial: true, ignored })
    .on('add', buildAndReload)
    .on('change', buildAndReload)
    .on('unlink', buildAndReload)

  return `
    const ws = new WebSocket('ws://localhost:${lrPort}/')
    ws.addEventListener('message', () => window.location.reload())
  `
}

export const startServer = (config: Config, port: number, dist: string, script?: string) => {
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