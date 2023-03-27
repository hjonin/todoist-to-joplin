import joplin from 'api';

const fs = joplin.require('fs-extra');
const ttm = require('todoist-to-md');

const TODOIST_FOLDER_NAME = 'TODO-IST';

joplin.plugins.register({
    onStart: async function () {
        const installDir = await joplin.plugins.installationDir();
        const settings = JSON.parse(fs.readFileSync(installDir + '/settings.json', 'utf8'));

        let todoFolder;

        const todoFolderSearchRes = await joplin.data.get(['search'], {query: TODOIST_FOLDER_NAME, type: "folder"});
        if (todoFolderSearchRes.items.length == 0) {
            todoFolder = await joplin.data.post(['folders'], null, {title: TODOIST_FOLDER_NAME});
        } else {
            todoFolder = todoFolderSearchRes.items[0];
        }
        ttm.todoistToMarkdown(settings.key).then((projects: any[]) => {
            for (const project of projects) {
                console.info(project.project_name);
                joplin.data.post(['notes'], null, {
                    body: project.project_tree,
                    title: project.project_name,
                    parent_id: todoFolder.id
                }); // TODO merge duplicates
            }
        });
    },
});
