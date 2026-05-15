import { memo } from "react";

function Search({ onSearch, placeholder }) {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative group">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        onChange={handleChange}
        className="w-full sm:w-80 px-4 py-2.5 pl-11 rounded-xl 
        bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 
        text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
        shadow-sm group-hover:border-indigo-300 dark:group-hover:border-indigo-800
        focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400
        transition-all duration-300"
      />

      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}

export default memo(Search);

