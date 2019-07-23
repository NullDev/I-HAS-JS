# I HAS JS

<p align="center">
<img height="150" width="auto" src="https://raw.githubusercontent.com/NLDev/I-HAS-JS/master/icon.png" /><br>
A LOLCODE interpreter written in JavaScript
</p>

## :information_source: About

This is a LOLCODE interpreter/parser written in NodeJS.
It can be used as interpreter, which executes the code in the terminal as well as a parser, which outputs the parsed JavaScript code. 

## :bulb: Usage

### As NodeJS Script:
This tool can be used 'as is' in the terminal by passing a file. Example: 

```Assembly
node app.js ./examples/HELLO.lol
```

This will execute `HELLO.lol` in the terminal. <br>
The script takes one additional argument: `--plain` / `-p` <br>
That argument will not execute the LOLCODE script. It will output the parsed JavaScript code only. <br>
Example:

```Assembly
node app.js ./examples/HELLO.lol --plain
```

### As NPM Module:

The tool can be used as NPM Module as well.

**Example:**

```javascript
var parser = require("../app");
console.log(parser('VISIBLE "OMG HI"'));
// => console.log("OMG HI");
```

<hr>

## :postbox: NPM

[![](https://nodei.co/npm/lolcode.svg?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/lolcode)

<hr>

## :wrench: Installation

```Assembly
npm i lolcode
```

<hr>

## :warning: Warning

**This is highly experimental!**

<hr>
