import { useState,useCallback } from 'react';
const data  = [
    "Apple",
    "Banana",
    "Orange",
    "Grape",
    "Strawberry",
    "Blueberry",
    "Raspberry",
    "Mango",
    "Pineapple",
    "Watermelon",
    "Kiwi",
    "Peach",
    "Pear",
    "Plum",
    "Cherry",
    "Lemon",
    "Lime",
    "Avocado",
    "Tomato",
    "Coconut",
    "Papaya",
    "Guava",
    "Pomegranate",
    "Blackberry",
    "Cranberry",
    "Mandarin Orange",
    "Clementine",
    "Tangerine",
    "Grapefruit",
    "Cantaloupe",
    "Honeydew Melon",
    "Fig",
    "Date",
    "Raisin",
    "Apricot",
    "Nectarine",
    "Lychee",
    "Passion Fruit",
    "Dragon Fruit",
    "Star Fruit",
    "Persimmon",
    "Quince",
    "Elderberry",
    "Gooseberry",
    "Currant (Red)",
    "Currant (Black)",
    "Currant (White)",
    "Boysenberry",
    "Loganberry",
    "Marionberry",
    "Ugli Fruit",
    "Pomelo",
    "Kumquat",
    "Plantain",
    "Breadfruit",
    "Jackfruit",
    "Durian",
    "Mangosteen",
    "Rambutan",
    "Longan",
    "Salak",
    "Cherimoya",
    "Soursop",
    "Feijoa",
    "Tamarind",
    "Acerola Cherry",
    "Cloudberry",
    "Lingonberry",
    "Saskatoon Berry",
    "Huckleberry",
    "Miracle Fruit",
    "Jaboticaba",
    "Akebia",
    "Canistel",
    "Sapodilla",
    "Black Sapote",
    "White Sapote",
    "Buddha's Hand Citron",
    "Yuzu",
    "Ugni",
    "Keitt Mango",
    "Alphonso Mango",
    "Ataulfo Mango",
    "Bosc Pear",
    "Anjou Pear",
    "Bartlett Pear",
    "Gala Apple",
    "Fuji Apple",
    "Honeycrisp Apple",
    "Navel Orange",
    "Valencia Orange",
    "Blood Orange",
    "Concord Grape",
    "Moon Drop Grape",
    "Rainier Cherry",
    "Bing Cherry",
    "Sour Cherry",
    "Key Lime",
    "Persian Lime",
    "Seville Orange",
    "Bergamot Orange",
    "Ugni Blanc Grape"
  ];
function DebouncedInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const filterItems =useCallback((text:string) => {
    // Simulate an API call or expensive filtering operation
    setTimeout(() => {
      const filtered = data.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
    }, 500);
  },[]);

   // Debounce delay of 300ms
  const debouncedFilter = useCallback(
    (text:string) => {
      let timerId;
      return function(text) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          filterItems(text);
        }, 300);
      }(text);
    },
    [filterItems]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event:any) => {
    setSearchTerm(event.target.value);
    debouncedFilter(event.target.value);
  };

  return (
    <div className='main-input'>
        <div>
 Search for a fruit
        </div>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleChange}
      />
   <ul>
    <div className='result-section'>
  {results && results.length > 0 ? (
    results.map((result) => <li key={result}>{result}</li>)
  ) : (
    <li>No results</li>
  )}
  </div>
</ul>
    </div>
  );
}

export default DebouncedInput;