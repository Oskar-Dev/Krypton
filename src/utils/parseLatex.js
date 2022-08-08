import { replaceAll } from './replaceAll.js';

const CLOSE_BRACKET_AT = ['\\', '+', '-', '*', '{', '}', ')', '('];
const DONT_OPEN_BRACKET_AT = ['\\', '(', '{'];

export const parseLatex = (latex) => {
  latex = replaceAll(latex, '\\cdot', '*');
  latex = replaceAll(latex, '\\operatorname{abs}', '\\abs');
  latex = replaceAll(latex, '\\operatorname{tg}', '\\tan ');
  latex = replaceAll(latex, '\\operatorname{ctg}', '\\cot ');

  console.log(latex);

  // set math constants
  latex = replaceAll(latex, '\\pi', '(pi)');
  latex = replaceAll(latex, '\\phi', '(phi)');

  // idk if this works
  latex = replaceAll(latex, '\\left|', '\\abs(');
  latex = replaceAll(latex, '\\right|', ')');

  // replace the cosmetic things
  latex = replaceAll(latex, '\\left', '');
  latex = replaceAll(latex, '\\right', '');

  // fix multiplication (add *)
  var matches = latex.match(/(}(\d|[a-z]|\\))|((\d|[a-z])\\)/g);
  console.log('matches:', matches);

  if (matches !== null) {
    matches.forEach((match) => {
      latex = latex.replace(match, match[0] + '*' + match[1]);
    });
  }

  // replace frac
  latex = replaceAll(latex, '\\frac', '');

  var openedBracket = false;
  for (var i = 0; i < latex.length; i++) {
    var char = latex[i];

    if (openedBracket && CLOSE_BRACKET_AT.includes(char) && latex[i - 1] !== '^' && latex[i - 2] !== '^') {
      latex = latex.slice(0, i) + ')' + latex.slice(i);
      openedBracket = false;
      i++;
    }

    if (char === '\\' && i < latex.length - 1) {
      i++;
      char = latex[i];
      var functionName = '\\';

      while (char.match(/[a-z]/g) && i < latex.length) {
        functionName += char;

        i++;
        char = latex[i];
      }

      if (!openedBracket && latex[i + 1] !== '\\' && !DONT_OPEN_BRACKET_AT.includes(latex[i])) {
        latex = latex.slice(0, i) + '(' + latex.slice(i);
        openedBracket = true;
        i++;
      }

      switch (functionName) {
        case '\\log':
          latex = latex.replace(functionName, 'log10');
          break;

        case '\\ln':
          latex = latex.replace(functionName, 'log');
          break;

        default:
          continue;
      }
    }
  }

  if (openedBracket) latex += ')';

  latex = replaceAll(latex, '}{', ')/(');
  latex = replaceAll(latex, '}', ')');
  latex = replaceAll(latex, '{', '(');
  latex = replaceAll(latex, '\\', '');
  latex = replaceAll(latex, '()', '');
  latex = replaceAll(latex, ')(', ')*(');

  return latex;
};
