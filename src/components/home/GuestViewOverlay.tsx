"use client";

import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

export default function GuestViewOverlay() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      {/* Dimming Layer */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none" />

      {/* CTA Card */}
      <div className="relative z-30 bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-white/50 flex flex-col items-center gap-6 max-w-sm text-center transform transition-transform hover:scale-[1.02] duration-300">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-neutral-900">
            학습을 시작해볼까요?
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            이 영상들로 학습하고 싶으면
            <br />
            회원가입 하고 모든 기능을 이용해보세요.
          </p>
        </div>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full bg-primary-600 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95"
        >
          회원가입 및 로그인
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="signup"
      />
    </div>
  );
}
