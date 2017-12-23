let uFunc   = [];
let errored = false;
let error   = null;
let warn    = null; 

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

const noop = () => {};

function _xor(op1, op2){ return !!((op1 || op2) && !(op1 && op2)); }

function _char(n){ return String.fromCharCode(n); }

function _ord(c){ return c.charCodeAt(0); }

function _len(x){
    if (x.length !== undefined) return x.length;
    return 0;
}

function prettyprintArr(array){
    var str = "";
    for (var name in array){
        var el = array[name];
        el.constructor == Array ? str += prettyprintArr(el) + ", " : str += el + ", ";
    }
    str = str.replace(/, $/, "");
    return "[" + str + "]";
}

function castBukkit(val){
    if (typeof val == 'string' || typeof val == "String") return val.split("");
    return [val];
}

function ihasjsErr(errstr){
    if (!errored) error = "IHAZJS Error: " + errstr;
    errored = true;
}

function isFunc(funcname){
    for (var i = 0; i < uFunc.length; i++) if (uFunc[i].name == funcname) return true;
    return false;
}

function getFuncArgs(funcname){
    for (var i = 0; i < uFunc.length; i++) if (uFunc[i].name == funcname) return uFunc[i].num_args;
    return false;
}

function remComments(str){
    str = str.replace(/OBTW([\s\S]*?)TLDR/g, "");
    str = str.replace(/BTW.*/g, "");
    return str;
}

function parseInit(str){
    //IHAZJS doesn't care about them, should we still warn the user??
    str = str.replace(/HAI.*/g, "");
    str = str.replace(/KTHXB(YE|AI|AY).*/g, "");

    /***************************************************/
    /* I MIGHT ACTUALLY INCLUDE LIBRARYS LIKE THAT!!!1 */
    /***************************************************/
    str = str.replace(/CAN HAS .*/g, "");
    /***************************************************/

    str = str.replace(/[ \t]+/g, " ");
    str = str.replace(/[,]/g, "\n");
    str = str.replace(/\.{3}[ ]*\n/g, ""); 
    str = str.replace(/\r\n|\r|\n/g, "\n");
    str = str.replace(/[ ]+\n/g, "\n");  
    str = str.replace(/(.*) IS NOW A (.*)/g, "$1 R MAEK $1 A $2");
    str = str.replace(/(I HAS A (.*)) IT[SZ] (.*)/g, "$1\n$2 R $3");
    str = str.replace(/\bWIN\b/g, "true");
    str = str.replace(/\bFAIL\b/g, "false");
    return str;
}

function parseStringLiterals(str, strip){
    if (strip == true || strip == undefined){
        this.aliases = [];
        this.num_alaises = 0;
        let i = -1;
        let last_i = 0;
        let start;
        let in_str = false;
        let str_ = "";
        while ((i = str.indexOf('"', i+1)) !== -1){
            if (!in_str){
                str_ += str.substr(last_i, i - last_i);
                in_str = true;
                start = i;
            }
            else {
                let escapes = 0;
                let j = i - 1;
                while (j >= 0 && str[j--] == ":") escapes++;
                if (!(escapes % 2)){
                    in_str = false;
                    let quoted = str.substr(start + 1, (i - start - 1));
                    quoted = quoted.replace(/(\\*)(\n)/g, function($0, $1){
                        if ($1.length % 2) return $0;
                        return "\\n";
                    });
                    quoted = quoted.replace(/:([\)>o":]|\(.*?\)|\{.*?\})/g, function($0, $1){
                        switch($1){
                            case ")": { return "\\n"; }
                            case ">": { return "\\t"; }
                            case "o": { return "^g";  }
                            case '"': { return '\\"'; }
                            case ":": { return ":";   }
                        }
                        if ($1.charAt(0) == "{") return '"+' + $1.substr(1,$1.length-2) + '+"';
                        if ($1.charAt(0) == "(") return "\\u" + $1.substr(1,$1.length-2);
                        return $0;
                    });
                    this.aliases[this.num_alaises] = quoted;
                    str_ += "@" + this.num_alaises++;
                    i++;
                }
            }
            last_i = i;
        }
        str_ += str.substr(last_i);
        return str_;
    }
    else {
        for (let i = this.num_alaises - 1; i >= 0; i--) str = str.replace("@" + i, '"' + this.aliases[i] + '"');
        return str;
    }
}

