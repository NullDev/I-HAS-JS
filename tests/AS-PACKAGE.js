"use strict";
const parser = require("../app");

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

const LOLCODE = 'VISIBLE "OMG HI"';

console.log(parser(LOLCODE));

console.log();

console.log(parser(LOLCODE, true));
