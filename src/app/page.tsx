'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudyStore } from '@/store/useStudyStore';
import { extractVideoId } from '@/lib/transcript-parser';
import VideoCard from '@/components/VideoCard';
import SessionCard from '@/components/SessionCard';
import HighlightCard from '@/components/HighlightCard';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  const { sessions } = useStudyStore();
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateSession = async () => {
    setError('');
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      setError('유효한 YouTube URL을 입력해주세요');
      return;
    }

    setIsLoading(true);

    try {
      // Fetch transcript
      const response = await fetch(`/api/transcript?videoId=${videoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '자막을 가져올 수 없습니다');
      }

      // Navigate to study session
      router.push(`/study/${videoId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const inProgressSessions = sessions.filter(s => !s.isCompleted);
  const completedSessions = sessions.filter(s => s.isCompleted);

  // Mock data for video list
  const mockVideos = [
    {
      id: 1,
      title: '로제가 인터뷰를 한다',
      duration: '5:30',
      description: '이 인터뷰는 투나잇쇼에서 로제가 인터뷰를 한건데 캐주얼한 영어와 발음이 비교적 쉽습니다',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    },
    {
      id: 2,
      title: '로제가 인터뷰를 한다',
      duration: '5:30',
      description: '이 인터뷰는 투나잇쇼에서 로제가 인터뷰를 한건데 캐주얼한 영어와 발음이 비교적 쉽습니다',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    },
    {
      id: 3,
      title: '로제가 인터뷰를 한다',
      duration: '5:30',
      description: '이 인터뷰는 투나잇쇼에서 로제가 인터뷰를 한건데 캐주얼한 영어와 발음이 비교적 쉽습니다',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header - Height 64px */}
      <header className="h-[64px] bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-full flex items-center justify-between">
          <h1 className="text-panel font-bold text-gray-900">
            ShadowingNinja
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-body text-gray-600 hover:text-gray-900">
              로그아웃
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[calc(64px+32px)] px-8 pb-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Learning Videos (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-section text-gray-900">학습할 영상</h2>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['토크쇼', '영화', 'TV 시리즈', '인터뷰', '팟캐스트'].map((filter) => (
                <Button
                  key={filter}
                  variant={filter === '토크쇼' ? 'default' : 'secondary'}
                  size="sm"
                  className={`text-caption whitespace-nowrap h-8 px-3 ${filter === '토크쇼' ? 'bg-gray-800 hover:bg-gray-900' : 'bg-white hover:bg-gray-100 text-gray-600'}`}
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Video Grid - Vertical Stack */}
            <div className="space-y-4">
              {mockVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  duration={video.duration}
                  description={video.description}
                  thumbnailUrl={video.thumbnailUrl}
                  onClick={() => { }}
                />
              ))}
            </div>
          </div>

          {/* Middle Column: In Progress Sessions (5 columns) */}
          <div className="lg:col-span-5 space-y-6 bg-gray-50/50 rounded-3xl p-6">
            <div className="flex items-center gap-2">
              <h2 className="text-section text-gray-900">학습 중인 영상</h2>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <SessionCard
                  key={i}
                  title="ROSÉ Reminisces on Her BLACKPINK Audition, Shows Jimmy How to Play the APT. Drinking Game"
                  totalSentences={275}
                  progress={40}
                  timeLeft="23:00"
                  thumbnailUrl="https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
                  onClick={() => { }}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Highlights (4 columns) */}
          <div className="lg:col-span-4 space-y-6 bg-gray-50/50 rounded-3xl p-6">
            <h2 className="text-section text-gray-900">하이라이트</h2>

            {/* Featured Highlight */}
            <div className="bg-gray-200 rounded-xl p-4 flex gap-3">
              <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
                <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-item-emphasized text-gray-900 line-clamp-3 text-sm">
                  ROSÉ Reminisces on Her BLACKPINK Audition, Shows Jimmy How to Play the APT. Drinking Game
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <HighlightCard
                  key={i}
                  videoTitle="ROSÉ Reminisces on Her BLACKPINK Audition"
                  highlightedSentence="유저가 세션 중에 하이라이팅한 문장 유저가 세션 중에 하이라이팅한 문장"
                  userCaption="이건 왜 이 문장을 하이라이팅했는지에 대한 유저의 캡션"
                />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
