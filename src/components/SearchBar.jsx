import { CATEGORIES } from '../utils/classify';

export default function SearchBar({
  keyword,
  onKeywordChange,
  categoryFilter,
  onCategoryChange,
  count,
}) {
  return (
    <div className="search-bar">
      <input
        className="search-text"
        type="text"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="항목 검색"
        aria-label="항목 검색"
      />
      <select
        className="search-category"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="카테고리 필터"
      >
        <option value="전체">전체</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <span className="search-count">{count}건</span>
    </div>
  );
}
