import "./../home.css";

const Search = ({ searchKey, setSearchKey }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        🔍
      </button>
    </div>
  );
};

export default Search;
