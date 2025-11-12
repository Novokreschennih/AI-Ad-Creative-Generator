
import React from 'react';
import { AdCreative } from '../types';

const YandexSearchPreview: React.FC<{ creative: AdCreative }> = ({ creative }) => {
  return (
    <div className="bg-white text-black p-4 rounded-lg shadow-md font-sans">
        <div className="flex items-center mb-1">
            <span className="text-green-700 text-sm font-medium">https://yandex.ru/search/</span>
        </div>
        <div>
            <h3 className="text-xl text-blue-800 hover:underline cursor-pointer">
                {creative.headline1}{creative.headline2 && ` | ${creative.headline2}`}
            </h3>
            <p className="text-sm mt-1">{creative.adText}</p>
            <div className="mt-2 text-sm">
                <span className="text-green-700 font-medium">{creative.displayLink}</span>
            </div>
            
            {creative.sitelinks && creative.sitelinks.length > 0 && (
                <div className="mt-2 text-sm text-blue-800 flex flex-wrap gap-x-4">
                    {creative.sitelinks.map((link, index) => (
                        <span key={index} className="hover:underline cursor-pointer">{link.title}</span>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default YandexSearchPreview;
