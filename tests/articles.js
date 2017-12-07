"use strict";
const
    path = require("path"),
    Adapter = require(path.join(__dirname, "..")),
    assert = require("assert"),
    Promise = require("bluebird");
describe("articles", () => {
    const adapter = new Adapter(path.join(__dirname, "data"));
    describe("getIds", () => {
        it("return article ids", () => {
            return adapter
                .articles
                .getIds()
                .then((ids) => {
                    assert.deepEqual(ids, [
                        "0006",
                        "0007",
                        "0008"
                    ]);
                    return ids;
                });
        });
    });

    describe("getById", () => {
        it("return article url", () => {
            return adapter
                .articles
                .getById("0007")
                .then((article) => {
                    assert.equal(article.url,
                        "/index.php?article7/draft-article"
                    );
                    return article;
                });
        });
        it("return article title", () => {
            return adapter
                .articles
                .getById("0006")
                .then((article) => {
                    assert.equal(article.title,
                        "First Article");
                    return article;
                });
        });
        it("return article body", () => {
            return adapter
                .articles
                .getById("0008")
                .then((article) => {
                    assert.equal(article.body,
                        "Chapeau\nContent");
                    return article;
                });
        });

        it("return article publication date", () => {
            return adapter
                .articles
                .getById("0008")
                .then((article) => {
                    assert.equal(
                        article.publicationDate,
                        1532974680
                    );
                    return article;
                });
        });

        it("return article draft status", () => {
            return Promise.all([
                adapter.articles.getById("0007"),
                adapter.articles.getById("0006"),
                adapter.articles.getById("0008")
            ])
                .then((articles) => {
                    assert.equal(
                        articles[0].isDraft,
                        true
                    );
                    assert.equal(
                        articles[1].isDraft,
                        false
                    );
                    assert.equal(
                        articles[2].isDraft,
                        false
                    );
                    return articles;
                });
        });
    });
});
