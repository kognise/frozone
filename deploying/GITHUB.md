# Deploying Frozone with GitHub Pages

**How to create and deploy a Frozone project on [GitHub Pages](https://pages.github.com/).**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting started](#getting-started)
  - [Installing Frozone](#installing-frozone)
  - [Creating a project](#creating-a-project)
- [Setting up GitHub Pages](#setting-up-github-pages)
- [Wrapping up](#wrapping-up)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started

You'll need a [GitHub account](https://github.com/) and a [copy of Node.js](https://nodejs.org/) installed on your computer. You'll also need [Git](https://git-scm.com/).

GitHub Pages is a little trickier than most deployment options as there isn't an explicit way to specify a build command or directory. We'll have to use Git subtree pushing.

### Installing Frozone

First, you'll need to install Frozone itself. This is pretty easy, just run the following command:

```bash
npm install frozone -g
```

### Creating a project

First, initialize a project with Frozone:

```bash
frozone init hello-frozone --include-out
```

The `--include-out` option will ensure that Git (and GitHub) doesn't ignore your static build output. If you already have a project, you can just remove the last line of the `.gitignore`

Create a repository on GitHub with the same name as your project and push your code:

```bash
cd hello-frozone
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/hello-frozone.git
git push -u origin master
```

All the code in the demo project should now reside in a GitHub repository that can later be deployed!

## Setting up GitHub Pages

Now it's time to set up GitHub Pages with your project! First, run a static build:

```bash
yarn static
```

Now, commit it to Git and push it to another branch called `gh-pages`:

```bash
git add out
git commit -m "Static build"
git subtree push --prefix out origin gh-pages
```

Finally, head over to your repository's `Settings` tab on GitHub's website and scroll down to `GitHub Pages`. Wait until the message turns green, and click the link to see your published site!

Whenever you want to deploy your site in the future, just run those four commands again - you could even make a script:

```bash
yarn static
git add out
git commit -m "Static build"
git subtree push --prefix out origin gh-pages
```

## Wrapping up

If you want, this project can be your testing ground for Frozone. Since any changes you make will be instantly deployed, you can test out various features and code examples from the README.

You've now deployed your first Frozone site on Netlify! I recommend that you now go and experiment or read through the rest of the README. Thanks for following my tutorial, and if you encountered any problems create an issue - I'll respond.