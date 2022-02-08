const fs = require('fs');
const path = require('path');

/** Retrieve file paths from a given folder and its subfolders. */
const traverseDirectories = (folderPath) => {
    const entryPaths = fs.readdirSync(folderPath).map(entry => path.join(folderPath, entry));
    const filePaths = entryPaths.filter(entryPath => fs.statSync(entryPath).isFile());
    const dirPaths = entryPaths.filter(entryPath => !filePaths.includes(entryPath));
    const dirFiles = dirPaths.reduce((prev, curr) => prev.concat(traverseDirectories(curr)), []);
    return [...filePaths, ...dirFiles];
};

module.exports = traverseDirectories;
