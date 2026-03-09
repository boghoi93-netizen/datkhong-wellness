import React, { useState } from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import { Leaf, Coffee, Ban, Activity, ChevronRight, CheckCircle2, Heart, Bell, Calendar, FileText } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onBack: () => void;
  onExportReport: () => void;
}

export default function AnalysisResult({ result, onBack, onExportReport }: AnalysisResultProps) {
  const [activeDay, setActiveDay] = useState<keyof typeof result.mealPlan>('monday');

  const daysOfWeek = [
    { id: 'monday', label: 'T2' },
    { id: 'tuesday', label: 'T3' },
    { id: 'wednesday', label: 'T4' },
    { id: 'thursday', label: 'T5' },
    { id: 'friday', label: 'T6' },
    { id: 'saturday', label: 'T7' },
    { id: 'sunday', label: 'CN' },
  ];

  return (
    <div className="w-full max-w-md mx-auto pb-20 bg-olive-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-olive-50/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-olive-200/50">
        <button onClick={onBack} className="flex items-center text-olive-600 hover:text-olive-900 transition-colors">
          <ChevronRight className="rotate-180 mr-1" size={20} />
          <span className="font-medium">Quay lại</span>
        </button>
        <h2 className="font-serif text-lg font-semibold text-olive-900">Báo cáo sức khỏe</h2>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <div className="p-4 space-y-6">
        <div className="mb-2">
          <button 
            onClick={onExportReport}
            className="w-full py-4 bg-olive-800 hover:bg-olive-900 text-white rounded-2xl font-medium text-lg transition-all shadow-lg shadow-olive-900/20 flex items-center justify-center gap-3"
          >
            <FileText size={24} />
            Xem & Xuất Báo Cáo PDF
          </button>
        </div>
        {/* Module 3: Phân tích thể trạng */}
        <section className="bg-white rounded-3xl p-6 card-shadow border border-olive-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-olive-900">Thể trạng chính</h3>
          </div>
          
          <div className="mb-6">
            <div className="inline-block px-4 py-1.5 bg-accent/20 text-olive-900 rounded-full font-medium text-lg mb-3">
              {result.constitutionType}
            </div>
            <p className="text-olive-700 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          <div className="bg-olive-50 rounded-2xl p-4 mb-6">
            <h4 className="font-medium text-olive-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <Heart size={16} className="text-emerald-600" />
              Chỉ số sức khỏe
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-olive-600 font-medium">Tỳ vị (Hệ tiêu hóa)</span>
                  <span className="text-olive-900 font-semibold">{result.indices.digestion}%</span>
                </div>
                <div className="w-full h-2 bg-olive-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.indices.digestion}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-olive-600 font-medium">Khí huyết (Năng lượng)</span>
                  <span className="text-olive-900 font-semibold">{result.indices.vitality}%</span>
                </div>
                <div className="w-full h-2 bg-olive-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${result.indices.vitality}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-olive-600 font-medium">Độ thấp (Mức độ ẩm)</span>
                  <span className="text-olive-900 font-semibold">{result.indices.dampness}%</span>
                </div>
                <div className="w-full h-2 bg-olive-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${result.indices.dampness}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-olive-100 rounded-2xl p-4">
            <h4 className="font-medium text-olive-900 mb-3 text-sm uppercase tracking-wider">Đặc điểm lưỡi</h4>
            <ul className="space-y-2 text-sm text-olive-700">
              <li className="flex justify-between border-b border-olive-100 pb-2">
                <span className="text-olive-500">Màu sắc</span>
                <span className="font-medium text-right">{result.tongueFeatures.color}</span>
              </li>
              <li className="flex justify-between border-b border-olive-100 pb-2">
                <span className="text-olive-500">Rêu lưỡi</span>
                <span className="font-medium text-right">{result.tongueFeatures.coating}</span>
              </li>
              <li className="flex justify-between border-b border-olive-100 pb-2">
                <span className="text-olive-500">Độ ẩm</span>
                <span className="font-medium text-right">{result.tongueFeatures.moisture}</span>
              </li>
              <li className="flex justify-between border-b border-olive-100 pb-2">
                <span className="text-olive-500">Vết nứt</span>
                <span className="font-medium text-right">{result.tongueFeatures.cracks}</span>
              </li>
              <li className="flex justify-between border-b border-olive-100 pb-2">
                <span className="text-olive-500">Dấu hằn răng</span>
                <span className="font-medium text-right">{result.tongueFeatures.teethMarks}</span>
              </li>
              <li className="flex justify-between pt-1">
                <span className="text-olive-500">Độ sưng</span>
                <span className="font-medium text-right">{result.tongueFeatures.swelling}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Module 5: Gợi ý thực đơn 7 ngày */}
        <section className="bg-white rounded-3xl p-6 card-shadow border border-olive-100">
          <div className="flex items-center gap-3 mb-6 border-b border-olive-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Calendar size={24} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-olive-900">Thực đơn 7 ngày</h3>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {daysOfWeek.map((day) => (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id as keyof typeof result.mealPlan)}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all ${
                  activeDay === day.id 
                    ? 'bg-olive-800 text-white shadow-md' 
                    : 'bg-olive-50 text-olive-600 hover:bg-olive-100'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-olive-50 rounded-2xl p-4 border border-olive-100">
              <div className="text-xs font-semibold text-olive-500 uppercase tracking-wider mb-2">Bữa sáng</div>
              <p className="text-olive-800 font-medium">{result.mealPlan[activeDay].breakfast}</p>
            </div>
            <div className="bg-olive-50 rounded-2xl p-4 border border-olive-100">
              <div className="text-xs font-semibold text-olive-500 uppercase tracking-wider mb-2">Bữa trưa</div>
              <p className="text-olive-800 font-medium">{result.mealPlan[activeDay].lunch}</p>
            </div>
            <div className="bg-olive-50 rounded-2xl p-4 border border-olive-100">
              <div className="text-xs font-semibold text-olive-500 uppercase tracking-wider mb-2">Bữa tối</div>
              <p className="text-olive-800 font-medium">{result.mealPlan[activeDay].dinner}</p>
            </div>
          </div>
        </section>

        {/* Module 6: Bài tập */}
        <section className="bg-white rounded-3xl p-6 card-shadow border border-olive-100">
          <div className="flex items-center gap-3 mb-6 border-b border-olive-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Activity size={24} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-olive-900">Bài tập gợi ý</h3>
          </div>

          <div className="space-y-4">
            {result.exerciseSuggestions.map((exercise, idx) => (
              <div key={idx} className="border border-olive-100 rounded-2xl p-4 hover:bg-olive-50 transition-colors">
                <h4 className="font-medium text-lg text-olive-900 mb-1">{exercise.name}</h4>
                <div className="flex items-center gap-2 text-sm text-olive-500 mb-2">
                  <span className="inline-block px-2 py-0.5 bg-white rounded-md border border-olive-200">
                    {exercise.duration}
                  </span>
                </div>
                <p className="text-olive-700 text-sm leading-relaxed">
                  <span className="font-medium text-olive-800">Tác dụng:</span> {exercise.benefit}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Module 8: Nhắc nhở */}
        <section className="bg-white rounded-3xl p-6 card-shadow border border-olive-100">
          <div className="flex items-center gap-3 mb-6 border-b border-olive-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Bell size={24} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-olive-900">Nhắc nhở hàng ngày</h3>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-olive-200 before:to-transparent">
            {result.reminders.map((reminder, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-olive-100 text-olive-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="text-xs font-bold">{reminder.time}</span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-olive-50 p-4 rounded-2xl border border-olive-100 shadow-sm">
                  <p className="text-olive-800 font-medium">{reminder.task}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

