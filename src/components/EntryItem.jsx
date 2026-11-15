import { useContext, useMemo, useState } from 'react';
import { LedgerContext } from '../context/LedgerContext';
import { parseEntry } from '../utils/parseEntry';
import { CATEGORIES } from '../utils/classify';

const UNIT_WORDS = { KRW: '원', USD: '달러', JPY: '엔', EUR: '유로', CNY: '위안', GBP: '파운드' };

function toSentence(entry) {
  return `${entry.item} ${entry.amount}${UNIT_WORDS[entry.currency] ?? '원'}`;
}

export default function EntryItem({ entry }) {
  const { dispatch, rates, ratesStatus } = useContext(LedgerContext);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState(entry.category);

  const startEdit = () => {
    setText(toSentence(entry));
    setCategory(entry.category);
    setIsEditing(true);
  };
  const cancel = () => setIsEditing(false);

  const parsed = useMemo(() => (isEditing ? parseEntry(text) : null), [isEditing, text]);

  let krw = null;
  let notice = '';
  if (parsed?.ok) {
    const unchanged = parsed.amount === entry.amount && parsed.currency === entry.currency;
    if (unchanged) {
      krw = entry.krw;
    } else if (parsed.currency === 'KRW') {
      krw = Math.round(parsed.amount);
    } else if (ratesStatus === 'ok' && rates[parsed.currency]) {
      krw = Math.round(parsed.amount * rates[parsed.currency]);
    } else {
      notice =
        ratesStatus === 'loading'
          ? '환율을 불러오는 중이에요.'
          : '환율을 불러오지 못했어요. 원화로 입력해 주세요.';
    }
    if (parsed.assumedUnit) notice = '단위가 없어 원으로 계산했어요.';
  }
  const canSave = parsed?.ok && krw > 0;

  const save = () => {
    if (!canSave) return;

    dispatch({
      type: 'UPDATE',
      payload: {
        id: entry.id,
        item: parsed.item,
        amount: parsed.amount,
        currency: parsed.currency,
        krw,
        category,
      },
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      cancel();
    }
  };

  if (isEditing) {
    return (
      <li className="entry entry-editing">
        <div className="entry-edit">
          <input
            className="edit-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="내역 수정"
            autoFocus
          />
          <div className="edit-controls">
            <select
              className="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="카테고리"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button className="edit-save" type="button" onClick={save} disabled={!canSave}>
              저장
            </button>
            <button className="edit-cancel" type="button" onClick={cancel}>
              취소
            </button>
          </div>
          {parsed && !parsed.ok && <p className="edit-message edit-error">{parsed.error}</p>}
          {parsed?.ok && krw > 0 && (
            <p className="edit-message edit-result">
              {parsed.item} · {krw.toLocaleString('ko-KR')}원
            </p>
          )}
          {notice && <p className="edit-message edit-notice">{notice}</p>}
        </div>
      </li>
    );
  }


  return (
    <li className="entry">
      <div className="entry-main">
        <span className="entry-item">{entry.item}</span>
        <span className="entry-meta">
          {entry.category} · {entry.date}
          {/* 외화 내역은 입력한 원래 금액도 표시 */}
          {entry.currency !== 'KRW' && (
            <span className="entry-original">
              {' '}· {entry.amount.toLocaleString('ko-KR')} {entry.currency}
            </span>
          )}
        </span>
      </div>
      <span className="entry-amount">{entry.krw.toLocaleString('ko-KR')}원</span>
      <div className="entry-actions">
        <button className="entry-edit-btn" onClick={startEdit} aria-label={`${entry.item} 수정`}>
          수정
        </button>
        <button
          className="entry-delete"
          onClick={() => dispatch({ type: 'DELETE', payload: entry.id })}
          aria-label={`${entry.item} 삭제`}
        >
          삭제
        </button>
      </div>
    </li>
  );
}
