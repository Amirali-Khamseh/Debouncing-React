This is a part of my blog post @  https://blog.amir-khamseh.com/blog/debouncing-react
# Debouncing in React: Optimizing Search Performance

Debouncing is a technique that **limits the rate at which a function executes**, which is particularly useful for performance optimization in React applications. It makes sure that a function doesn't get called too frequently, especially in response to rapid-fire events like scrolling, resizing, or typing.

In this article, we'll build a simple React app with search functionality and compare how it performs **with** and **without** debouncing.  
The code for this example is available here: 👉[GitHub Repo](https://github.com/Amirali-Khamseh/Debouncing-React)👈

---

## 1. Searching Through Data **Without Debouncing**

In the first example, **every keystroke** triggers the search filtering immediately.  
This behavior is **not optimal** because it increases the load on the server (or client) and can hurt the overall performance — especially if the filtering or API logic becomes heavier.

In this example, we're not using an API call, but a `setTimeout` with 100 fruits in an array to simulate a complex operation:

```tsx
import { useState } from 'react';

const data = [
  "Apple", "Banana", "Orange", "Grape", "Strawberry", "Blueberry", "Raspberry",
  "Mango", "Pineapple", "Watermelon", "Kiwi", "Peach", "Pear", "Plum", "Cherry",
  "Lemon", "Lime", "Avocado", "Tomato", "Coconut", "Papaya", "Guava", "Pomegranate",
  "Blackberry", "Cranberry", "Mandarin Orange", "Clementine", "Tangerine",
  "Grapefruit", "Cantaloupe", "Honeydew Melon", "Fig", "Date", "Raisin", "Apricot",
  "Nectarine", "Lychee", "Passion Fruit", "Dragon Fruit", "Star Fruit", "Persimmon",
  "Quince", "Elderberry", "Gooseberry", "Currant (Red)", "Currant (Black)",
  "Currant (White)", "Boysenberry", "Loganberry", "Marionberry", "Ugli Fruit",
  "Pomelo", "Kumquat", "Plantain", "Breadfruit", "Jackfruit", "Durian", "Mangosteen",
  "Rambutan", "Longan", "Salak", "Cherimoya", "Soursop", "Feijoa", "Tamarind",
  "Acerola Cherry", "Cloudberry", "Lingonberry", "Saskatoon Berry", "Huckleberry",
  "Miracle Fruit", "Jaboticaba", "Akebia", "Canistel", "Sapodilla", "Black Sapote",
  "White Sapote", "Buddha's Hand Citron", "Yuzu", "Ugni", "Keitt Mango",
  "Alphonso Mango", "Ataulfo Mango", "Bosc Pear", "Anjou Pear", "Bartlett Pear",
  "Gala Apple", "Fuji Apple", "Honeycrisp Apple", "Navel Orange", "Valencia Orange",
  "Blood Orange", "Concord Grape", "Moon Drop Grape", "Rainier Cherry", "Bing Cherry",
  "Sour Cherry", "Key Lime", "Persian Lime", "Seville Orange", "Bergamot Orange",
  "Ugni Blanc Grape"
];

function DebouncedInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const filterItems = (text: string) => {
    setTimeout(() => {
      const filtered = data.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
    }, 500);
  };

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
    filterItems(event.target.value);
  };

  return (
    <div className="main-input">
      <div>Search for a fruit</div>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleChange}
      />
      <ul>
        {results.length > 0 ? (
          results.map(result => <li key={result}>{result}</li>)
        ) : (
          <li>No results</li>
        )}
      </ul>
    </div>
  );
}

export default DebouncedInput;
```

---
## 2. Searching Through Data **With Debouncing**

Let's optimize the search functionality by **adding debouncing**!


### Step 1 — Wrap `filterItems` inside a `useCallback`

First, we memoize the filtering logic using `useCallback`.  
This ensures that `filterItems` doesn't get recreated unnecessarily on each render:

```tsx
import { useCallback } from 'react';

const filterItems = useCallback((text: string) => {
  setTimeout(() => {
    const filtered = data.filter(item =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  }, 500);
}, []);
```
### Step 2 — Create a Debounced Version of `filterItems`
We create a `debouncedFilter` function, also wrapped inside a `useCallback`.
It works by:

- Clearing any existing timeout (clearTimeout)

- Setting a new timeout (setTimeout) that waits 300ms before calling filterItems
```tsx const debouncedFilter = useCallback((text: string) => {
  let timerId;
  return function(text: string) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      filterItems(text);
    }, 300);
  }(text);
}, [filterItems]);
```

### Step 3 — Update `handleChange` to Use Debouncing
Now, instead of calling `filterItems` directly inside the input handler, we call `debouncedFilter`:
```tsx
const handleChange = (event: any) => {
  setSearchTerm(event.target.value);
  debouncedFilter(event.target.value);
};

```

### The "Understanding" of Stopped Typing:

The debouncing mechanism doesn't explicitly "know" when the user has stopped typing. Instead, it assumes the user has stopped if no new keystrokes (and therefore no new calls to the debounced function) occur within the specified delay period (300ms in this example).

Each keystroke essentially resets the timer. Only when the stream of keystrokes pauses for longer than the debounce delay does the setTimeout callback finally get a chance to execute.

Think of it like a bouncer at a club with a 300ms rule: Every time someone tries to enter (a keystroke), the bouncer says, "Wait 300 milliseconds." If another person tries to enter within those 300 milliseconds, the bouncer resets the timer and makes everyone wait another 300 milliseconds from that new attempt. Only when 300 milliseconds pass without anyone trying to enter does the bouncer finally let the last person in (execute filterItems).

Therefore, the "understanding" of stopped typing is achieved through the absence of new events within the debounce time window, allowing the last scheduled timeout to finally trigger the desired action.


---
### A General useDebounce Hook (Not Part of This Project)
While it's not used in the codebase of this project, a common practice is to abstract the debounce logic into a reusable custom hook.

Here’s a general solution for you if you want to reuse debouncing across different components:
```tsx
import { useRef, useEffect, useCallback } from 'react';

function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

```
