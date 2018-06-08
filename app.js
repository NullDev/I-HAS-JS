"use strict";

////////////////////////////////
//----------------------------//
// Copyright (c) 2018 NullDev //
//----------------------------//
////////////////////////////////

let fs    = require("fs");
let parse = require("./parser");

let isset = function(obj){ 
    return !!(obj && obj !== null && (typeof obj === 'string' || typeof obj === 'number' && obj !== "") || obj === 0); 
};

const parser = function(code, notPlain){
    parse(code, function(err, warn, fin){
        if (err) return console.log(err);
        if (warn) console.log(warn)
        notPlain ? eval(fin) : console.log(fin);
        return true;
    });
};

const spawnShell = function(){
    let pArg = require("minimist")(process.argv.slice(2));

    if (("h" in pArg) || ("help" in pArg)) return console.log(
        "\nHelp:\n\n" +
        " |===========|=======|=================================|==========|=========|\n" +
        " | Argument  | Alias | Description                     | Required | Default |\n" +
        " | --------- | ----- | ------------------------------- | -------- | ------- |\n" +
        " | --help    | -h    | Displays the help menu          | No       | N/A     |\n" +
        " | --plain   | -p    | Output the JS only. Dont run it | No       | False   |\n" +
        " | --out     | -o    | Set where to write the result   | No       | N/A     |\n" +
        " | --verbose | -v    | Display additional informations | No       | False   |\n" +
        " | ----------| ----- | ------------------------------- | -------- | ------- |\n" +
        " |==========================================================================|\n"
    );


    let file = process.argv.slice(2)[0];
    let plain = false;
    if (!isset(file)) return console.log("Error: No input file.");
    fs.readFile(file, "utf8", function(err, data){
        if (err) return console.log("Error: " + err);

        plain = pArg.p || pArg.plain;
        parser(data, !plain);
    });
};

(require.main === module) ? spawnShell() : module.exports = parser;
