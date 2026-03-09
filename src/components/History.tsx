import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import { Clock, ChevronRight, Trash2, Heart } from 'lucide-react';

interface HistoryProps {
  history: AnalysisResultType[];
  onSelect: (result: AnalysisResultType) => void;
  onClear: () => void;
  onBack: () => void;
}

export default function History({ history, onSelect, onClear, onBack }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <Clock size={48} className="text-olive-300 mb-4" />
        <h2 className="font-serif text-2xl font-semibold text-olive-900 mb-2">Lịch sử trống</h2>
        <p className="text-olive-600 text-center mb-6">
          Bạn chưa có kết quả phân tích nào. Hãy chụp ảnh lưỡi để bắt đầu.
        </p>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-olive-700 hover:bg-olive-800 text-white rounded-full font-medium transition-colors"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pb-20 bg-olive-50 min-h-screen">
      <div className="sticky top-0 z-10 bg-olive-50/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-olive-200/50">
        <button onClick={onBack} className="flex items-center text-olive-600 hover:text-olive-900 transition-colors">
          <ChevronRight className="rotate-180 mr-1" size={20} />
          <span className="font-medium">Quay lại</span>
        </button>
        <h2 className="font-serif text-lg font-semibold text-olive-900">Lịch sử sức khỏe</h2>
        <button onClick={onClear} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Xóa lịch sử">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-left bg-white rounded-2xl p-4 card-shadow border border-olive-100 hover:border-olive-300 transition-all flex items-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-olive-100 flex-shrink-0 border border-olive-200 relative">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="Lưỡi" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-olive-400">
                  <Clock size={24} />
                </div>
              )}
              {item.healthScore && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold text-center py-0.5 flex items-center justify-center gap-1">
                  <Heart size={10} className="text-emerald-400" />
                  {item.healthScore}
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-olive-500 uppercase tracking-wider">
                  {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                </span>
                <ChevronRight size={16} className="text-olive-300 group-hover:text-olive-600 transition-colors" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-olive-900 mb-1 line-clamp-1">
                {item.constitutionType}
              </h3>
              <p className="text-sm text-olive-600 line-clamp-1">
                {item.explanation}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
