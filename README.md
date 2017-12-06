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