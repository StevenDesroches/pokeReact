import { useState, useEffect, useRef } from 'react';

export default function SearchWithPopup() {
  // 1. Mock Data Source
  const sampleItems = [
    'Apple', 'Banana', 'Blueberry', 'Cherry', 'Dragonfruit', 
    'Grapes', 'Mango', 'Orange', 'Pineapple', 'Strawberry'
  ];

  // 2. Component States
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Ref to detect clicks outside of the search container
  const containerRef = useRef(null);

  // 3. Filter items dynamically when query changes
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredItems([]);
    } else {
      const filtered = sampleItems.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [query]);

  // 4. Close popup when user clicks outside the component
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 5. Handle item selection
  const handleSelect = (item) => {
    setQuery(item);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <input
        type="text"
        placeholder="Search fruits..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        style={styles.input}
      />

      {/* Popup Menu */}
      {isOpen && query && (
        <ul style={styles.popup}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                style={styles.item}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#fff')}
              >
                {item}
              </li>
            ))
          ) : (
            <li style={styles.noResult}>No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}

// Basic Inline Styles
const styles = {
  container: {
    position: 'relative',
    width: '300px',
    margin: '20px auto',
    fontFamily: 'sans-serif'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },
  popup: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    listStyleType: 'none',
    padding: 0,
    margin: '4px 0 0 0',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000
  },
  item: {
    padding: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  noResult: {
    padding: '10px',
    color: '#888',
    fontStyle: 'italic'
  }
};
