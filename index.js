/*
    .md => .html
		TOC
			よさ気なHTML生成型のTOCライブラリがCDN入りしてくれれば乗り換えたい
		highlight.js
			package.jsonからversionを読み取り、以下のCDNから指定した.cssを拝借する。
			[highlightjs - cdnjs.com - The best FOSS CDN for web related libraries to speed up your websites!](https://cdnjs.com/libraries/highlight.js)
*/

// Modules
import marked from 'marked-id-no-overlap';
import fs from 'fs';
import pug from 'pug';
import highlight from 'highlight.js';
import path from 'path';
import toc from 'markdown-toc';

// Var
const pug_func = pug.compileFile( path.join(__dirname, 'template.jade') );
const css_string = fs.readFileSync( path.join(__dirname, 'style.css') );
const highlight_version = require('highlight.js/package.json').version;

const options_default = {
	encode: 'utf8',
	highlight(code){
		return highlight.highlightAuto(code).value;
	},
	maxdepth: 6,
	style: 'monokai-sublime',
	title: 'title'
}

/*
	本体
		標準設定をベースに引数の設定オブジェクトを上書きして
		対象のmarkdownファイルを読み込んで
		markedの設定を行い、tocをmarked-id-no-overlapのid属性値とhref属性値を合わせて作り、markedで変換して
		変換したHTML文字列を設定値と一緒にTemplateへ流し込んでhtmlファイルへ書き出し
*/
function md2html(input, output, options_arg={}){
	const options = Object.assign(options_default, options_arg);
	return new Promise( (resolve, reject)=>{
	    fs.readFile(input, options.encode, (err, mdstring)=>{
			err ?
				reject(err):
				resolve(mdstring);
		});
	}).then( (mdstring)=>{
		return new Promise( (resolve, reject)=>{
			marked.setOptions(options);
			const md_toc_string = toc(mdstring, {
				maxdepth: options.maxdepth,
				slugify: toc_slugify
			}).content + '\n\n';
			marked(md_toc_string+mdstring, (err, htmlstring)=>{
				err ?
					reject(err):
					resolve(htmlstring);
			});
		});
	}).then( (html_string)=>{
		return new Promise( (resolve, reject)=>{
			const new_htmlstring = pug_func({
				css_string,
				html_string,
				highlight_version,
				title: options.title,
				highlight_style: options.style
			});
			fs.writeFile(output, new_htmlstring, options.encode, (err)=>{
				err ?
					reject(err):
					resolve();
			});
		});
	});
}



/*
	markdown-toc用slugify
		返り値がanchor要素のhref属性値に使われる。
		なぜか二回呼び出されるから、引数を見て二度目の実行のみ値を弄るようにしている。
		絶対使い方間違ってる。
*/
const href_cache = {}
function toc_slugify(text, options, json){
	if(typeof json.slug==='string'){
		let href = text.replace(/ /g, '_');
		if(href_cache[href]){
			href_cache[href]++;
			href += href_cache[href];
		}else{
			href_cache[href] = 1
		}
		return href;
	}else{
		return text;
	}
}

export default md2html;
