import { useContext, useMemo, useState } from 'react';
import { LedgerContext } from '../context/LedgerContext';
import { parseEntry } from '../utils/parseEntry';
import { classify, CATEGORIES } from '../utils/classify';
import ParsePreview from './ParsePreview';

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function QuickInput() {
  const { dispatch, rates, ratesDate, ratesStatus } = useContext(LedgerContext);
  const [text, setText] = useState('');
  const [manualCategory, setManualCategory] = useState(null); // null이면 자동 분류 사용

  const parsed = useMemo(() => (text.trim() ? parseEntry(text) : null), [text]);
  const category = parsed?.ok ? manualCategory ?? classify(parsed.item) : null;

  const isForeign = parsed?.ok && parsed.currency !== 'KRW';
  const rate = isForeign && ratesStatus === 'ok' ? rates[parsed.currency] : undefined;
  let krw = null;
  if (parsed?.ok) {
    krw = isForeign
      ? rate ? Math.round(parsed.amount * rate) : null
      : Math.round(parsed.amount);
  }
  const conversion = isForeign && rate ? { krw, rate, date: ratesDate } : null;
  const canSubmit = parsed?.ok && krw > 0;

  const notices = [];
  if (parsed?.ok && parsed.assumedUnit) notices.push('단위가 없어 원으로 계산했어요.');
  if (isForeign && ratesStatus === 'loading') notices.push('환율을 불러오는 중이에요.');
  else if (isForeign && !rate) notices.push('환율을 불러오지 못했어요. 원화로 입력해 주세요.');
  const notice = notices.join(' ');

  const handleChange = (e) => {
    setText(e.target.value);
    setManualCategory(null); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    dispatch({
      type: 'ADD',
      payload: {
        id: Date.now(),
        item: parsed.item,
        amount: parsed.amount, 
        currency: parsed.currency,
        krw, 
        category,
        date: today(),
      },
    });
    setText('');
    setManualCategory(null);
  };

  return (
    <form className="quick-input" onSubmit={handleSubmit}>
      <input
        className="quick-text"
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="한 줄로 입력하세요"
        aria-label="지출 한 줄 입력"
        autoFocus
      />
      <div className="quick-controls">
        <select
          className="quick-category"
          value={category ?? ''}
          onChange={(e) => setManualCategory(e.target.value)}
          disabled={!parsed?.ok}
          aria-label="카테고리"
        >
          {!category && <option value="">카테고리</option>}
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="quick-submit" type="submit" disabled={!canSubmit}>
          등록
        </button>
      </div>
      <ParsePreview
        parsed={parsed}
        category={category}
        notice={notice}
        conversion={conversion}
      />
    </form>
  );
}
