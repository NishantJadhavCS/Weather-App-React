import React, { useState } from "react";
import "./css/SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [includeAqi, setIncludeAqi] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query, includeAqi);
    };

    return (
        <div className="search-bar">
            <h1 className="title">Weather Finder</h1>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    placeholder="Enter city or town"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                <label className="aqi-toggle">
                    <input
                        type="checkbox"
                        checked={includeAqi}
                        onChange={() => setIncludeAqi(!includeAqi)}
                    />
                    Include Air Quality (AQI)
                </label>
                <button type="submit" className="search-btn">
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
