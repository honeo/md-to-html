console.log('md2html: test');

require("babel-register")({
	presets: ['es2015', 'es2016', 'stage-0'],
	ignore: false
});

// modules
const md2html = require('../').default;

md2html(
	'test/test.md',
	'test/test.html',
	{
		breaks: true,
		maxdepth: 2,
		title: 'hd2html test'
	}
).then( ()=>{
	console.log('success');
	require('opener')('./test/test.html');
}).catch( (error)=>{
	console.log('failed', error);
});
