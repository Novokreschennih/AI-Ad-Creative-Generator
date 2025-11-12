
import React from 'react';
import { AdCreative } from '../types';

const YandexDisplayPreview: React.FC<{ creative: AdCreative }> = ({ creative }) => {
    const imageUrl = creative.imageUrl ? `data:image/jpeg;base64,${creative.imageUrl}` : 'https://picsum.photos/1200/675';
    
    return (
        <div className="bg-white text-black rounded-lg shadow-md overflow-hidden font-sans max-w-sm">
            <div className="relative">
                <img src={imageUrl} alt="Ad creative" className="w-full h-auto aspect-video object-cover"/>
                <span className="absolute top-2 right-2 bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded">Реклама</span>
            </div>
            <div className="p-4">
                <span className="text-green-700 text-xs font-medium">{creative.displayLink}</span>
                <h3 className="text-lg font-bold text-blue-800 hover:underline cursor-pointer mt-1">
                    {creative.headline1}
                </h3>
                <p className="text-sm mt-1">{creative.adText}</p>
            </div>
        </div>
    );
};

export default YandexDisplayPreview;
