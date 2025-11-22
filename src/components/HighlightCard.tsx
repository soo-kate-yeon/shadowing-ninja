import React from 'react';
import { Card } from '@/components/ui/card';

interface HighlightCardProps {
    thumbnailUrl?: string;
    videoTitle: string;
    highlightedSentence: string;
    userCaption?: string;
    onClick?: () => void;
}

export default function HighlightCard({
    thumbnailUrl,
    videoTitle,
    highlightedSentence,
    userCaption,
    onClick,
}: HighlightCardProps) {
    return (
        <Card
            onClick={onClick}
            className="flex gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        >
            <div className="w-1 bg-[#fcdb4b] rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
                <p className="text-body-emphasized text-gray-900 line-clamp-3">
                    {highlightedSentence}
                </p>
                {userCaption && (
                    <p className="text-caption text-gray-500 border-l-2 border-gray-200 pl-3 line-clamp-2">
                        {userCaption}
                    </p>
                )}
            </div>
        </Card>
    );
}
