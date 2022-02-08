const { readdir, readFile } = require('fs');
const fm = require('front-matter');
const { basename, extname } = require('path');

class Intents {
    constructor(client) {
        this.client = client;
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
                indexer: (_, content) => this.maybeIndex(content),
            },
            {
                path: 'intents/notes/content/notes',
                transformer: (currentPath, _, query) => {
                    return {
                        query,
                        response: `<https://notes.apiscp.com/${currentPath}/>`,
                    };
                },
                indexer: (currentPath, content) => {
                    content.path = `<https://notes.apiscp.com/${currentPath}/>`;
                    this.maybeIndex(content);
                },
            },
        ];
    }

    /**
     * Preload intents iterating known paths
     */
    preload() {
        this.paths.forEach(e => this.load(e.path, e.transformer, e.indexer || null));
    }

    /**
     * Load a path and apply the transformer before adding the result to intents array
     *
     * @param string path
     * @param function transformer
     */
    load(path, transformer, indexer = null) {
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

                // Maybe index
                if (indexer) {
                    indexer(currentPath, content);
                }
            }));
        });
    }

    maybeIndex(data) {
        if (this.client.fts && data) {
            this.client.fts.add(data);
        }
    }
}

module.exports = Intents;
