import { useContext, useMemo, useState } from 'react';
import { LedgerContext } from '../context/LedgerContext';
import QuickInput from '../components/QuickInput';
import SearchBar from '../components/SearchBar';
import EntryList from '../components/EntryList';

export default function LedgerPage() {
  const { entries } = useContext(LedgerContext);
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (!q || e.item.toLowerCase().includes(q)) &&
        (categoryFilter === '전체' || e.category === categoryFilter)
    );
  }, [entries, keyword, categoryFilter]);

  const isFiltered = keyword.trim() !== '' || categoryFilter !== '전체';

  return (
    <>
      <QuickInput />
      <section className="list-section">
        <h2>내역</h2>
        <SearchBar
          keyword={keyword}
          onKeywordChange={setKeyword}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          count={filtered.length}
        />
        <EntryList entries={filtered} isFiltered={isFiltered} />
      </section>
    </>
  );
}
