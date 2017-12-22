"use strict";
const childProcess = require("child_process");

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

/* This script runs examples/HELLO.lol */
/* First it executes it, then it shows */
/* the plain code.                     */

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function runScript(scriptPath, plain, callback){
    let invoked = false;
    let process = childProcess.fork(scriptPath, (plain ? ["../examples/HELLO.lol", "--plain"] : ["../examples/HELLO.lol"]));
    process.on("error", function(err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });
    process.on("exit", function(code){
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error("Exit code: " + code);
        callback(err);
    });
}

runScript("../app", false, function (err){ if (err) throw err; });
sleep(500);
runScript("../app", true,  function (err){ if (err) throw err; });
