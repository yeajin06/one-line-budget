const WORD_UNITS = { 원: 'KRW', 달러: 'USD', 엔: 'JPY', 유로: 'EUR', 위안: 'CNY', 파운드: 'GBP' };
const SYMBOL_UNITS = { $: 'USD', '€': 'EUR', '£': 'GBP' };


const NUM = '(\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?|\\d+(?:\\.\\d+)?)';

const AMOUNT_RE = new RegExp(
  `([$€£])\\s*${NUM}|${NUM}\\s*(${Object.keys(WORD_UNITS).join('|')})`
);

const BARE_NUM_RE = new RegExp(NUM, 'g');

const BLOCKED_NEIGHBOR = /[A-Za-z가-힣\-/:]/;

function findBareAmount(input) {
  let found = null;
  for (const m of input.matchAll(BARE_NUM_RE)) {
    const before = input[m.index - 1] ?? '';
    const after = input[m.index + m[0].length] ?? '';
    if (BLOCKED_NEIGHBOR.test(before) || BLOCKED_NEIGHBOR.test(after)) continue;
    found = m;
  }
  return found;
}

export function parseEntry(text) {
  const input = typeof text === 'string' ? text : '';

  let m = input.match(AMOUNT_RE); 
  let currency;
  let rawAmount;
  let assumedUnit = false;

  if (m) {
    currency = m[1] ? SYMBOL_UNITS[m[1]] : WORD_UNITS[m[4]];
    rawAmount = m[2] ?? m[3];
  } else {
    m = findBareAmount(input);
    if (m) {
      currency = 'KRW';
      rawAmount = m[0];
      assumedUnit = true;
    }
  }
  if (!m) return { ok: false, error: '금액을 찾을 수 없어요. 예) 점심 김밥 4500원' };

  const amount = parseFloat(rawAmount.replace(/,/g, ''));
  if (amount <= 0) return { ok: false, error: '금액은 0보다 커야 해요.' };

  const rest = input.slice(0, m.index) + ' ' + input.slice(m.index + m[0].length);
  const item = rest.replace(/\s+/g, ' ').trim();
  if (!item) return { ok: false, error: '항목을 입력해 주세요. 예) 점심 김밥 4500원' };

  return { ok: true, item, amount, currency, assumedUnit };
}