function tokenizer(str){
    let tokens = [];
    let string = [];
    for (let i = 0; i < str.length; i++){
        let str_ = str.substr(i), match = null;
        if      ((match = /^A\b/.exec(str_))) tokens.push("A");
        else if ((match = (/^I HAS A(?=\s)/.exec(str_)))) tokens.push("DECLARE");
        else if ((match = (/^(R|IT[SZ])(?=\s)/.exec(str_)))) tokens.push("ASSIGN");
        else if ((match = (/^G[EI]MMEH(?=\s)/.exec(str_)))) tokens.push("PROMPT");
        else if ((match = /^MAEK(?=\s)/.exec(str_))) tokens.push("CAST");
        else if ((match = /^(NOOB|YARN|NUMBR|NUMBAR|TROOF|BUKKIT)(?=\s)/.exec(str_))) tokens.push("TYPE");
        else if ((match = /^(SMALL?E?R|BIGG?E?R) THAN\b/.exec(str_))) tokens.push("CMP_OP");
        else if ((match = /^O RLY\?/.exec(str_))) tokens.push("START_IF");
        else if ((match = /^YA RLY\b/.exec(str_))) tokens.push("IF");
        else if ((match = /^MEBBE\b/.exec(str_))) tokens.push("ELSE_IF");
        else if ((match = /^NO WAI\b/.exec(str_))) tokens.push("ELSE");
        else if ((match = /^OIC\b/.exec(str_))) tokens.push("END_IF");
        else if ((match = /^AN\b/.exec(str_))) tokens.push("COMMA")
        else if ((match = /^((\-\s*)?\d+(\.\d+)?|true|false|@\d+(!\w+){0,2})\b/.exec(str_))) tokens.push("LITERAL");
        else if ((match = (/^(((SUM|DIFF|PRODUKT|MOD|QUOSHUNT|BOTH|EITHER|BIGGR|SMALLR|WON) OF)|BOTH SAEM|DIFFRINT)\b/.exec(str_)))) tokens.push("BINARY_OP");
        else if ((match = (/^(ALL|ANY|CHR|ORD|LEN) OF\b/.exec(str_)))) tokens.push("NARY_OP");
        else if ((match = (/^GOT\b/.exec(str_)))) tokens.push("NARY_OP");
        else if ((match = (/^NOT\b/.exec(str_)))) tokens.push("NARY_OP");
        else if ((match = /^IM IN [YU]R \w+$/.exec(str_))) tokens.push("LOOP_INF");
        else if ((match = /^IM IN [YU]R [a-zA-Z]\w+/.exec(str_))) tokens.push("LOOP");
        else if ((match = /^IM OUTTA [YU]R \w+\b/.exec(str_))) tokens.push("END_LOOP");
        else if ((match = /^(WILE|TILL?)\b/.exec(str_))) tokens.push("LOOP_CONDITION");
        else if ((match = /^(UPPIN|NERFIN) [YU]R\b/.exec(str_))) tokens.push("LOOP_ACTION");
        else if ((match = /^!!*/.exec(str_))) tokens.push("SCREECH");
        else if ((match = /^\?/.exec(str_))) tokens.push("QUESTION_MARK");
        else if ((match = /^UPZ\b/.exec(str_))) tokens.push("INC_OP");
        else if ((match = /^VISIBLE\b/.exec(str_))) tokens.push("STDOUT");
        else if ((match = /^IZ\b/.exec(str_))) tokens.push("INLINE_IF");
        else if ((match = /^KTHX\b/.exec(str_))) tokens.push("INLINE_IF_END");
        else if ((match = /^GTFO\b/.exec(str_))) tokens.push("BREAK");
        else if ((match = /^WTF\\?\b/.exec(str_))) tokens.push("SWITCH");
        else if ((match = /^OMG\b/.exec(str_))) tokens.push("SWITCH_CASE");
        else if ((match = /^OMGWTF\b/.exec(str_))) tokens.push("SWITCH_CASE_DEFAULT");  
        else if ( match = /^SMOOSH\b/.exec(str_)) tokens.push("NARY_OP");
        else if ( match = /^(MKAY|NOTHING?(?: ELSE)?)\b/.exec(str_)) tokens.push("OP_TERM");
        else if ((match = (/^HOW DUZ I\b/).exec(str_))) tokens.push("FUNC_DEF");
        else if ((match = (/^YR\b/).exec(str_))) tokens.push("VAR");
        else if ((match = (/^FOUND\b/).exec(str_))) tokens.push("RETURN");
        else if ((match = (/^IF U SAY SO\b/).exec(str_))) tokens.push("FUNC_DEF_END");
        else if ((match = (/^[a-zA-Z@][a-zA-Z0-9_]*(\!\w+)*/.exec(str_)))) tokens.push("IDENTIIFER");
        if (match){
            i += match[0].length - 1;
            string.push(match[0]);
        }
        else if ((match = str_.match(/^\S+/))){
            ihasjsErr("Unrecognised sequence while tokenizing: " + str_.match(/^\S+/) + "\n" + str_.substr(i));
            i+=match[0].length-1;
        }
    }
    if (tokens.length != string.length) ihasjsErr("Got different number of tokens than matches. This is fatal.");    
    let ret = [];
    for (let i = 0; i < tokens.length; i++){
        ret.push(tokens[i]);
        ret.push(string[i]);
    }
    return ret;
}

