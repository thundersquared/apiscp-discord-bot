const { readdir, readFile } = require('fs');
const fm = require('front-matter');
const { basename, extname } = require('path');

class Intents {
    constructor() {
        this.intents = [];
        this.paths = [
            {
                path: 'intents/questions',
                transformer: (_, content, query) => {
                    return {
                        query,
                        response: [
                            content.attributes.title,
                            content.body.trim(),
                        ],
                    };
                },
            },
            {
                path: 'intents/notes/content/notes',
                transformer: (currentPath, _, query) => {
                    return {
                        query,
                        response: `<https://notes.apiscp.com/${currentPath}/>`,
                    };
                },
            },
        ];
    }

    /**
     * Preload intents iterating known paths
     */
    preload() {
        this.paths.forEach(e => this.load(e.path, e.transformer));
    }

    /**
     * Load a path and apply the transformer before adding the result to intents array
     *
     * @param string path
     * @param function transformer
     */
    load(path, transformer) {
        // Read notes directory
        readdir(`src/${path}`, (err, files) => {
            if (err) throw err;

            // Load all notes available
            files.forEach(file => readFile(`src/${path}/${file}`, 'utf-8', (err, data) => {
                if (err) throw err;

                // Parse frontmatter
                const content = fm(data);
                const currentPath = basename(file, extname(file));

                // Check if notes has queries
                if (content.attributes.hasOwnProperty('queries')) {
                    content.attributes.queries.forEach(query => {
                        // Apply transformation
                        let result = transformer(currentPath, content, query.toLowerCase());

                        // Skip if result is false
                        if (result) {

                            // Join response into a string if array found
                            if (Array.isArray(result.response) && result.response.length > 0) {
                                result.response = result.response.join("\n");
                            }

                            this.intents.push(result);
                        }
                    });
                }
            }));
        });
    }
}

module.exports = Intents;
