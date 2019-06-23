# Deploying Frozone with Netlify

**How to create and deploy a Frozone project on [Now](https://now.sh/).**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting started](#getting-started)
  - [Installing Now](#installing-now)
  - [Installing Frozone](#installing-frozone)
  - [Creating a project](#creating-a-project)
- [Setting up Now](#setting-up-now)
  - [Adding the build script](#adding-the-build-script)
  - [Adding a builder](#adding-a-builder)
  - [Deploying](#deploying)
- [Post-deploy tasks](#post-deploy-tasks)
  - [A fixed URL](#a-fixed-url)
  - [Add some content](#add-some-content)
  - [Continuous deployment](#continuous-deployment)
  - [Wrapping up](#wrapping-up)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started

You'll need a [GitHub account](https://github.com/) and a [copy of Node.js](https://nodejs.org/) installed on your computer.

### Installing Now

Now is a serverless deployment platform created by Zeit. There are two ways to install it - through the desktop app (which installs the CLI) and just the CLI. I personally use just the CLI but you can do whatever you like.

[Install Now from this page.](https://zeit.co/download)

### Installing Frozone

Next, you'll need to install Frozone itself. This is pretty easy, just run the following command:

```bash
npm install frozone -g
```

### Creating a project

First, initialize a project with Frozone:

```bash
frozone init hello-frozone
```

Create a repository on GitHub with the same name, and link it to your project:

```bash
cd hello-frozone
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/hello-frozone.git
git push -u origin master
```

Although the GitHub repository isn't currently necessary, it's a great way of tracking source control and it will come in handy if you want to set up continuous deployment later.

## Setting up Now

The next thing to do is set up some Now-specific configuration files so Now knows how to deploy your site.

### Adding the build script

First, find the file `package.json`. Add the following key/value pair to the `scripts` object:

```json
{
  ...
  "scripts": {
    ...
    "now-build": "frozone static"
  }
}
```

This will tell Now what command to run to get static HTML.

### Adding a builder

Now create a file called `now.json` and populate it with the following content:

```json
{
  "name": "hello-frozone",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@now/static-build",
      "config": { "distDir": "out/" }
    }
  ]
}
```

This will tell Now that it's building a static site and it should look for the build output in the `out/` folder.

### Deploying

All there is to do now is run the following simple command:

```bash
now
```

Your site is now deployed to the cloud! Now should've printed out a unique URL for your deployment. If you visit this in a browser you'll see the demo site.

## Post-deploy tasks

The URL will change across deployments - in this section I'll show you how to have a custom fixed URL and more.

### A fixed URL

If you want a cool custom URL like [hello-frozone.now.sh](https://hello-frozone.now.sh/) that's also fixed across deployments, follow these steps.

First, add a field to your `now.json`:

```json
{
  ...
  "alias": [ "your-url-here" ]
}
```

Now whenever you want to deploy your site and update whatever's pointing to that url, run this:

```bash
now --target production
```

### Add some content

If you want, this project can be your testing ground for Frozone. Since any changes you make can be easily deployed, you can test out various features and code examples from the README.

### Continuous deployment

Continuous deployment means that whenever your push a code change to Git it'll be automatically deployed to your Now URL. Sounds useful? Here's how to set it up.

Head over to [this link](https://zeit.co/github) and connect Now to your GitHub account. Believe it or not, that's it! Thanks to the ease of Now continuous deployment is all set up.

### Wrapping up

You've now deployed your first Frozone site on Now! I recommend that you now go and experiment or read through the rest of the README. Thanks for following my tutorial, and if you encountered any problems create an issue - I'll respond.