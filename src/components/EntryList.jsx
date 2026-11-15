import EntryItem from './EntryItem';


export default function EntryList({ entries, isFiltered }) {
  if (entries.length === 0) {
    return (
      <p className="empty">
        {isFiltered ? '검색 결과가 없어요.' : '아직 기록이 없어요. 위에 한 줄을 입력해 보세요.'}
      </p>
    );
  }


  const sorted = [...entries].sort((a, b) => b.id - a.id);

  return (
    <ul className="entry-list">
      {sorted.map((e) => (
        <EntryItem key={e.id} entry={e} />
      ))}
    </ul>
  );
}
