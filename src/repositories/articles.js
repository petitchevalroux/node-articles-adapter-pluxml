"use strict";
const path = require("path"),
    util = require("util");

class ArticlesRepository {
    constructor(options) {
        this.options = options || {};
    }

    getIds() {
        const self = this;
        return this
            .getFiles()
            .then((files) => {
                return files.map((file) => {
                    return self.getIdByFile(file);
                });
            });
    }

    getIdByFile(file) {
        const firstDotIndex = file.indexOf(".");
        if (firstDotIndex < 0) {
            throw new Error("Invalid file name");
        }
        return file.substr(0, firstDotIndex);
    }

    /**
     * Return file name
     * @param {string} id
     * @returns {Promise<string>}
     */
    getFileById(id) {
        const self = this;
        return this
            .getFiles()
            .then((files) => {
                return files
                    .find((file) => {
                        return self.getIdByFile(file) === id;
                    });
            })
            .then((file) => {
                return typeof(file) === "string" ? file : "";
            });
    }

    getById(id) {
        const self = this;
        return this
            .getFileById(id)
            .then((file) => {
                return this
                    .options
                    .storage
                    .getFileContent(self.getPathByFile(file))
                    .then((content) => {
                        return [file, content];
                    });
            })
            .then(([file, content]) => {
                return this
                    .options
                    .xmlParser
                    .parse(content)
                    .then((article) => {
                        return [file, {
                            title: article.document.title,
                            body: article.document.chapo +
                                "\n" +
                                article.document.content
                        }];
                    });
            })
            .then(([file, article]) => {
                return Object.assign(article, self.getDataFromFile(file));
            });
    }

    getDataFromFile(file) {
        const data = file.split(".");
        return {
            slug: data[4],
            url: this.getUrl(data[0], data[4])
        };
    }

    getUrl(id, slug) {
        return util.format("/index.php?article%d/%s", id, slug);
    }

    getPathByFile(file) {
        return path.join("articles", file);
    }

    getFiles() {
        return this.options.storage.getFiles("articles");
    }

}

module.exports = ArticlesRepository;