function subOperation(tokens){
    let s = tokens[1];
    if (s.charAt(0) == "B") return ">" + evalLine(tokens.slice(2));
    else if (s.charAt(0) == "S") return "<" + evalLine(tokens.slice(2));
    else if (s == "NOT") return "!(" + evalLine(tokens.slice(2)) + ")";
}

function getVariable(token){
    let value = token[1];
    let xc = value.split("!").length-1;
    if (!xc) return value;
    value = value.replace(/!/, "[");
    value = value.replace(/!/g, "][");
    value += "]";
    return value;
}

function evalExpression(tokens){
    let string = tokens[1];
    let op_symbols =  {
        "SUM OF"      : { symbol: "+",    nary: 2,  before: "(",          after: ")"  },
        "DIFF OF"     : { symbol: "-",    nary: 2,  before: "(",          after: ")"  },
        "PRODUKT OF"  : { symbol: "*",    nary: 2,  before: "(",          after: ")"  },
        "MOD OF"      : { symbol: "%",    nary: 2,  before: "(",          after: ")"  },
        "QUOSHUNT OF" : { symbol: "/",    nary: 2,  before: "(",          after: ")"  },
        "BOTH OF"     : { symbol: "&&",   nary: 2,  before: "(",          after: ")"  },
        "EITHER OF"   : { symbol: "||",   nary: 2,  before: "(",          after: ")"  },
        "BOTH SAEM"   : { symbol: "==",   nary: 2,  before: "(",          after: ")"  },
        "DIFFRINT"    : { symbol: "!=",   nary: 2,  before: "(",          after: ")"  },
        "BIGGR OF"    : { symbol: ",",    nary: 2,  before: "(Math.max(", after: "))" },
        "SMALLR OF"   : { symbol: ",",    nary: 2,  before: "(Math.min(", after: "))" },
        "WON OF"      : { symbol: ",",    nary: 2,  before: "(_xor(",     after: "))" },
        "ALL OF"      : { symbol: ")&&(", nary: -1, before: "((",         after: "))" },
        "ANY OF"      : { symbol: ")||(", nary: -1, before: "((",         after: "))" },
        "SMOOSH"      : { symbol: "+",    nary: -1, before: '""+',        after: ""   },
        "NOT"         : { symbol: "",     nary: 1,  before: "!(",         after: ")"  },     
        "GOT"         : { symbol: ",",    nary: -1, before: "[",          after: "]"  },
        "CHR OF"      : { symbol: "",     nary: 1,  before: "_char(",     after: ")"  },
        "ORD OF"      : { symbol: "",     nary: 1,  before: "_ord(",      after: ")"  },
        "LEN OF"      : { symbol: "",     nary: 1,  before: "_len(",      after: ")"  }
    };
    let stack = [];
    let str_ = "";
    for (var i = 0; i < tokens.length; i += 2){
        let s = tokens[i + 1], t = tokens[i], schedule_pop = false;
        switch(t){
            case "BINARY_OP":
            case "NARY_OP": {
                if (stack.length){
                    let st = stack[stack.length - 1];
                    str_ += (st.terms) ? st.symbol : "";        
                }
                var sym = op_symbols[s];
                var sym_copy = { symbol: sym.symbol, nary: sym.nary, before: sym.before, after: sym.after };
                sym_copy.terms = 0;
                str_ += sym_copy.before;
                stack.push(sym_copy);
                break;
            }
            case "COMMA": {
                noop(); //tmp
                break;
            }
            case "OP_TERM": {
                schedule_pop = true;
                break;
            }
            case "IDENTIIFER": {
                if (stack.length){
                    var sym = stack[stack.length-1];
                    str_ += (sym.terms)? sym.symbol : "";
                }
                var args = getFuncArgs(s);
                if (args !== false){
                    var sym = { nary:args, terms:0, symbol: ",", before: "", after: ")" };
                    stack.push(sym);
                    str_ += s + "(";
                }
                else{
                    str_ += getVariable([t,s]);      
                    ++sym.terms;
                }
                break;
            }
            case "LITERAL": {
                var sym = stack[stack.length-1];
                str_ += (sym.terms)? sym.symbol : "";
                str_ += getVariable([t,s]); 
                ++sym.terms
                break;
            }
            default: { ihasjsErr("Unexpected token in expression: " + t + "\n" + s); }
        }
        if (!stack.length) break;
        while (1){
            var sym = stack[stack.length - 1];
            if ((sym.terms >= sym.nary && sym.nary != -1) || schedule_pop){
                schedule_pop = false;
                stack.pop();
                str_ += sym.after;  
                if (stack.length) stack[stack.length-1].terms++;
                else break;
            }
            else break;
        }
        if (!stack.length) break;
    }
    while (stack.length) str_ += stack.pop().after;
    if (i < tokens.length - 2) str_ += evalLine(tokens.slice(i + 2));
    return str_;
}

