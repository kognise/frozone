> 🚩 **This project is archived!** 🚩
> 
> *This was a great way to learn about bundlers and React, but functionally isn't very useful. Just use Next.js!*

# Frozone

**Frozone is a React framework that generates entirely static HTML with no JavaScript.**

[![NPM version](https://img.shields.io/npm/v/frozone.svg?style=for-the-badge)](https://www.npmjs.com/package/frozone)
[![GitHub](https://img.shields.io/github/license/kognise/frozone.svg?style=for-the-badge)](https://github.com/kognise/frozone/blob/master/LICENSE.md)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How to use](#how-to-use)
  - [Setup](#setup)
  - [CSS](#css)
    - [Styled-jsx](#styled-jsx)
    - [CSS-in-JS](#css-in-js)
  - [Static file serving (e.g. images)](#static-file-serving-eg-images)
  - [Populating `<head>`](#populating-head)
  - [Fetching data](#fetching-data)
  - [Routing](#routing)
    - [Simple linking](#simple-linking)
  - [Custom `<Document>`](#custom-document)
  - [Custom configuration](#custom-configuration)
    - [Configurating code extensions](#configurating-code-extensions)
    - [Static build `<Link>` extensions](#static-build-link-extensions)
    - [Plugin support](#plugin-support)
- [Production deployment](#production-deployment)
  - [Frozone's server](#frozones-server)
  - [Static HTML](#static-html)
  - [Deploying](#deploying)
- [Migrating to Next.js](#migrating-to-nextjs)
  - [Imports](#imports)
  - [Things that stay the same](#things-that-stay-the-same)
  - [Custom `<Document>`](#custom-document-1)
  - [Custom configuration](#custom-configuration-1)
  - [Support](#support)
- [Frozone CLI](#frozone-cli)
  - [Initializing a project](#initializing-a-project)
  - [Developing](#developing)
  - [Production server](#production-server)
  - [Static export](#static-export)
- [FAQ](#faq)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to use

### Setup

Install it:

```bash
npm install frozone -g
```

and initialize a new project:

```bash
frozone init hello-world
```

Every `.js` file inside the `pages/` directory becomes a route and is automatically rendered and converted to static HTML.

Just run `npm run dev` and go to `http://localhost:3000` to see your running site. To use another port, you can run `npm run dev -- -p <port>`.

> We recommend putting the `out/` and `.frozone/` folders in a `.gitignore` or `.npmignore`. That way your static exports and build files won't be tracked in version control which probably isn't desired.

### CSS

#### Styled-jsx

We bundle Zeit's amazing library [styled-jsx](https://github.com/zeit/styled-jsx) to provide support for scoped CSS. You can see this in action in this simple page:

```jsx
export default () => (
  <div>
    <h1>Hello, world!</h1>

    <style jsx>{`
      h1 { color: red }
    `}</style>
  </div>
)
```

Check out [styled-jsx's documentation](https://github.com/zeit/styled-jsx) for more information and examples.

#### CSS-in-JS

It's possible to use any existing CSS-in-JS solution. The simplest one is React's built-in inline styles:

```jsx
export const () => (
  <p style={{ color: 'red' }}>This is red!</p>
)
```

To use more sophisticated CSS-in-JS solutions, you typically have to implement style flushing to get styles to show up in the static HTML. This is possible by defining your own [custom `<Document>`](#custom-document) component that wraps each page, similar to Next.js.

### Static file serving (e.g. images)

Put static files in a folder called `static` in your project root directory. From your code you can then reference those files with `/static/` URLs:

```jsx
export default () => (
  <img src='/static/image.png' alt='A random image' />
)
```

You can serve static files from the root directory by putting them in a folder called `public`. For example, the file `public/robots.txt` could be access at `/robots.txt`.

> Note that static files will override regular files. For example, if `public/foo.html` and `pages/foo.js` both exist, `index.html` will contain the contents from `public/foo.html`.

### Populating `<head>`

Frozone includes a component for appending elements to the `<head>` element, similar to React Helmet.

```jsx
import Head from 'frozone/head'

export default () => (
  <div>
    <Head>
      <title>My page title</title>
    </Head>

    <p>Hello, world!</p>
  </div>
)
```

### Fetching data

You may want to load in external data to be passed as props to a page. For example, fetching data from an external API. This will only be fetched once, at build. 

You can do this in the `getInitialProps` function:

```jsx
import fetch from 'node-fetch'

const Page = ({ stars }) => {
  return <div>Frozone has <strong>{stars}</strong> stars on GitHub!</div>
}

Page.getInitialProps = async () => {
  const res = await fetch('https://api.github.com/repos/kognise/frozone')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default Page
```

### Routing

Frozone's server will resolve routes in the following order:

- `pages/<route>.js`
- `pages/<route>/index.js`

When exporting to static HTML Frozone will write to filenames matching the original JavaScript files (so `pages/foo.js` maps to `pages/foo.html` and `pages/bar/index.js` maps to `pages/bar/index.html`), and relies on your static server's resolving functionality.

#### Simple linking

To link between pages we provide a `<Link>` component. This will decide whether or not to append the `.html` extension based on whether or not your site is being served by Frozone or a static server. You can override this in a [custom configuration file](#static-build-link-extensions).

Here's a basic example:

```jsx
import Link from 'frozone/link'

export default () => (
  <p>
    You&apos;re home! <Link href='/about'>
      <a>Learn about us</a>
    </Link>
  </p>
)
```

> You should put an `<a>` tag inside the `<Link>` component instead of a direct text child.

### Custom `<Document>`

You may have noticed that you do not have to specify the HTML document markup (such as `<html>` and `<body>` elements). You may want to override this - this is also useful for adding support for CSS-in-JS libraries such as [styled-components](https://www.styled-components.com/)

> Note that [styled-jsx](https://github.com/zeit/styled-jsx) support is provided out of the box, and there is no need to make a custom `<Document>` to use it.

Here's the default `<Document>` component:

```jsx
export default ({ Main, Head }) => (
  <html>
    <Head />
    <body>
      <Main />
    </body>
  </html>
)
```

Both `<Head />` and `<Main />` are required for pages to be properly rendered and exported.

You can add custom tags in `<Head>` that will be appended to the document's `<head>`:

```jsx
export default ({ Main, Head }) => (
  <html>
    <Head>
      <style>{`body { margin: 0 }`}</style>
    </Head>
    <body>
      <Main />
    </body>
  </html>
)
```

> Reasonable default head tags such as `<meta charSet='UTF-8' />` and `<meta name='viewport' content='width=device-width, initial-scale=1.0' />` are provided by default.

### Custom configuration

For custom advanced behavior of Next.js, you can create a `frozone.config.js` in the root of your project directory. You must restart Frozone after making changes to the config file.

> Note that `frozone.config.js` is a JavaScript module that should export an object, and isn't a JSON file.

Configuration example:

```js
module.exports = {
  babelPlugins: [ 'babel-plugin-holes' ]
}
```

Here's a fully fledged out configuration file, all fields are optional:

```js
module.exports = {
  babelPresets: [], // Additional Babel presets
  babelPlugins: [], // Additional Babel plugins
  codeExtensions: [ 'js', 'jsx' ], // Extensions that Frozone considers as code files
  staticUseLinkSuffix: true // Whether linked pages in static exports end with .html
}
```

> Fields such as `babelPresets` and `babelPlugins` will be added on to the default set. Fields like `codeExtensions` and `useLinkSuffix` will replace the default value.

I'll be adding more options in the future. Create an issue if you want something specific.

#### Configurating code extensions

If you want to use things like TypeScript you may want to modify this field. Frozone will treat files with these extensions as code and build them with Babel. Files with these extensions in the `pages/` directory will be built as pages.

Here are values you might want for TypeScript:

```js
module.exports = {
  codeExtensions: [ 'ts', 'tsx' ]
}
```

#### Static build `<Link>` extensions

By default, links to pages will end with `.html` in static exports. Sometimes you might want to remove that, for example if you set your server up to serve `/foo.html` when `/foo` is requested.

You can just set this configuration value:

```js
module.exports = {
  staticUseLinkSuffix: false
}
```

#### Plugin support

I'll add plugin support soon if the community wants it - feel free to create an issue.

## Production deployment

To deploy there are two options, Frozone's production server and static HTML.

### Frozone's server

Frozone comes with a simple production server. It resolves pages in the same way as the dev server minus live reloading. [Learn more about the CLI.](#todo)

```bash
frozone start
```

### Static HTML

You can additionally export to static HTML files, this is useful if you want to move them somewhere else or use your own server.

```bash
frozone static
```

### Deploying

You can deploy Frozone anywhere from [Netlify](https://netlify.com/) to [Now](https://now.sh/). Here's a list of guides:

- [Netlify](deploying/NETLIFY.md)
- [Now](deploying/NOW.md)
- [GitHub Pages](deploying/GITHUB.md)

## Migrating to Next.js

Frozone was heavily inspired by Zeit's [Next.js](https://nextjs.org/) and was designed to be easy to migrate away from when you need more than just static HTML. You will lose the absurdly tiny file sizes but of course will be able to add amazing things like interaction.

### Imports

You can just replace `frozone` with `next` in the following imports:

- `frozone/head`
- `frozone/link`

### Things that stay the same

In general, your directory structure and more can remain the same. In particular:

- Static files can stay in `static/` and `public/`
- Your pages can be structured the same way in the same folder
- `getInitialProps()` works exactly the same
- `<Link>` and `<Head>` components

### Custom `<Document>`

Next.js has a different syntax for your custom document file.

Something like this in Frozone:

```jsx
export default ({ Main, Head }) => (
  <html>
    <Head>
      <style>{`body { margin: 0 }`}</style>
    </Head>
    <body>
      <Main />
    </body>
  </html>
)
```

would become this in Next.js:

```jsx
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class extends Document {
  render() {
    return (
      <Html>
        <Head>
          <style>{`body { margin: 0 }`}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
```

> I recommend that you read more about Next.js's custom `<Document>` syntax [on their website here](https://nextjs.org/docs#custom-document).

### Custom configuration

As you may expect, Frozone's custom configuration has a completely different format from Next.js's. You should probably read [their documentation on it](https://nextjs.org/docs#custom-configuration) and redo everything.

### Support

If you encounter any difficulties while migrating, just create an issue - I'd love to help.

## Frozone CLI

Frozone has a rich command line interface that you can use to create and run projects. For more information run `frozone --help`.

You can install it with the following command:

```bash
npm install frozone -g
```

### Initializing a project

Initialize a new project with the following command:

```
frozone init <name>
```

This will generate the following simple file structure:

- `package.json`
- `.gitignore`
- `pages/`
  - `index.js`

`index.js` will be populated with a very simple page demonstrating a heading and some minimal styles.

**Options**

- `--help`, `-h`: displays some help informaton
- `--include-out`: include the static build out directory in Git (useful for GitHub Pages deployments)

### Developing

Running `frozone` or `frozone dev` (or `npm run dev` if scripts are set up) will start a development server in the current directory with live reloading.

Just press `Ctrl-C` to terminate it. Frozone will attempt to spit out useful error information, if something is unclear please go ahead and create an issue.

**Options**

- `--help`, `-h`: displays some help informaton
- `--port`, `-p`: sets the port for the server to listen on
- `--lr-port`: sets the port for the live reload socket to listen on
- `--src`: the directory with the site's source code
- `--dist`: a directory that will be created for build files

> In most circumstances `--dist` shouldn't have to be changed, its default value is `.frozone/`.

### Production server

Running `frozone start` (or `npm run start` if scripts are set up) will start a production server. It's identical to the development server minus live reloading.

**Options**

- `--help`, `-h`: displays some help informaton
- `--port`, `-p`: sets the port for the server to listen on
- `--src`: the directory with the site's source code
- `--dist`: a directory that will be created for build files

### Static export

Run `frozone static` (or `npm run export` if scripts are set up) to export static HTML. My default it will output to an `out/` directory.

**Options**

- `--help`, `-h`: displays some help informaton
- `--out`, `-o`: the output directory
- `--src`: the directory with the site's source code
- `--dist`: a directory that will be created for build files

## FAQ

<details>
  <summary>Why would you want this?</summary>

  React is an amazing way of creating interactive component-based web apps. But it's component system and syntax is extremely useful on its own!

  Frozone lets your create sites in React that compile to static HTML **with no JavaScript bundle**. That means all the benefits and maintainability of React without giant file sizes.

  Not only that - if you want to add interactivity later on, Frozone makes it [super easy](#migrating-to-nextjs) to migrate to Next.js.

</details>

<details>
  <summary>Is Frozone production ready?</summary>

  Frozone is a very new project, but since there isn't any JavaScript you aren't going to get any unexpected errors in production. The built-in server is as simple as it gets and should be performant. If you're experiencing problems feel free to file an issue!

</details>

<details>
  <summary>How big are the outputted files?</summary>

  Outputted files contain the bare minimum - minified static HTML. That's about as small as it gets.

</details>

<details>
  <summary>Frozone seems suspiciously like Next.js...</summary>

  I absolutely adore Zeit's [Next.js](https://nextjs.org/) and use it for many projects. Frozone was heavily inspired by it and this readme is basically a ripoff of it's amazing documentation.

  I created Frozone as an alternative to Next.js for totally static sites that don't need JavaScript, and I wanted to make it easy to migrate. In fact, there's [a whole section on migrating to Next.js](#migrating-to-nextjs).

</details>

<details>
  <summary>How can I fetch data?</summary>

  You can fetch data in a `getInitialProps` function that can retrieve data from anywhere and pass it to a page's props. Feel free to read [the earlier section on this](#fetching-data).

</details>
