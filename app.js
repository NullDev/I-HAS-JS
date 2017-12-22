"use strict";
let fs    = require("fs");
let parse = require("./parser");

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

const isset = function(obj){ return !!(obj && obj !== null && (typeof obj === "string" && obj !== "")); };

const parser = function(code, notPlain){
    parse(code, function(err, warn, fin){
        if (err) return console.log(err);
        if (warn) console.log(warn)
        notPlain ? eval(fin) : console.log(fin);
        return true;
    });
};

const spawnShell = function(){
    let file = process.argv.slice(2)[0];
    let noPlain = true;
    let plain = "";
    if (!isset(file)) return console.log("Error: No input file.");
    fs.readFile(file, "utf8", function(err, data){
        if (err) return console.log("Error: " + err);
        plain = (isset(process.argv.slice(3)[0]) ? process.argv.slice(3)[0] : "");
        if (plain.toLowerCase() == "--plain" || plain.toLowerCase() == "-p") noPlain = false;
        parser(data, noPlain);
    });
};

(require.main === module) ? spawnShell() : module.exports = parser;
