# Deploying Frozone with Netlify

**How to create and deploy a Frozone project on [Netlify](https://www.netlify.com/).**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting started](#getting-started)
  - [Installing Frozone](#installing-frozone)
  - [Creating a project](#creating-a-project)
- [Setting up Netlify](#setting-up-netlify)
  - [Linking to your project](#linking-to-your-project)
  - [Preparing the build process](#preparing-the-build-process)
- [Post-deploy tasks](#post-deploy-tasks)
  - [A custom URL](#a-custom-url)
  - [Add some content](#add-some-content)
  - [Wrapping up](#wrapping-up)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started

You'll need a [GitHub account](https://github.com/) and a [copy of Node.js](https://nodejs.org/) installed on your computer. You'll also need [Git](https://git-scm.com/).

### Installing Frozone

First, you'll need to install Frozone itself. This is pretty easy, just run the following command:

```bash
npm install frozone -g
```

### Creating a project

Then initialize a project with Frozone:

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

All the code in the demo project should now reside in a GitHub repository that can later be deployed to Netlify!

## Setting up Netlify

Next, you'll want to set up Netlify with your project. First, head to [Netlify's website](https://www.netlify.com/) and click `Log in`. Then, click `GitHub` as a log in option. Connect GitHub with your Netlify account.

### Linking to your project

Once you're logged in, click `New site from Git` in the top right corner. Select `GitHub` again under `Connect to Git provider`. Find the GitHub repository you created earlier and select it.

### Preparing the build process

Now it's time for the final step - choosing what commands will be run to deploy your site!

- Set the `Build command` field to `npm run static` (or `yarn static` if you're using Yarn)
- Set the `Publish directory` field to `out/`

And now all there is left to do is click `Deploy site`!

## Post-deploy tasks

After a few seconds, Netlify should pop up with a randomly-generated URL. Clicking this will show you your site! Feel free to go into the repository and change the code. As soon as you push to Git it'll be deployed to the same URL.

### A custom URL

You might not want the URL that Netlify generates for you and instead want something cool like [hello-frozone.netlify.com](https://hello-frozone.netlify.com/). Click the `Settings` tab along the top and then click `Change site name`. Now enter whatever you want (excluding the `.netlify.com`).

### Add some content

If you want, this project can be your testing ground for Frozone. Since any changes you make will be instantly deployed, you can test out various features and code examples from the README.

### Wrapping up

You've now deployed your first Frozone site on Netlify! I recommend that you now go and experiment or read through the rest of the README. Thanks for following my tutorial, and if you encountered any problems create an issue - I'll respond.