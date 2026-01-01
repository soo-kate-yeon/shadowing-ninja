"use client";

import { useRouter } from "next/navigation";

interface ShadowingHeaderProps {
    title: string;
    onBack?: () => void;
    onPrevStep?: () => void;
    onNextStep?: () => void;
}

export function ShadowingHeader({ title, onBack, onPrevStep, onNextStep }: ShadowingHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.push('/home');
        }
    };

    return (
        <div className="h-16 bg-secondary-300 border-b border-secondary-500/30 flex items-center justify-between px-8 shrink-0 relative z-10 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-4 overflow-hidden">
                <button
                    onClick={handleBack}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-body-medium font-medium transition-colors shrink-0"
                >
                    학습 종료
                </button>
                <h1 className="text-xl font-semibold text-neutral-900 tracking-tight truncate max-w-2xl">
                    {title}
                </h1>
            </div>

            <div className="flex items-center bg-secondary-100 p-1 rounded-xl">
                <button
                    onClick={onPrevStep}
                    className="px-4 py-1.5 rounded-sm text-sm font-medium transition-all text-neutral-500 hover:text-neutral-900"
                >
                    리스닝 모드
                </button>
                <div className="px-4 py-1.5 rounded-sm text-sm font-bold bg-white text-primary-500 transition-all">
                    쉐도잉 모드
                </div>
            </div>
        </div>
    );
}
