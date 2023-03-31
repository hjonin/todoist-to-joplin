import joplin from 'api';
import {MenuItemLocation} from "../api/types";

const fs = joplin.require('fs-extra');
const ttm = require('todoist-to-md');

const TODOIST_FOLDER_NAME = 'TODO-IST';

const getSettings = async () => {
    const installDir = await joplin.plugins.installationDir();
    return JSON.parse(fs.readFileSync(installDir + '/settings.json', 'utf8'));
}

const getOrCreateTodoFolder = async () => {
    let todoFolder;
    const todoFolderSearchRes = await joplin.data.get(['search'], {query: TODOIST_FOLDER_NAME, type: "folder"});
    if (todoFolderSearchRes.items.length == 0) {
        todoFolder = await joplin.data.post(['folders'], null, {title: TODOIST_FOLDER_NAME});
    } else {
        todoFolder = todoFolderSearchRes.items[0];
    }
    return todoFolder;
}

joplin.plugins.register({
    onStart: async function () {
        const settings = await getSettings();

        await joplin.commands.register({
            name: 'ttmCommand',
            label: 'Import Todoist data',
            iconName: 'fas fa-list',
            execute: async () => {
                let todoFolder = await getOrCreateTodoFolder();
                ttm.todoistToMarkdown(settings.key).then((projects: any[]) => {
                    for (const project of projects) {
                        joplin.data.post(['notes'], null, {
                            body: project.project_tree,
                            title: project.project_name,
                            parent_id: todoFolder.id
                        }); // TODO merge duplicate notes
                    }
                });
            },
        });

        await joplin.views.menuItems.create('ttmMenuItem', 'ttmCommand', MenuItemLocation.Tools);
    },
});
