"use strict";
const path = require("path"),
    Storage = require(path.join(__dirname, "libraries", "storage")),
    XmlParser = require(path.join(__dirname, "libraries", "xml-parser")),
    ArticlesRepository = require(path.join(__dirname, "repositories",
        "articles"));



class PluxmlAdapter {

    constructor(options) {
        this.options = Object.assign({}, typeof options === "string" ? {
            storage: options
        } : options || {});
        const self = this;
        this.articles = {
            getIds: () => {
                return self
                    .getArticlesRepository()
                    .getIds();
            },
            getById: (id) => {
                return self
                    .getArticlesRepository()
                    .getById(id);
            }
        };
    }

    getArticlesRepository() {
        if (!this.articlesRepository) {
            this.articlesRepository = new ArticlesRepository({
                storage: this.getStorage(),
                xmlParser: this.getXmlParser()
            });
        }
        return this.articlesRepository;
    }

    getStorage() {
        if (!this.storage) {
            this.storage = new Storage(this.options.storage);
        }
        return this.storage;
    }

    getXmlParser() {
        if (!this.xmlParser) {
            this.xmlParser = new XmlParser();
        }
        return this.xmlParser;
    }
}

module.exports = PluxmlAdapter;
