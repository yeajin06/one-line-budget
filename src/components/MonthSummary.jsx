export default function MonthSummary({ total, count }) {
  return (
    <div className="month-summary">
      <span className="summary-label">총지출</span>
      <strong className="summary-total">{total.toLocaleString('ko-KR')}원</strong>
      <span className="summary-count">{count}건</span>
    </div>
  );
}
