// src/components/SearchBar.jsx
import React, { useState } from "react";
import "./css/SearchBar.css";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");
    const [includeAqi, setIncludeAqi] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        if (typeof onSearch !== "function") {
            console.warn("SearchBar: onSearch prop is not a function");
            return;
        }
        try {
            setSubmitting(true);
            await onSearch(query.trim(), includeAqi);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="search-bar w-full text-center mt-14">
            <h1 className="title text-4xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                Weather Finder
            </h1>

            <form
                onSubmit={handleSubmit}
                className="search-form flex flex-wrap justify-center items-center gap-4"
            >
                <input
                    type="text"
                    placeholder="Enter city or town"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input px-4 py-3 w-[260px] sm:w-[320px] rounded-xl border border-indigo-200 bg-white/90 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-transform duration-200"
                    aria-label="Search location"
                />

                <label className="aqi-toggle inline-flex items-center gap-2 text-sm text-slate-700 bg-white/75 px-3 py-2 rounded-lg border border-slate-100 shadow-sm cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={includeAqi}
                        onChange={(e) => setIncludeAqi(e.target.checked)}
                        className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-1">Include Air Quality (AQI)</span>
                </label>

                <button
                    type="submit"
                    className="search-btn relative inline-flex items-center px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-indigo-600 to-indigo-500 shadow-lg hover:-translate-y-1 active:translate-y-0 transition-transform disabled:opacity-60"
                    disabled={submitting}
                >
                    {submitting ? "Searching…" : "Search"}
                </button>
            </form>
        </div>
    );
}
