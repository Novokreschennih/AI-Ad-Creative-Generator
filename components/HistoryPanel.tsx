import React from 'react';
import { HistoryEntry } from '../types';

interface HistoryPanelProps {
    history: HistoryEntry[];
    onLoad: (entry: HistoryEntry) => void;
    onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onClear }) => {
    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-white">История генераций</h3>
                    <p className="text-sm text-gray-400">Сохраненные результаты</p>
                </div>
                {history.length > 0 && (
                    <button onClick={onClear} className="text-xs text-red-400 hover:text-red-300">Очистить</button>
                )}
            </div>
            <div className="flex-grow p-4 overflow-y-auto max-h-96">
                {history.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">История пока пуста. Сгенерируйте креативы, и они появятся здесь.</p>
                ) : (
                    <ul className="space-y-3">
                        {history.map((entry, index) => (
                            <li key={entry.timestamp}>
                                <button
                                    onClick={() => onLoad(entry)}
                                    className="w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    <p className="text-sm font-semibold text-white truncate">{entry.formData.productDescription}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(entry.timestamp).toLocaleString()} - {entry.creatives.length} вариант(а)
                                    </p>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
