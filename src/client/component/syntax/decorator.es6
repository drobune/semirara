// decorate lines
// put some annotation properties to page.lines

import clone from "clone";

export function decorateLines(lines){
  return addLangToLines(lines);
}

export function detectLang(str){
  const m = str.match(/^code:(.+)$/);
  if(m) return m[1];
  return null;
}

function detectCLI(str){
  const m = str.match(/^([\%\$]) (.+)/);
  if(m){
    const [, prefix, command] = m;
    return {prefix, command};
  }
  return false;
}

function addLangToLines(_lines){
  const lines = clone(_lines);
  let lang, indent;
  for(let line of lines){
    if(lang && line.indent > indent){
      line.lang = lang;
    }
    else{
      line.lang = lang = detectLang(line.value);
      if(lang){
        indent = line.indent;
        line.codestart = true;
      }
      else{
        indent = null;
        line.cli = detectCLI(line.value);
      }
    }
  }
  return lines;
}
