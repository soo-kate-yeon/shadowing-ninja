import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VideoCardProps {
    thumbnailUrl?: string;
    title: string;
    duration: string;
    description: string;
    onClick?: () => void;
}

export default function VideoCard({
    thumbnailUrl,
    title,
    duration,
    description,
    onClick,
}: VideoCardProps) {
    return (
        <Card
            onClick={onClick}
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm h-full flex flex-col"
        >
            <div className="aspect-video bg-gray-200 flex items-center justify-center relative overflow-hidden rounded-t-xl">
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-caption text-gray-400">Video Thumbnail</span>
                )}
                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white hover:bg-black/70 backdrop-blur-sm text-[10px] px-1.5 py-0.5 h-auto">
                    {duration}
                </Badge>
            </div>
            <CardContent className="p-3 flex flex-col gap-1 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-item-emphasized text-gray-900 line-clamp-2 leading-tight">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center gap-1 text-caption text-gray-500">
                    <span>275문장</span>
                    <span>·</span>
                    <span>5분</span>
                </div>
                <p className="text-body text-gray-600 line-clamp-2 mt-1 text-xs">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
