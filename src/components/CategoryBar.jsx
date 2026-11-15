export default function CategoryBar({ items, total }) {
  const visible = items
    .filter((c) => c.sum > 0)
    .sort((a, b) => b.sum - a.sum); 

  return (
    <ul className="category-bars">
      {visible.map((c) => {
        const percent = Math.round((c.sum / total) * 100);
        return (
          <li key={c.name} className="bar-row">
            <div className="bar-head">
              <span>{c.name}</span>
              <span>{c.sum.toLocaleString('ko-KR')}원 · {percent}%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${percent}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
