"use strict";
let fs    = require("fs");
let parse = require("./parser");

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

const isset = function(obj){ return !!(obj && obj !== null && (typeof obj === "string" && obj !== "")); };

const parser = function(code, plain){
    parse(code, function(err, warn, fin){
        if (err) return console.log(err);
        if (warn) console.log(warn)
        plain ? console.log(fin) : eval(fin);
        return true;
    });
};

const spawnShell = function(){
    let file = process.argv.slice(2)[0];
    let doPlain = false;
    let plain = "";
    if (!isset(file)) return console.log("Error: No input file.");
    fs.readFile(file, "utf8", function(err, data){
        if (err) return console.log("Error: " + err);
        plain = (isset(process.argv.slice(3)[0]) ? process.argv.slice(3)[0] : "");
        if (plain.toLowerCase() == "--plain" || plain.toLowerCase() == "-p") doPlain = true;
        parser(data, doPlain);
    });
};

(require.main === module) ? spawnShell() : module.exports = parser;
