import React from 'react';
import { AnalysisResult } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Heart, Leaf, ChevronRight, PlusCircle, Calendar } from 'lucide-react';

interface DashboardProps {
  history: AnalysisResult[];
  onNewAnalysis: () => void;
  onViewHistory: () => void;
  onViewDetails: (result: AnalysisResult) => void;
}

export default function Dashboard({ history, onNewAnalysis, onViewHistory, onViewDetails }: DashboardProps) {
  const latestResult = history[0];

  // Prepare chart data (last 7 days by default, or just the history points)
  const chartData = [...history]
    .reverse()
    .slice(-7) // Show up to 7 recent points
    .map(item => ({
      date: new Date(item.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      score: item.healthScore
    }));

  return (
    <div className="w-full max-w-md mx-auto pb-24 bg-olive-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-olive-50/90 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-olive-200/50">
        <h2 className="font-serif text-2xl font-bold text-olive-900">Sức khỏe của bạn</h2>
        <button onClick={onNewAnalysis} className="p-2 text-olive-700 hover:text-olive-900 bg-white rounded-full shadow-sm border border-olive-100 transition-colors">
          <PlusCircle size={24} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Health Score Card */}
        <section className="bg-white rounded-3xl p-6 card-shadow border border-olive-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -mr-8 -mt-8"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Heart size={24} />
            </div>
            <h3 className="font-serif text-xl font-semibold text-olive-900">Điểm sức khỏe</h3>
          </div>

          <div className="flex items-end gap-4 mb-4">
            <span className="text-6xl font-light text-olive-900 tracking-tighter">
              {latestResult?.healthScore || '--'}
            </span>
            <span className="text-xl text-olive-400 font-medium mb-2">/ 100</span>
          </div>

          <div className="w-full h-3 bg-olive-100 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${latestResult?.healthScore || 0}%` }}
            ></div>
          </div>

          <p className="text-sm text-olive-600">
            {latestResult?.healthScore >= 80 ? 'Sức khỏe rất tốt. Hãy tiếp tục duy trì!' :
             latestResult?.healthScore >= 60 ? 'Sức khỏe ổn định. Cần chú ý cải thiện thêm.' :
             'Sức khỏe cần được quan tâm chăm sóc nhiều hơn.'}
          </p>
        </section>

        {/* Current Constitution */}
        <section className="bg-white rounded-3xl p-6 card-shadow border border-olive-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Leaf size={24} />
              </div>
              <h3 className="font-serif text-xl font-semibold text-olive-900">Thể trạng chính</h3>
            </div>
            <button 
              onClick={() => onViewDetails(latestResult)}
              className="text-sm font-medium text-olive-600 hover:text-olive-900 flex items-center"
            >
              Chi tiết <ChevronRight size={16} />
            </button>
          </div>

          <div className="mb-4">
            <div className="inline-block px-4 py-1.5 bg-accent/20 text-olive-900 rounded-full font-medium text-lg mb-3">
              {latestResult?.constitutionType || 'Chưa có dữ liệu'}
            </div>
            <p className="text-olive-700 text-sm leading-relaxed line-clamp-2">
              {latestResult?.explanation || 'Hãy chụp ảnh lưỡi và trả lời câu hỏi để AI phân tích thể trạng của bạn.'}
            </p>
          </div>

          {latestResult?.indices && (
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-olive-100">
              <div className="text-center">
                <div className="text-[10px] text-olive-500 mb-1 uppercase tracking-wider">Tỳ vị</div>
                <div className="font-medium text-olive-900">{latestResult.indices.digestion}%</div>
              </div>
              <div className="text-center border-x border-olive-100">
                <div className="text-[10px] text-olive-500 mb-1 uppercase tracking-wider">Khí huyết</div>
                <div className="font-medium text-olive-900">{latestResult.indices.vitality}%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-olive-500 mb-1 uppercase tracking-wider">Độ thấp</div>
                <div className="font-medium text-olive-900">{latestResult.indices.dampness}%</div>
              </div>
            </div>
          )}
        </section>

        {/* Trend Chart */}
        {history.length > 1 && (
          <section className="bg-white rounded-3xl p-6 card-shadow border border-olive-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Activity size={24} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-olive-900">Xu hướng</h3>
              </div>
              <button onClick={onViewHistory} className="text-sm font-medium text-olive-600 hover:text-olive-900">
                Lịch sử
              </button>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAE0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9A9A7A' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9A9A7A' }} 
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: '#5A5A40', fontWeight: 600, marginBottom: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#D4A373" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#D4A373', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#D4A373', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onViewDetails(latestResult)}
            className="bg-white p-4 rounded-2xl card-shadow border border-olive-100 flex flex-col items-center justify-center gap-2 hover:bg-olive-50 transition-colors"
          >
            <Calendar size={24} className="text-olive-600" />
            <span className="font-medium text-olive-800 text-sm">Thực đơn 7 ngày</span>
          </button>
          <button 
            onClick={() => onViewDetails(latestResult)}
            className="bg-white p-4 rounded-2xl card-shadow border border-olive-100 flex flex-col items-center justify-center gap-2 hover:bg-olive-50 transition-colors"
          >
            <Activity size={24} className="text-olive-600" />
            <span className="font-medium text-olive-800 text-sm">Bài tập gợi ý</span>
          </button>
        </section>
      </div>
    </div>
  );
}
