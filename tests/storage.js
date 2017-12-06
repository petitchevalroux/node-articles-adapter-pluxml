"use strict";
const
    path = require("path"),
    Adapter = require(path.join(__dirname, "..")),
    assert = require("assert");
describe("storage", () => {

    it("adapter passes options to storage", () => {
        const samplePath = path.join(__dirname, "data"),
            adapter = new Adapter({
                storage: samplePath
            });
        assert.equal(adapter.getStorage()
            .options, samplePath);
    });

});
