'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SessionCard from '@/components/SessionCard';

export default function Home() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleStartSession = () => {
    if (!url) return;
    // Extract video ID and navigate (simplified logic for now)
    // In a real app, we'd probably validate and extract ID properly
    console.log('Starting session with URL:', url);
    // For now, just log or maybe navigate if we had the logic ready
    // router.push(`/session?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">ShadowingNinja</h1>
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 flex flex-col gap-12">
        {/* Input Section */}
        <section className="flex flex-col gap-4 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            새로운 쉐도잉 세션 시작하기
          </h2>
          <div className="flex gap-4 max-w-2xl w-full mx-auto">
            <input
              type="text"
              placeholder="YouTube URL을 입력하세요"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={handleStartSession}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              시작하기
            </button>
          </div>
        </section>

        {/* Recent Sessions Section */}
        <section className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
            최근 학습한 세션
          </h3>
          <div className="grid gap-4">
            {/* Placeholder data for recent sessions */}
            <SessionCard
              title="Steve Jobs' 2005 Stanford Commencement Address"
              thumbnailUrl="https://img.youtube.com/vi/UF8uR6Z6KLc/maxresdefault.jpg"
              progress={75}
              timeLeft="14:30"
              totalSentences={45}
            />
            <SessionCard
              title="The power of vulnerability | Brené Brown"
              thumbnailUrl="https://img.youtube.com/vi/iCvmsMzlF7o/maxresdefault.jpg"
              progress={30}
              timeLeft="20:19"
              totalSentences={62}
            />
            <SessionCard
              title="How great leaders inspire action | Simon Sinek"
              thumbnailUrl="https://img.youtube.com/vi/qp0HIF3SfI4/maxresdefault.jpg"
              progress={100}
              timeLeft="18:04"
              totalSentences={58}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
