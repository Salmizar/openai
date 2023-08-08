'strict';
const fs = require('fs');
const pdfjsLib = require("pdfjs-dist");
const chunkSize = 3000;
const trimPadding = 500;
const savedFilesFolder = process.env.SAVED_FILES_FOLDER;
exports.searchDocument = (documentName, searchKeywords) => {
    return new Promise(async (resolve, reject) => {
        getDocumentText(documentName).then((documentText) => {
            let docText = documentText.toLocaleLowerCase();
            let searchResults = findDocumentChunk(docText, searchKeywords.split(', '))[0];
            searchResults.text = documentText.substring(searchResults.start,searchResults.end);
            resolve(searchResults);
        }).catch((error) => {
            reject(error);
        });
    });
};
const getDocumentText = (documentName) => {
    return new Promise(async (resolve, reject) => {
        var filePath = savedFilesFolder + documentName;
        var docText = '';
        if (fs.existsSync(filePath)) {
            pdfjsLib.getDocument(filePath).promise
                .then((doc) => {
                    const numPages = doc.numPages;
                    let lastPromise = doc.getMetadata().then(function (data) { });// will be used to chain promises
                    const loadPage = function (pageNum) {
                        return doc.getPage(pageNum).then(function (page) {
                            return page
                                .getTextContent()
                                .then((content) => {
                                    const strings = content.items.map(function (item) {
                                        return item.str;
                                    });
                                    docText += strings.join(" ");
                                    page.cleanup();
                                })
                        });
                    };
                    for (let i = 1; i <= numPages; i++) {
                        lastPromise = lastPromise.then(loadPage.bind(null, i));
                    }
                    return lastPromise;
                })
                .then(
                    () => {
                        resolve(docText);
                    },
                    (err) => {
                        console.error("Error: " + err);
                    }
                );

        } else {
            reject('error', fs.existsSync(filePath));
        }
    });
}
const findDocumentChunk = (documentText, searchKeywords) => {
    const docLen = documentText.length;
    let results = new Array();
    //TF-IDF (Term Frequency - Inverse Document frequency)
    //The more often a word occurs in the document, the less weight it has, when found.
    let df = {};
    for (var i = 0; i <= docLen; i += chunkSize / 2) {
        var result = {
            start: i,
            end: i + chunkSize,
            trimmedStart: (i===0)?0:i+trimPadding,
            trimmedEnd: i + chunkSize - trimPadding,
            searchWeight: 0,
            searchResults: {}
        };
        searchKeywords.forEach((keyword) => {
            let searchTermIndex = documentText.substring(result.trimmedStart, result.trimmedEnd).split(keyword).length;
            df[keyword] = (df[keyword] || 0) + (searchTermIndex - 1);
            if (searchTermIndex > 1) {
                result.searchResults[keyword] = searchTermIndex;
            }
        });
        if (Object.keys(result.searchResults).length > 0) {
            results.push(result);
        }
    }
    results.forEach((result) => {
        for (searchResult in result.searchResults) {
            if (df[searchResult] > 0) {
                result.searchWeight += result.searchResults[searchResult] / df[searchResult];
            }
        };
    });
    results = results.sort((a, b) => {
        if (a.searchWeight > b.searchWeight) { return -1; }
        if (b.searchWeight < a.searchWeight) { return 1; }
        return 0;
    });
    return results;
}