import React, { useState, useRef, useEffect } from 'react';

// Lightweight, dependency-free searchable year combobox.
// Props:
//   value       - currently selected option value (e.g. '2003')
//   options     - [{ value, label }] list of selectable years
//   onSelect    - called with the chosen value
//   placeholder - input placeholder text
const YearPicker = ({ value, options, onSelect, placeholder }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Label to show when the picker is closed (the current selection's label).
  const currentLabel = options.find(o => String(o.value) === String(value))?.label || '';

  const filtered = query
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  // Close + reset the typed query when clicking outside.
  useEffect(() => {
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const choose = (option) => {
    onSelect(String(option.value));
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      choose(filtered[0]); // select the top filtered match
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="year-picker" ref={containerRef}>
      <input
        type="text"
        className="sidebar-select year-picker-input"
        placeholder={placeholder}
        value={open ? query : currentLabel}
        onFocus={() => setOpen(true)}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onKeyDown={handleKeyDown}
      />
      {open && filtered.length > 0 && (
        <ul className="year-picker-list">
          {filtered.map(option => (
            <li
              key={option.value}
              className={`year-picker-item ${String(option.value) === String(value) ? 'selected' : ''}`}
              // onMouseDown (not onClick) so it fires before the input's blur/outside handler.
              onMouseDown={() => choose(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YearPicker;