function evalIdentifier(tokens){
    let id = tokens[1];
    if (!isFunc(id)) return getVariable([tokens[0], tokens[1]]) + evalLine(tokens.slice(2));
    return evalExpression(tokens);
}

function evalLine(tokens){
    if (!tokens.length) return "";
    let t = tokens[0];
    switch(t){
        case "BINARY_OP":
        case "NARY_OP": { return evalExpression(tokens); }
        case "IDENTIIFER": { return evalIdentifier(tokens); }
        case "ASSIGN": { return "=" + evalLine(tokens.slice(2)); }
        case "LITERAL": { return evalIdentifier(tokens); }
        case "CAST": {
            let func = "";
            let type = null;
            let val = [];
            let i;
            for (i = 2; i < tokens.length; i += 2){
                if (tokens[i] == "A"){
                    i += 2;
                    type = tokens[i + 1];
                    break;
                }
                val.push(tokens[i], tokens[i + 1]);
            }
            switch(type){
                case "YARN": { 
                    func = "String"; 
                    break;
                }
                case "TROOF": {
                    func = "Boolean"; 
                    break;
                }
                case "NUMBR": {  
                    func = "parseInt"; 
                    break;
                }
                case "NUMBAR": { 
                    func = "Number"; 
                    break;
                }
                case "BUKKIT": { 
                    func = "castBukkit"; 
                    break;
                }
                default: { 
                    ihasjsErr("Cast to unknown type: " + type);
                    return;
                }
            }
            return func + "(" + evalLine(val) + ")" + evalLine(tokens.slice(i + 2));
        }
        case "TYPE": { return tokens[1] + evalLine(tokens.slice(2)); }
        case "QUESTION_MARK": { return evalLine(tokens.slice(2)); }
        case "CMP_OP": { return subOperation(tokens); }
        default:  {
            ihasjsErr("Unknown token: " + t);
            return tokens.slice(2);
        }
    }
}

