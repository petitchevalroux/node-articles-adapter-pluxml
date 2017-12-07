# articles-adapter-pluxml
Adapter to get informations from a pluXml cms

## Install
```
npm install articles-adapter-pluxml
```

## Usage

### Instantiation with a local directory
```javascript
const PluXmlAdapter = require("articles-adapter-pluxml"),
adapter = new PluXmlAdapter("/var/www/pluxml");
```

### Getting all articles ids as an array of string
```javascript
adapter.articles.getIds().then((ids)=>{
    console.log(ids);
});
```

### Getting article by id
```javascript
adapter.articles.getById("0001").then((article)=>{
    console.log(article);
});
```

### Url rewriting
Url rewriting setting use [sprintf](http://www.diveintojavascript.com/projects/javascript-sprintf) syntax with the following arguments :
```javascript
sprintf(rewriteRule, id, slug)
```

With an article having the following properties :
```javascript
{id:"0001",slug:"article-slug"}
```

The following code rewrite url to http://example.com/1-article-slug.html
```javascript
const adapter = new PluXmlAdapter({
    storage:"/var/www/pluxml",
    rewriteRule:"http://example.com/%d-%s.html"
});
adapter.articles.getById("0001").then((article)=>{
    console.log(article.url); // => http://example.com/1-article-slug.html
});
```
