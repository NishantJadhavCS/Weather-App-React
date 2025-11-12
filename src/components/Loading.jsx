import React from "react";
import "./css/Loading.css";

export default function Loading() {
    return (
        <div className="loading-wrap" role="status" aria-live="polite" aria-busy="true">
            <div className="loader-top">
                <div className="spinner" aria-hidden="true" />
                <div className="loading-text">Fetching weather…</div>
            </div>

            <div className="loading-skeletons">
                {/* skeleton for realtime card */}
                <div className="skeleton-card">
                    <div className="skeleton-header">
                        <div className="skeleton-title" />
                        <div className="skeleton-meta" />
                    </div>

                    <div className="skeleton-main">
                        <div className="skeleton-temp" />
                        <div className="skeleton-cond">
                            <div className="skeleton-line short" />
                            <div className="skeleton-line shorter" />
                        </div>
                    </div>

                    <div className="skeleton-row">
                        <div className="skeleton-block" />
                        <div className="skeleton-block" />
                        <div className="skeleton-block" />
                    </div>
                </div>

                {/* skeleton for forecast card */}
                <div className="skeleton-card small">
                    <div className="skeleton-header">
                        <div className="skeleton-title small" />
                        <div className="skeleton-meta small" />
                    </div>

                    <div className="skeleton-strip">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton-hour" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