function parseLoop(tokens){
    let action = tokens[5] + (tokens[3].match(/^UPPIN/) ? "++" : "--");  
    let condition = evalLine(tokens.slice(8));
    if (tokens[7].charAt(0) == "T") condition = "!(" + condition + ")";
    let init = tokens[5] + "= ((typeof " + tokens[5] + '=="undefined") ? 0 : ' + tokens[5] + ")";
    let loop = "for((" + init + ");"  + condition + ";" + action + "){";
    return loop;
}

function evalFunctionDefinition(tokens){ 
    let f = "function " + tokens[3] + "(", args = 0;
    for (var i = 4; i < tokens.length; i += 2){
        let s = tokens[i + 1];
        let t = tokens[i];
        if (t != "IDENTIIFER") continue;
        f += s;
        args++;
        f += ",";
    }
    f = f.replace(/,+$/, "");
    f += "){\nvar IT = undefined;\n";
    uFunc.push( {name: tokens[3], num_args: args });
    return f;
}

function interpreteLine(tokens){
    if (!tokens.length) return "";
    let t = tokens[0], js = "";
    switch(t){
        case "BINARY_OP":
        case "NARY_OP": { return "IT =" + evalExpression(tokens) + ";"; }
        case "DECLARE": { return ("var " + tokens[3] + " = null;"); }
        case "START_IF": { return ""; }
        case "IF": { return "if (IT){"; }
        case "ELSE_IF": { return "} else if(" + evalLine(tokens.slice(2)) + "){"; }
        case "ELSE": { return "} else {"; }
        case "END_IF":
        case "END_LOOP": { return "}"; }
        case "IDENTIIFER":
        case "LITERAL": {
            if (tokens.length >= 2 && tokens[2] != "ASSIGN") return "IT = " + evalIdentifier(tokens) + ";";
            else return evalIdentifier(tokens) + ";";
        }
        case "PROMPT": { return tokens[3] + ' = prompt("' + tokens[3] + '");'; }
        case "STDOUT": {
            let newline = !(tokens[tokens.length - 2] == "SCREECH"), t;
            if (newline) t = tokens.slice(2);
            else t = tokens.slice(2, tokens.length - 2);
            let stdouttxt = evalLine(t);
            return "console.log(" + (stdouttxt.isArray ? prettyprintArr(stdouttxt) : stdouttxt) + ");";
        }
        case "INC_OP": {
            let v = evalIdentifier([tokens[2], tokens[3]]);
            if (tokens.length >= 8) v += "+=" + evalLine(tokens.slice(6)) + ";";
            else v += "++;";
            return v;
            break;
        }
        case "INLINE_IF": { return "if (" + evalLine(tokens.slice(2)) + "){"; }
        case "INLINE_IF_END": { return "}"; }
        case "BREAK": { return "break;"; }
        case "LOOP_INF": { return "while(1){"; }
        case "LOOP": { return parseLoop(tokens); }
        case "SWITCH": { return "switch(IT){"; }
        case "SWITCH_CASE": { return "case " + tokens[3] + ":"; }
        case "SWITCH_CASE_DEFAULT": { return "default:"; }
        case "RETURN": { return "return " + evalLine(tokens.slice(4)) + ";"; }
        case "FUNC_DEF": { return evalFunctionDefinition(tokens); }
        case "FUNC_DEF_END": { return "return (IT == undefined) ? null : IT;}"; }
        default: { return evalLine(tokens); }
    }
    return js;
}

function ihasjs(str, callback){
    errored = false;
    uFunc = [];
    str = remComments(str);
    str = parseStringLiterals(str, true);
    str = parseInit(str);
    let s = str.split("\n");
    let js_out = "";
    for (let i = 0; i < s.length; i++){
        let t = tokenizer(s[i]);
        let js = interpreteLine(t);
        js_out += js + "\n";
    }
    js_out = parseStringLiterals(js_out, false);
    return callback(error, warn, js_out);
}

module.exports = ihasjs;