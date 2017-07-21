### InjectScriptWebpackPlugin

#### Introduction

- A webpack plugin to insert script element when you need

#### Feature
- you can insert `<script src="foo"></script>` only when you debug
- you can set the src, include ip
- it will insert after `body`
- so you can auto inject the tool script, as weinre and so on


#### Usage

1. install

	```
	npm install --save-dev inject-script-webpack-plugin
	```

2. setting

	```
	new InjectScriptWebpackPlugin({
		src: 'http://[ip]:8080/target/target-script-min.js#anonymous',
		[inject]: true
	})
	```
	- `src` is required, and accept `[ip]` to set your ip address
	- when you set `inject`, or when you set `debug` in your command line, it will work
	- if you want control in command line, do not set `inject`
	
3. example

	```
	if not set inject:
	node server.js debug
	or
	npm run build -- debug
	or
	webpack --config webpack.config.js debug		
	```
	
#### TODO
- config insert position