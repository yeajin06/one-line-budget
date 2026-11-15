export default function ParsePreview({ parsed, category, notice, conversion }) {
  if (!parsed) {
    return <p className="preview preview-empty">예) 점심 김밥 4500원</p>;
  }
  if (!parsed.ok) {
    return <p className="preview preview-error">{parsed.error}</p>;
  }
  const amountText =
    parsed.currency === 'KRW'
      ? `${parsed.amount.toLocaleString('ko-KR')}원`
      : `${parsed.amount.toLocaleString('ko-KR')} ${parsed.currency}`;
  return (
    <div className="preview preview-ok">
      <span>항목 <b>{parsed.item}</b></span>
      <span>금액 <b>{amountText}</b></span>
      <span>카테고리 <b>{category}</b></span>
      {conversion && (
        <span className="preview-conversion">
          ≈ <b>{conversion.krw.toLocaleString('ko-KR')}원</b> (1 {parsed.currency} ={' '}
          {conversion.rate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}원, 기준일{' '}
          {conversion.date})
        </span>
      )}
      {notice && <p className="preview-notice">{notice}</p>}
    </div>
  );
}
