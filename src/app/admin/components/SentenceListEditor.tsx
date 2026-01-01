import { Sentence } from "@/types";
import { SentenceItem } from "./SentenceItem";

interface SentenceListEditorProps {
  sentences: Sentence[];
  loading: boolean;
  rawScript: string;
  onParseScript: () => void;
  onAutoTranslate: () => void;
  onAnalyzeScenes: () => void;
  analyzingScenes: boolean;
  onUpdateTime: (
    id: string,
    field: "startTime" | "endTime",
    value: number,
  ) => void;
  onUpdateText: (
    id: string,
    field: "text" | "translation",
    value: string,
  ) => void;
  onDelete: (index: number) => void;
  onSplit: (index: number, cursorPosition: number) => void;
  onMergeWithPrevious: (index: number) => void;
  onPlayFrom: (time: number) => void;
}

export function SentenceListEditor({
  sentences,
  loading,
  rawScript,
  onParseScript,
  onAutoTranslate,
  onAnalyzeScenes,
  analyzingScenes,
  onUpdateTime,
  onUpdateText,
  onDelete,
  onSplit,
  onMergeWithPrevious,
  onPlayFrom,
}: SentenceListEditorProps) {
  return (
    <div className="flex-1 bg-surface rounded-2xl border border-secondary-200 shadow-sm overflow-hidden flex flex-col relative">
      <div className="absolute top-0 left-0 bg-secondary-200 text-secondary-800 text-xs px-3 py-1 font-bold rounded-br-lg z-10 flex gap-2 items-center">
        Step 2: Parsed Sentences ({sentences.length})
        <button
          onClick={onParseScript}
          disabled={loading || !rawScript.trim()}
          className="bg-secondary-700 hover:bg-secondary-800 disabled:opacity-50 text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wide transition-colors"
          title="Parse raw script into sentences"
        >
          📝 Parse Script
        </button>
        <button
          onClick={onAutoTranslate}
          disabled={loading || sentences.length === 0}
          className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wide transition-colors"
        >
          Auto Translate
        </button>
        <button
          onClick={onAnalyzeScenes}
          disabled={analyzingScenes || sentences.length < 5}
          className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wide transition-colors"
          title="AI will analyze and recommend 3 key scenes for learning"
        >
          {analyzingScenes ? "⏳ Analyzing..." : "🎯 AI Scene Analysis"}
        </button>
        <div className="flex-1" />
      </div>
      <div className="flex-1 overflow-y-auto p-4 pt-10 space-y-3">
        {sentences.map((s, idx) => (
          <SentenceItem
            key={s.id}
            sentence={s}
            index={idx}
            onUpdateTime={onUpdateTime}
            onUpdateText={onUpdateText}
            onDelete={onDelete}
            onSplit={onSplit}
            onMergeWithPrevious={onMergeWithPrevious}
            onPlayFrom={onPlayFrom}
          />
        ))}
        {sentences.length === 0 && (
          <div className="text-center text-secondary-400 py-10 italic">
            Parsed sentences will appear here...
          </div>
        )}
      </div>
    </div>
  );
}
