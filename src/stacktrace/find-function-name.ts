/**
* Copyright (c) 2017 Eric Wendelin and other contributors
* https://github.com/stacktracejs/stacktrace-gps/blob/master/stacktrace-gps.js
*/

export function findFunctionName(source: string, lineNumber: number) {
  
  const syntaxes = [
    // {name} = function ({args}) TODO args capture
    /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/,
    // function {name}({args}) m[1]=name m[2]=args
    /function\s+([^('"`]*?)\s*\(([^)]*)\)/,
    // {name} = eval()
    /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/,
    // fn_name() {
    /\b(?!(?:if|for|switch|while|with|catch)\b)(?:(?:static)\s+)?([^('"`\s]+?)\s*\([^)]*\)\s*\{/,
    // {name} = () => {
    /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*\(.*?\)\s*=>/
  ];
  const lines = source.split('\n');

  // Walk backwards in the source lines until we find the line which matches one of the patterns above
  let code = '';
  const maxLines = Math.min(lineNumber, 20);
  for (let i = 0; i < maxLines; ++i) {
    // lineNo is 1-based, source[] is 0-based
    let line = lines[lineNumber - i - 1];
    const commentPos = line.indexOf('//');
    if (commentPos >= 0) {
      line = line.substr(0, commentPos);
    }

    if (line) {
      code = line + code;
      const len = syntaxes.length;
      for (let index = 0; index < len; index++) {
        const m = syntaxes[index].exec(code);
        if (m && m[1]) {
          return m[1];
        }
      }
    }
  }
  return undefined;
}