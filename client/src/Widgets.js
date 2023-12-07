import React from "react";
import "./Widgets.css";
import SearchIcon from "@mui/icons-material/Search";

function Widgets() {
  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
        <input placeholder="Search News" type="text" />
      </div>
    </div>
  );
}

export default Widgets;