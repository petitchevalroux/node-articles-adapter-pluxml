"use strict";
const path = require("path"),
    util = require("util"),
    moment = require("moment-timezone");

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
                return self.getDataFromFile(file)
                    .then((fileData) => {
                        return [fileData, article];
                    });
            })
            .then(([fileData, article]) => {
                return Object.assign(article, fileData);
            });
    }

    getDataFromFile(file) {
        return this
            .options
            .pluxmlConfiguration
            .getTimezone()
            .then((timezone) => {
                const data = file.split("."),
                    date = data[3];
                return {
                    slug: data[4],
                    url: this.getUrl(data[0], data[4]),
                    publicationDate: moment
                        .tz(util.format(
                            "%s-%s-%s %s:%s",
                            date.substr(0, 4),
                            date.substr(4, 2),
                            date.substr(6, 2),
                            date.substr(8, 2),
                            date.substr(10, 2)
                        ), timezone)
                        .unix(),
                    isDraft: data[1].indexOf("draft") !== -1
                };
            });

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
