// Widgets.js
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./Widgets.css";

function Widgets() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    // Implement your search logic here, e.g., open a new tab with the search query
    const searchQuery = encodeURIComponent(searchValue);
    const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(searchUrl, "_blank");
  };

  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
        <input
          placeholder="Search News"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {/* Add other widgets or components as needed */}
    </div>
  );
}

export default Widgets;
