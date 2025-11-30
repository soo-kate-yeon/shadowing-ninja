"use client";

import { useState } from "react";
import { CornerDownLeft } from "lucide-react";

export interface Highlight {
    text: string;
    comment: string;
}

interface AnalysisPanelProps {
    highlights: Highlight[];
}

export function AnalysisPanel({ highlights }: AnalysisPanelProps) {
    const [analysisState, setAnalysisState] = useState<"initial" | "loading" | "done">("initial");

    const handleTagClick = () => {
        setAnalysisState("loading");
        // Simulate AI loading
        setTimeout(() => {
            setAnalysisState("done");
        }, 1500);
    };

    return (
        <div className="bg-secondary-200 rounded-2xl p-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-4 w-full">
                <h3 className="text-body-large font-medium text-neutral-900">이 문장이 왜 어려웠나요?</h3>

                {/* Tags */}
                <div className="flex gap-3 flex-wrap">
                    <button onClick={handleTagClick} className="px-3 py-2 rounded-lg bg-secondary-50 text-secondary-500 text-body-large hover:bg-white transition-colors border border-transparent hover:border-primary-500/20">
                        속도가 빨라요
                    </button>
                    <button onClick={handleTagClick} className="px-3 py-2 rounded-lg bg-secondary-50 text-secondary-500 text-body-large hover:bg-white transition-colors border border-transparent hover:border-primary-500/20">
                        모르는 단어가 많아요
                    </button>
                    <button onClick={handleTagClick} className={`px-3 py-2 rounded-lg text-body-large transition-colors border ${analysisState !== 'initial' ? 'bg-secondary-50 text-primary-500 border-primary-500' : 'bg-secondary-50 text-secondary-500 border-transparent hover:bg-white'}`}>
                        연음 때문에 알아듣기 힘들어요
                    </button>
                </div>

                {/* AI Analysis Area */}
                {analysisState === "loading" && (
                    <div className="w-full bg-secondary-500/15 rounded-lg py-4 flex items-center justify-center">
                        <p className="text-secondary-500 text-body-large animate-pulse">쉐도우가 힌트를 생성하고 있어요...</p>
                    </div>
                )}

                {analysisState === "done" && (
                    <div className="flex gap-3 items-start animate-in fade-in">
                        <div className="w-[3px] bg-primary-500 self-stretch rounded-full min-h-[24px] mt-1" />
                        <p className="text-secondary-500 text-body-large leading-relaxed">
                            이 문장은 사용자가 선택한 문장이 어려운 이유에 대해서 AI가 분석해주면서 다음에 잘하려면 어떻게 해야 하는지 팁을 줍니다. 사용자는 바로 이해할 수도 있고, 그게 아니라면 이 하이라이트 노트를 따로 저장해서 나중에 홈화면에서 모아볼 수 있습니다.
                        </p>
                    </div>
                )}

                {/* Separator */}
                <div className="h-px w-full bg-secondary-500/30 my-1" />

                {/* Highlights Section */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-body-large font-medium text-neutral-900">문장 하이라이트</h3>

                    {highlights.length === 0 ? (
                        <p className="text-secondary-500 text-body-large text-center py-2">
                            아직 하이라이트한 표현이 없어요
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {highlights.map((h, i) => (
                                <div key={i} className="flex flex-col gap-2 w-full">
                                    {/* Highlighted Text */}
                                    <div className="flex gap-2 items-center w-full">
                                        <div className="bg-accent-highlight h-full min-h-[20px] w-[3px] shrink-0 rounded-full" />
                                        <p className="text-body-large text-neutral-900 font-medium leading-relaxed break-words">
                                            {h.text}
                                        </p>
                                    </div>

                                    {/* Comment */}
                                    <div className="flex gap-2 items-start pl-3">
                                        <div className="shrink-0 mt-1">
                                            <CornerDownLeft className="w-[18px] h-[19px] text-secondary-500/50" />
                                        </div>
                                        <p className="text-body-large text-secondary-500 leading-relaxed">
                                            {h.comment}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
