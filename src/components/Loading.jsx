// src/components/Loading.jsx
import React from "react";
import "./css/Loading.css";

export default function Loading() {
    return (
        <div
            className="loading-wrap max-w-[980px] mx-auto mt-4 flex flex-col gap-4 items-center p-2"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="loader-top flex items-center gap-3 text-slate-800 font-bold">
                <div className="spinner" aria-hidden="true" />
                <div className="loading-text">Fetching weather…</div>
            </div>

            <div className="loading-skeletons flex gap-4 w-full justify-center items-start flex-wrap">
                {/* skeleton for realtime card */}
                <div className="skeleton-card w-full max-w-[520px]">
                    <div className="skeleton-header flex justify-between gap-3 items-center">
                        <div className="skeleton-title" />
                        <div className="skeleton-meta" />
                    </div>

                    <div className="skeleton-main flex gap-3 items-center justify-between mt-2">
                        <div className="skeleton-temp" />
                        <div className="skeleton-cond flex-1 flex flex-col gap-2 pl-2">
                            <div className="skeleton-line short" />
                            <div className="skeleton-line shorter" />
                        </div>
                    </div>

                    <div className="skeleton-row flex gap-2 mt-3">
                        <div className="skeleton-block" />
                        <div className="skeleton-block" />
                        <div className="skeleton-block" />
                    </div>
                </div>

                {/* skeleton for forecast card */}
                <div className="skeleton-card small w-full max-w-[380px]">
                    <div className="skeleton-header flex justify-between items-center gap-3">
                        <div className="skeleton-title small" />
                        <div className="skeleton-meta small" />
                    </div>

                    <div className="skeleton-strip flex gap-2 mt-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton-hour" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
