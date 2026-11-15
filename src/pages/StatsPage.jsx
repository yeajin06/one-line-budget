import { useContext, useMemo, useState } from 'react';
import { LedgerContext } from '../context/LedgerContext';
import { CATEGORIES } from '../utils/classify';
import MonthSelector from '../components/MonthSelector';
import MonthSummary from '../components/MonthSummary';
import CategoryBar from '../components/CategoryBar';

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function StatsPage() {
  const { entries } = useContext(LedgerContext);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const stats = useMemo(() => {
    const monthEntries = entries.filter((e) => e.date.startsWith(selectedMonth));
    const total = monthEntries.reduce((sum, e) => sum + e.krw, 0);
    const byCategory = CATEGORIES.map((name) => ({
      name,
      sum: monthEntries
        .filter((e) => e.category === name)
        .reduce((s, e) => s + e.krw, 0),
    }));
    return { count: monthEntries.length, total, byCategory };
  }, [entries, selectedMonth]);

  return (
    <section className="stats-page">
      <MonthSelector month={selectedMonth} onChange={setSelectedMonth} />
      {stats.count === 0 ? (
        <p className="empty">이 달의 지출이 없어요.</p>
      ) : (
        <>
          <MonthSummary total={stats.total} count={stats.count} />
          <CategoryBar items={stats.byCategory} total={stats.total} />
        </>
      )}
    </section>
  );
}
