# md-to-html
[honeo/md-to-html](https://github.com/honeo/md-to-html)  
[md-to-html](https://www.npmjs.com/package/md-to-html)

## なにこれ
markdownファイルをhtmlファイルに変換する。  
GitHub風Style、SyntaxHighlight、TOC付き。

## 使い方
```sh
$ npm i -S md-to-html
```
```js
import md2html from 'md-to-html';

const promise = md2html('foo.md', 'bar.html', {
	breaks: true,
	maxdepth: 2,
	title: 'page-title'
});
```

## API
### md2html(input, output [, options])
```js
options {
	encode: 'utf8', // fs.method(,, encode, )
	maxdepth: 6, // TOC深度
	style: 'monokai-sublime' // highlight.js/src/styles/${style}.css
	title: 'title' // <title>${title}</title>
	// ...and marked options
}
```
