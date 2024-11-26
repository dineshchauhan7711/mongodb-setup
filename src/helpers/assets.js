
const config = require('../config/config');

/***
 * Get File URL
 */
const getFileURL = function (folderName, fileName) {
    return config.project_path + `/${folderName}/` + fileName;
};

module.exports = {
    getFileURL,
};
