"use strict";
const MultiFs = require("multi-fs"),
    Promise = require("bluebird"),
    diff = require("arr-diff");
class Storage {
    constructor(options) {
        this.options = options || {};
    }

    getFileContent(path) {
        return this
            .getClient()
            .then((client) => {
                return new Promise((resolve, reject) => {
                    client.readFile(
                        path,
                        "utf-8",
                        (err, content) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(content);
                        });
                });
            });
    }

    getFiles(path) {
        return this
            .getClient()
            .then((client) => {
                return new Promise((resolve, reject) => {
                    client.readdir(path, (err, files) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(diff(files, [
                            ".htaccess"
                        ]));
                    });
                });
            });
    }

    getClient() {
        if (typeof this.client === "undefined") {
            this.client = new MultiFs([this.options]);
        }
        return Promise.resolve(this.client);
    }
}

module.exports = Storage;
