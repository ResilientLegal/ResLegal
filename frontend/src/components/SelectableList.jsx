import { useState, useMemo } from 'react';

export default function SelectableList({
  data = [],
  labelKey = 'label',
  valueKey = 'id',
  onSelect,
}) {
  const [query, setQuery] = useState('');

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) =>
      String(item[labelKey] || '')
        .toLowerCase()
        .includes(q)
    );
  }, [data, labelKey, query]);

  const handleSelect = (item) => {
    if (onSelect) onSelect(item);
  };

  return (
    <div
      style={{
        padding: '8px 8px 6px',
        maxHeight: '260px',
        overflowY: 'auto',
        backgroundColor: 'white',
        borderRadius: '8px',
      }}
    >
      {/* Search bar */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search…"
        style={{
          width: '100%',
          padding: '6px 10px',
          marginBottom: '6px',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          outline: 'none',
        }}
      />

      {/* Results */}
      {filteredData.length === 0 ? (
        <div
          style={{
            padding: '8px',
            fontSize: '13px',
            color: '#9ca3af',
          }}
        >
          No results
        </div>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {filteredData.map((item) => (
            <li
              key={item[valueKey]}
              onClick={() => handleSelect(item)}
              style={{
                padding: '8px 10px',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '6px',
                marginBottom: '2px',
                transition: 'background-color 0.12s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {item[labelKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
