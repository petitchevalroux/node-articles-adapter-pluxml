"use strict";
const Promise = require("bluebird"),
    parseXml = require("xml2js")
        .parseString;
class XmlParser {
    parse(string) {
        return new Promise((resolve, reject) => {
            parseXml(string, {
                "explicitArray": false
            }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
}

module.exports = XmlParser;
