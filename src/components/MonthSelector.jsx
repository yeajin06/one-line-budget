function shiftMonth(month, delta) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function MonthSelector({ month, onChange }) {
  const [y, m] = month.split('-').map(Number);
  return (
    <div className="month-selector">
      <button type="button" onClick={() => onChange(shiftMonth(month, -1))} aria-label="이전 달">
        ◀
      </button>
      <span className="month-label">{y}년 {m}월</span>
      <button type="button" onClick={() => onChange(shiftMonth(month, 1))} aria-label="다음 달">
        ▶
      </button>
    </div>
  );
}
