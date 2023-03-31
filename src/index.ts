import joplin from 'api';
import {MenuItemLocation, SettingItemType} from "../api/types";

const ttm = require('todoist-to-md');

const TODOIST_FOLDER_NAME = 'TODO-IST';
const ERROR_MESSAGE = '[Todoist to Joplin] Could not import data';

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
        await joplin.settings.registerSection('ttmSection', {
            label: 'Todoist to Joplin',
            iconName: 'fas fa-list',
        });

        await joplin.settings.registerSettings({
            'ttmKeySetting': {
                value: '',
                type: SettingItemType.String,
                section: 'ttmSection',
                public: true,
                secure: false,
                label: 'Todoist API token',
            },
        });

        await joplin.commands.register({
            name: 'ttmCommand',
            label: 'Import Todoist data',
            iconName: 'fas fa-list',
            execute: async () => {
                let todoFolder = await getOrCreateTodoFolder();
                const key = await joplin.settings.value('ttmKeySetting');
                if (!key) {
                    console.error('${ERROR_MESSAGE}: missing API token.');
                } else {
                    ttm.todoistToMarkdown(key).then((projects: any[]) => {
                        for (const project of projects) {
                            joplin.data.post(['notes'], null, {
                                body: project.project_tree,
                                title: project.project_name,
                                parent_id: todoFolder.id
                            }); // TODO merge duplicate notes
                        }
                    }).catch(error => {
                        console.error(`${ERROR_MESSAGE}.`);
                    });
                }
            },
        });

        await joplin.views.menuItems.create('ttmMenuItem', 'ttmCommand', MenuItemLocation.Tools);
    },
});
