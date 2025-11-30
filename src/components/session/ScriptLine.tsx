"use client";

import { useState, useRef } from "react";
import { Sentence } from "@/types";
import { CommentPopover } from "./CommentPopover";
import { AnalysisPanel, Highlight } from "./AnalysisPanel";

interface ScriptLineProps {
    sentence: Sentence;
    index: number;
    isActive: boolean;
    expanded: boolean;
    highlights: Highlight[];
    onToggleExpand: () => void;
    onAddHighlight: (text: string, comment: string) => void;
    onSeek: (startTime: number) => void;
}

export function ScriptLine({
    sentence,
    index,
    isActive,
    expanded,
    highlights,
    onToggleExpand,
    onAddHighlight,
    onSeek
}: ScriptLineProps) {
    const [selection, setSelection] = useState<{ text: string } | null>(null);
    const activeRef = useRef<HTMLDivElement>(null);

    const handleMouseUp = () => {
        const sel = window.getSelection();
        const text = sel?.toString().trim();

        if (text && text.length > 0) {
            // Ensure we are selecting within this component
            if (activeRef.current && sel?.anchorNode && activeRef.current.contains(sel.anchorNode)) {
                setSelection({ text });
                // If not expanded, expand it to show context
                if (!expanded) {
                    onToggleExpand();
                }
            }
        }
    };

    const handleExpandToggle = () => {
        // Only toggle if we are NOT selecting text
        if (!selection) {
            onToggleExpand();
        }
    };

    const handleCommentSubmit = (comment: string) => {
        if (selection) {
            onAddHighlight(selection.text, comment);
            setSelection(null);
            // Clear selection
            window.getSelection()?.removeAllRanges();
        }
    };

    // Helper to render text with highlights
    const renderTextWithHighlights = (originalText: string) => {
        if (highlights.length === 0) return originalText;

        let parts = [originalText];

        highlights.forEach(h => {
            const newParts: any[] = [];
            parts.forEach(part => {
                if (typeof part === 'string' && part.includes(h.text)) {
                    const split = part.split(h.text);
                    for (let i = 0; i < split.length; i++) {
                        newParts.push(split[i]);
                        if (i < split.length - 1) {
                            newParts.push(
                                <span key={`${h.text}-${i}`} className="bg-accent-yellow">
                                    {h.text}
                                </span>
                            );
                        }
                    }
                } else {
                    newParts.push(part);
                }
            });
            parts = newParts;
        });

        return <>{parts}</>;
    };

    return (
        <div
            ref={activeRef}
            className="flex flex-col gap-4"
        >
            {/* Script Line */}
            <div className="relative group">
                <div className="flex gap-4">
                    <span className={`
                        text-xs font-mono mt-2 shrink-0 w-6 transition-colors
                        ${isActive ? 'text-primary-700 font-bold' : 'text-secondary-500'}
                    `}>
                        {index + 1}
                    </span>
                    <p
                        onMouseUp={handleMouseUp}
                        onClick={() => {
                            handleExpandToggle();
                            // Also seek when clicking the line (if not selecting)
                            if (!selection) {
                                onSeek(sentence.startTime);
                            }
                        }}
                        className={`
                            text-lg leading-relaxed cursor-pointer transition-colors select-text
                            ${expanded || isActive ? "font-semibold text-neutral-900" : "font-medium text-secondary-500 hover:text-secondary-600"}
                        `}
                    >
                        {selection ? (
                            <>
                                {sentence.text.split(selection.text).map((part, i, arr) => (
                                    <span key={i}>
                                        {part}
                                        {i < arr.length - 1 && <span className="bg-accent-yellow">{selection.text}</span>}
                                    </span>
                                ))}
                            </>
                        ) : (
                            renderTextWithHighlights(sentence.text)
                        )}
                    </p>
                </div>

                {/* Comment Popover */}
                {selection && (
                    <CommentPopover
                        onSubmit={handleCommentSubmit}
                        onClose={() => setSelection(null)}
                    />
                )}
            </div>

            {/* Analysis Panel (Accordion) */}
            {expanded && (
                <div className="pl-10">
                    <AnalysisPanel highlights={highlights} />
                </div>
            )}
        </div>
    );
}
