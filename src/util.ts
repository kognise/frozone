import chalk from 'chalk'
import fs from 'fs-extra'
import rl from 'readline'

const endOfBodyRegex = /<\s*\/\s*body\s*>/

interface OptionalConfig {
  babelPresets?: any[]
  babelPlugins?: any[]
  codeExtensions?: string[]
  staticUseLinkSuffix?: boolean
}

export interface Config {
  babelPresets: any[]
  babelPlugins: any[]
  codeExtensions: string[]
  staticUseLinkSuffix: boolean
}

/**
 * Recursively crawls of all of the files in a directory and returns their paths.
 * 
 * @param directory - The directory to crawl
 * @returns A list of paths
 */
export const tree = (directory: string, files: string[] = [], root: number = directory.length): string[] => {
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

/**
 * Based on a specified configuration file decides whether the file at the given path contains code.
 * 
 * @param config - The configuration file
 * @param path - The file's path
 * @returns Whether the file contains code
 */
export const isCode = (config: Config, path: string) => {
  for (let extension of config.codeExtensions) {
    if (path.endsWith(`.${extension}`)) return true
  }
  return false
}

/**
 * Injects a given snippet of JavaScript into HTML markup, either before the `</body>` tag or at the end of the markup.
 * 
 * @param markup - The HTML markup
 * @param script - JavaScript code to inject
 * @returns New markup with the code injected
 */
export const injectScript = (markup: string, script: string) => {
  if (endOfBodyRegex.test(markup)) {
    return markup.replace(endOfBodyRegex, `<script>${script}</script></body>`)
  } else {
    return `${markup}<script>${script}</script>`
  }
}

/**
 * Logs a message to the console and possibly replace the last message.
 * 
 * @param message - The message to print
 * @param noReplace - If specified, this message shouldn't be replaced
 * @param color - If specified, the color to print the message in
 */
export const log = (message: string, noReplace?: boolean, color: string = 'blue') => {
  rl.cursorTo(process.stdout, 0)
  rl.clearLine(process.stdout, 1)

  // @ts-ignore: String can't index chalk
  process.stdout.write(chalk[color](`> ${message}`))
  if (noReplace) process.stdout.write('\n')
}

/**
 * Get the configuration file and fill in blank values.
 * 
 * @param src - The path to the source code directory
 */
export const getConfig = (src: string): Config => {
  const defaultBabelPresets = [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } }
    ],
    '@babel/preset-react'
  ]
  const defaultBabelPlugins = [ 'babel-plugin-react-require', 'styled-jsx/babel' ]
  const defaultCodeExtensions = [ 'js', 'jsx' ]

  let config: OptionalConfig = {}
  if (fs.existsSync(`${src}/frozone.config.js`)) {
    config = require(`${process.cwd()}/${src}/frozone.config.js`)
  }
  
  return {
    babelPresets: config.babelPresets ? defaultBabelPresets.concat(config.babelPresets) : defaultBabelPresets,
    babelPlugins: config.babelPlugins ? defaultBabelPlugins.concat(config.babelPlugins) : defaultBabelPlugins,
    codeExtensions: config.codeExtensions || defaultCodeExtensions,
    staticUseLinkSuffix: config.staticUseLinkSuffix === undefined ? true : config.staticUseLinkSuffix
  }
}