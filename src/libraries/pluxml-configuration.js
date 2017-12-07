"use strict";
const Promise = require("bluebird");
class PluxmlConfiguration {
    constructor(options) {
        this.options = options || {};
    }

    getTimezone() {
        return this.getParameters()
            .then((parameters) => {
                return parameters.get("timezone");
            });
    }

    getParameters() {
        if (this.parameters) {
            return Promise.resolve(this.parameters);
        }
        const self = this;
        return this
            .options
            .storage
            .getFileContent("configuration/parametres.xml")
            .then((content) => {
                return self
                    .options
                    .xmlParser
                    .parse(content);
            })
            .then((data) => {
                self.parameters = new Map();
                data.document.parametre.forEach((parameter) => {
                    self.parameters.set(
                        parameter["$"].name,
                        parameter["_"]
                    );
                });
                return self.parameters;
            });
    }
}

module.exports = PluxmlConfiguration;
