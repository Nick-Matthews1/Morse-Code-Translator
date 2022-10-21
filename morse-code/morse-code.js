const CODES = {
  'A': `· —`,
  'B': `— · · ·`,
  'C': `— · — ·`,
  'D': `— · ·`,
  'E': `·`,
  'F': `· · — ·`,
  'G': `— — ·`,
  'H': `· · · ·`,
  'I': `· ·`,
  'J': `· — — —`,
  'K': `— · —`,
  'L': `· — · ·`,
  'M': `— —`,
  'N': `— ·`,
  'O': `— — —`,
  'P': `· — — ·`,
  'Q': `— — · —`,
  'R': `· — ·`,
  'S': `· · ·`,
  'T': `—`,
  'U': `· · —`,
  'V': `· · · —`,
  'W': `· — —`,
  'X': `— · · —`,
  'Y': `— · — —`,
  'Z': `— — · ·`,
  '0': `— — — — —`,
  '1': `· — — — —`,
  '2': `· · — — —`,
  '3': `· · · — —`,
  '4': `· · · · —`,
  '5': `· · · · ·`,
  '6': `— · · · ·`,
  '7': `— — · · ·`,
  '8': `— — — · ·`,
  '9': `— — — — ·`,
};

const TRANS = Object.keys(CODES).reduce((obj, key) => {
  let code = CODES[key].split(' ').map(c => c === '—' ? '-' : c === '·' ? '.' : c).join('');
  obj[code] = key;
  return obj;
}, {});

/*
1. 1dash = 3dot
2. Space between part of same character are 1dot
3. Space between two character is 3dots
4. Space between two words is 5dot
*/

function toMorse(str) {
  str = str.trim().toUpperCase();
  let code = str.split('')
    .map(c => {
      if (c in CODES) {
        return CODES[c];
      }
      else if (c === ' ') {
        return ' ';
      }
    })
    .filter(c => c);
  return code;
}

function fromMorse(str) {
  str = str.trim();
  let code = str.split('  ')
    .map(word => word.split(' ')
        .map(c => {
          if (c in TRANS) {
            return TRANS[c];
          }
          else if (c === ' ') {
            return '&nbsp';
          }
        })
        .filter(c => c)
        .join('')
    )
    .filter(w => w);
    
  return code.join(' ');
}

function morseToStr(code) {
  let str = '';
  code.forEach(character => {
    if (character === ' ') {
      str += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    else {
      character.split(' ').forEach(part => {
        str += part;
        str += '&nbsp;'
      });
      str += '&nbsp;&nbsp;&nbsp;';
    }
  });
  return str;
}

function speakMorse(code) {
  let dotLength = 1200.0 / wordsPerMinute; // PARIS standard dot formula
  let delay = 0;

  code.forEach(character => {
    if (character === CODES[' ']) {
      // Space between two words are 5 dots
      delay += dotLength * 5;
    }
    else {
      character.split(' ').forEach(part => {
        if (part === '·') {
          // dot duration is 1 dot :V
          tone.play(note, dotLength, delay);
          // Space between two parts of same character are 1 dot
          delay += dotLength * (1 + 1);
        }
        else if (part === '—') {
          // dash duration is 3 dots
          tone.play(note, dotLength * 3, delay);
          // Space between two parts of same character are 1 dot
          delay += dotLength * (3 + 1);
        }
      });
      // Space between two characters are 3 dots
      delay += dotLength * 3;
    }
  });
}

const tone = new Tone(); // see tone.js
const TO_INPUT = document.getElementById('to-morse-input');
const TO_OUTPUT = document.getElementById('to-morse-output');
const TO_LISTEN = document.getElementById('to-morse-listen');
const FROM_INPUT = document.getElementById('from-morse-input');
const FROM_OUTPUT = document.getElementById('from-morse-output');
const FROM_LISTEN = document.getElementById('from-morse-listen');

var wordsPerMinute = 12;
var note = 68;
var toCode = '';
var fromCode = '';

FROM_INPUT.addEventListener('input', e => {
  str = fromMorse(e.currentTarget.value);
  fromCode = toMorse(str);
  FROM_OUTPUT.innerHTML = str;
});

TO_INPUT.addEventListener('input', e => {
  toCode = toMorse(e.currentTarget.value);
  TO_OUTPUT.innerHTML = morseToStr(toCode);
});

TO_LISTEN.addEventListener('click', e => {
  speakMorse(toCode);
});

FROM_LISTEN.addEventListener('click', e => {
  speakMorse(fromCode);
});