import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SessionCardProps {
    thumbnailUrl?: string;
    title: string;
    totalSentences: number;
    progress: number; // Percentage 0-100
    timeLeft: string;
    onClick?: () => void;
}

export default function SessionCard({
    thumbnailUrl,
    title,
    totalSentences,
    progress,
    timeLeft,
    onClick,
}: SessionCardProps) {
    return (
        <Card className="overflow-hidden flex flex-row h-32">
            <div className="w-40 bg-gray-200 flex-shrink-0 relative">
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-caption">
                        Thumbnail
                    </div>
                )}
                <Badge className="absolute bottom-2 right-2 bg-black/80 text-white hover:bg-black/80">
                    {timeLeft}
                </Badge>
            </div>

            <CardContent className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-item-emphasized text-gray-900 line-clamp-2 mb-1">
                        {title}
                    </h3>
                    <p className="text-caption text-gray-500">
                        {totalSentences}문장 · {timeLeft}
                    </p>
                </div>

                <div className="w-full">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                        <div
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-caption text-gray-500">{progress}%</span>
                        <Button
                            onClick={onClick}
                            variant="secondary"
                            size="sm"
                            className="text-caption h-7"
                        >
                            계속 학습하기
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
