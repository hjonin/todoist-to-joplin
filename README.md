# Joplin Todoist Plugin

This is a plugin that let you import your active projects from Todoist, into TODO notes inside a TODO-IST folder in
Joplin.

## Installation

- From Joplin desktop open Options - Plugins, search for "todoist to joplin" and install.
- Set your [Todoist API token](https://todoist.com/help/articles/find-your-api-token) in the configuration screen.

## Development

The main two files you will want to look at are:

- `/src/index.ts`, which contains the entry point for the plugin source code.
- `/src/manifest.json`, which is the plugin manifest. It contains information such as the plugin a name, version, etc.

### Requirements

- Make sure you have Node.js and Joplin installed.
- Install dependencies: 
```
npm install
```
- Run Joplin in [Development Mode](https://joplinapp.org/api/references/development_mode/#development-mode).
- [Install the plugin](https://joplinapp.org/api/get_started/plugins/#install-the-plugin).
- Set your [Todoist API token](https://todoist.com/help/articles/find-your-api-token) in the configuration screen.

### Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the
root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.

The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

### Updating the plugin framework

To update the plugin framework, run `npm run update`.

In general this command tries to do the right thing - in particular it's going to merge the changes in package.json and
.gitignore instead of overwriting. It will also leave "/src" as well as README.md untouched.

The file that may cause problem is "webpack.config.js" because it's going to be overwritten. For that reason, if you
want to change it, consider creating a separate JavaScript file and include it in webpack.config.js. That way, when you
update, you only have to restore the line that include your file.

## TODO

- [ ] Better syncing: handle duplicate projects/notes
