'strict';
const fs = require('fs');
const pdfjsLib = require("pdfjs-dist");

const savedFilesFolder = process.env.SAVED_FILES_FOLDER;
exports.searchDocument = (documentName) => {
    return new Promise(async (resolve, reject) => {
        console.log('searchDocument', documentName);
        var filePath = savedFilesFolder + documentName;
        if (fs.existsSync(filePath)) {
            const loadingTask = pdfjsLib.getDocument(filePath);
            loadingTask.promise
                .then(function (doc) {
                    const numPages = doc.numPages;
                    let lastPromise; // will be used to chain promises
                    lastPromise = doc.getMetadata().then(function (data) {

                    });
                    const loadPage = function (pageNum) {
                        return doc.getPage(pageNum).then(function (page) {
                            return page
                                .getTextContent()
                                .then(function (content) {
                                    const strings = content.items.map(function (item) {
                                        return item.str;
                                    });
                                    console.log("## Text Content");
                                    console.log(strings.join(" "));
                                    page.cleanup();
                                })
                        });
                    };
                    // Loading of the first page will wait on metadata and subsequent loadings
                    // will wait on the previous pages.
                    for (let i = 1; i <= numPages; i++) {
                        lastPromise = lastPromise.then(loadPage.bind(null, i));
                    }
                    return lastPromise;
                })
                .then(
                    function () {
                        console.log("# End of Document");
                    },
                    function (err) {
                        console.error("Error: " + err);
                    }
                );

        } else {
            reject('error', fs.existsSync(filePath));
        }
    });
}