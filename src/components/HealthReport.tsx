import React from 'react';
import { AnalysisResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Leaf, Activity, Heart, Droplets, Wind, Sun, Moon, Coffee, Apple, 
  Shield, ChevronLeft, Printer, CheckCircle2, Calendar, AlertCircle, 
  Utensils, User, Flame, Zap, Battery, BatteryWarning, BatteryCharging
} from 'lucide-react';

interface HealthReportProps {
  result: AnalysisResult;
  onBack: () => void;
}

export default function HealthReport({ result, onBack }: HealthReportProps) {
  const handlePrint = () => {
    window.print();
  };

  const radarData = [
    { subject: 'Tỳ vị (Hệ tiêu hóa)', A: result.indices.digestion, fullMark: 100 },
    { subject: 'Khí huyết (Năng lượng & tuần hoàn)', A: result.indices.vitality, fullMark: 100 },
    { subject: 'Âm dương (Cân bằng nhiệt cơ thể)', A: Math.round((result.indices.vitality + result.indices.digestion) / 2), fullMark: 100 },
    { subject: 'Tiêu hóa (Khả năng hấp thu dinh dưỡng)', A: Math.min(100, result.indices.digestion + 10), fullMark: 100 },
    { subject: 'Độ thấp (Mức độ ẩm tích tụ trong cơ thể)', A: 100 - result.indices.dampness, fullMark: 100 },
  ];

  const getEval = (actual: number, min: number, max: number, inverse = false) => {
    if (inverse) {
      if (actual > max) return { text: 'Dư thừa', color: 'text-red-600', bg: 'bg-red-100' };
      if (actual < min) return { text: 'Thiếu hụt', color: 'text-amber-600', bg: 'bg-amber-100' };
      return { text: 'Cân bằng', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    }
    if (actual < min) return { text: 'Thiếu hụt', color: 'text-red-600', bg: 'bg-red-100' };
    if (actual > max) return { text: 'Dư thừa', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { text: 'Cân bằng', color: 'text-emerald-600', bg: 'bg-emerald-100' };
  };

  const getQuickEval = (score: number) => {
    if (score >= 80) return 'Tốt';
    if (score >= 60) return 'Khá';
    if (score >= 40) return 'Trung bình';
    return 'Yếu';
  };

  const getDampnessEval = (score: number) => {
    if (score >= 80) return 'Thấp';
    if (score >= 60) return 'Trung bình';
    return 'Cao';
  };

  const tyViEval = getEval(result.indices.digestion, 70, 85);
  const khiHuyetEval = getEval(result.indices.vitality, 75, 90);
  const doThapEval = getEval(result.indices.dampness, 10, 30, true);

  return (
    <div className="min-h-screen bg-gray-100 py-8 font-sans text-olive-900">
      <div className="fixed top-4 left-4 flex gap-2 no-print z-50">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white text-olive-800 rounded-full shadow-md hover:bg-olive-50">
          <ChevronLeft size={20} /> Quay lại
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-olive-700 text-white rounded-full shadow-md hover:bg-olive-800">
          <Printer size={20} /> In PDF
        </button>
      </div>

      {/* Trang 1: Cover */}
      <div className="print-page flex flex-col items-center justify-center bg-olive-50 border-[12px] border-olive-200 p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#5A5A40 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl mb-12 border-8 border-olive-100 z-10 relative">
          <div className="absolute inset-0 border-2 border-dashed border-olive-300 rounded-full m-2 animate-[spin_60s_linear_infinite]"></div>
          <Leaf size={80} className="text-olive-600" />
        </div>
        <h1 className="text-6xl font-serif font-bold mb-6 text-center leading-tight text-olive-900 z-10 uppercase tracking-wide">
          Báo Cáo Sức Khỏe<br/>Đông Y
        </h1>
        <div className="w-32 h-1 bg-accent my-8 z-10"></div>
        
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg z-10 w-full max-w-lg text-center border border-olive-100">
          <h2 className="text-2xl mb-4 font-medium text-olive-800">Khách hàng: <span className="font-bold text-olive-900">{result.userInfo?.name || 'Bạn'}</span></h2>
          <h3 className="text-xl text-olive-600 mb-6">Ngày phân tích: <span className="font-medium">{new Date(result.timestamp).toLocaleDateString('vi-VN')}</span></h3>
          <div className="inline-block px-6 py-2 bg-olive-100 text-olive-800 rounded-full font-bold text-xl">
            {result.constitutionType}
          </div>
        </div>
        
        <div className="absolute bottom-12 text-center z-10">
          <p className="text-xl font-serif font-bold text-olive-800 tracking-widest uppercase">Đạt Không Wellness AI</p>
          <p className="text-md text-olive-600 mt-2 italic">Trợ lý sức khỏe Đông y cá nhân hóa</p>
        </div>
      </div>

      {/* Trang 2: Overview */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b-2 border-olive-100 pb-4 shrink-0">
          <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center text-olive-700">
            <Activity size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-olive-900">Tổng quan sức khỏe</h2>
        </div>
        
        <div className="flex gap-6 mb-8 shrink-0">
          <div className="flex-1 bg-emerald-50 p-6 rounded-3xl border border-emerald-100 relative overflow-hidden">
            <Heart size={80} className="absolute -right-4 -top-4 text-emerald-100 opacity-50" />
            <h3 className="text-xl font-serif font-semibold mb-2 text-emerald-900 relative z-10">Điểm sức khỏe</h3>
            <div className="text-6xl font-bold text-emerald-600 mb-2 relative z-10">{result.healthScore}<span className="text-2xl text-emerald-400 font-medium">/100</span></div>
            <p className="text-emerald-800 text-sm relative z-10">Đánh giá tổng hợp dựa trên phân tích thiệt chẩn và triệu chứng.</p>
          </div>
          <div className="flex-1 bg-amber-50 p-6 rounded-3xl border border-amber-100 relative overflow-hidden">
            <Leaf size={80} className="absolute -right-4 -top-4 text-amber-100 opacity-50" />
            <h3 className="text-xl font-serif font-semibold mb-2 text-amber-900 relative z-10">Thể trạng chính</h3>
            <div className="text-2xl font-bold text-amber-700 mb-2 relative z-10 leading-tight">{result.constitutionType}</div>
            <p className="text-amber-800 text-sm relative z-10 line-clamp-3">{result.explanation}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <h3 className="text-2xl font-serif font-bold text-olive-900 mb-2 text-center">Biểu đồ Radar Sức khỏe</h3>
          
          <div className="flex-1 flex items-center justify-center min-h-[250px] -mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={5} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} />
                <Tooltip />
                <Radar name="Điểm số" dataKey="A" stroke="#f97316" strokeWidth={2} fill="#fdba74" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2 text-center shrink-0">
            <div className="flex justify-center gap-4 text-xs font-bold mb-2">
              <span className="text-emerald-600">80-100: Tốt</span>
              <span className="text-blue-600">60-79: Khá</span>
              <span className="text-amber-600">40-59: Trung bình</span>
              <span className="text-red-600">0-39: Yếu</span>
            </div>
            <p className="text-xs text-olive-600 italic mb-2">
              * Lưu ý: Với chỉ số Độ thấp, điểm càng cao nghĩa là cơ thể càng ít tích tụ ẩm thấp.
            </p>
            <p className="text-xs text-olive-700 leading-relaxed max-w-2xl mx-auto">
              Biểu đồ Radar thể hiện mức độ cân bằng của các yếu tố sức khỏe theo nguyên lý Đông y. 
              Điểm càng cao cho thấy chức năng đó hoạt động tốt hơn. 
              Nếu một trục bị thấp hơn các trục khác, đó là khu vực cơ thể cần được cải thiện.
            </p>
          </div>

          <div className="mt-4 bg-white p-4 rounded-2xl border border-olive-100 shadow-sm shrink-0">
            <h4 className="font-bold text-olive-900 mb-2 text-center text-sm">Đánh giá nhanh:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div className="flex justify-between border-b border-olive-50 pb-1">
                <span className="text-olive-700">Tỳ vị (Hệ tiêu hóa):</span>
                <span className="font-bold text-olive-900">{getQuickEval(result.indices.digestion)}</span>
              </div>
              <div className="flex justify-between border-b border-olive-50 pb-1">
                <span className="text-olive-700">Khí huyết (Năng lượng & tuần hoàn):</span>
                <span className="font-bold text-olive-900">{getQuickEval(result.indices.vitality)}</span>
              </div>
              <div className="flex justify-between border-b border-olive-50 pb-1">
                <span className="text-olive-700">Âm dương (Cân bằng nhiệt cơ thể):</span>
                <span className="font-bold text-olive-900">{getQuickEval(Math.round((result.indices.vitality + result.indices.digestion) / 2))}</span>
              </div>
              <div className="flex justify-between border-b border-olive-50 pb-1">
                <span className="text-olive-700">Tiêu hóa (Khả năng hấp thu):</span>
                <span className="font-bold text-olive-900">{getQuickEval(Math.min(100, result.indices.digestion + 10))}</span>
              </div>
              <div className="flex justify-between border-b border-olive-50 pb-1 md:col-span-2">
                <span className="text-olive-700">Độ thấp (Mức độ ẩm tích tụ):</span>
                <span className="font-bold text-olive-900">{getDampnessEval(100 - result.indices.dampness)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trang 3: Tongue Analysis */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b-2 border-olive-100 pb-4 shrink-0">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
            <Droplets size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-olive-900">Phân tích Thiệt chẩn</h2>
        </div>
        
        <p className="text-xl text-olive-700 mb-8 leading-relaxed font-serif italic text-center px-8 shrink-0">
          "Lưỡi là tấm gương phản chiếu tình trạng lục phủ ngũ tạng. Quan sát hình thái và màu sắc lưỡi giúp chẩn đoán chính xác sự thịnh suy của khí huyết."
        </p>

        <div className="flex gap-8 items-center mb-8 shrink-0">
          <div className="w-1/3 flex flex-col items-center">
            <div className="w-56 h-56 bg-red-50 rounded-full flex items-center justify-center border-[8px] border-red-100 relative shadow-xl mb-4 overflow-hidden">
              <img src={result.imageUrl} alt="Lưỡi" className="w-full h-full object-cover z-10" referrerPolicy="no-referrer" />
            </div>
            <div className="bg-white px-4 py-1 rounded-full shadow-md border border-olive-100 text-olive-800 font-bold text-sm">
              Ảnh chụp thực tế
            </div>
          </div>
          
          <div className="w-2/3 grid grid-cols-2 gap-4">
            <div className="bg-olive-50 p-4 rounded-2xl border border-olive-100">
              <span className="block text-xs text-olive-500 uppercase font-bold tracking-wider mb-1">Màu sắc</span>
              <span className="text-lg text-olive-900 font-medium">{result.tongueFeatures.color}</span>
            </div>
            <div className="bg-olive-50 p-4 rounded-2xl border border-olive-100">
              <span className="block text-xs text-olive-500 uppercase font-bold tracking-wider mb-1">Rêu lưỡi</span>
              <span className="text-lg text-olive-900 font-medium">{result.tongueFeatures.coating}</span>
            </div>
            <div className="bg-olive-50 p-4 rounded-2xl border border-olive-100">
              <span className="block text-xs text-olive-500 uppercase font-bold tracking-wider mb-1">Độ ẩm</span>
              <span className="text-lg text-olive-900 font-medium">{result.tongueFeatures.moisture}</span>
            </div>
            <div className="bg-olive-50 p-4 rounded-2xl border border-olive-100">
              <span className="block text-xs text-olive-500 uppercase font-bold tracking-wider mb-1">Độ dày rêu</span>
              <span className="text-lg text-olive-900 font-medium">{result.tongueFeatures.coatingThickness}</span>
            </div>
            <div className="bg-olive-50 p-4 rounded-2xl border border-olive-100 col-span-2">
              <span className="block text-xs text-olive-500 uppercase font-bold tracking-wider mb-1">Dấu hiệu khác</span>
              <span className="text-lg text-olive-900 font-medium">{result.tongueFeatures.cracks}. {result.tongueFeatures.teethMarks}. {result.tongueFeatures.swelling}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
            <Wind size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Ý nghĩa lâm sàng</h3>
            <p className="text-blue-800 text-base leading-relaxed">
              Sự kết hợp giữa <strong>{result.tongueFeatures.color}</strong> và <strong>{result.tongueFeatures.coating}</strong> 
              thường chỉ ra tình trạng mất cân bằng ở hệ tiêu hóa (Tỳ Vị). 
              Đặc biệt, <strong>{result.tongueFeatures.teethMarks}</strong> là dấu hiệu điển hình của Tỳ khí hư, 
              khiến cơ thể không vận hóa được thủy thấp, dẫn đến lưỡi bệu và in dấu răng.
            </p>
          </div>
        </div>
      </div>

      {/* Trang 4: Constitution & Organs */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b-2 border-olive-100 pb-4 shrink-0">
          <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center text-olive-700">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-olive-900">Chi tiết Thể trạng & Tạng Phủ</h2>
        </div>
        
        <div className="text-center mb-8 bg-olive-50 p-6 rounded-3xl border border-olive-100 shrink-0">
          <h3 className="text-sm text-olive-500 uppercase tracking-widest font-bold mb-2">Kết luận chẩn đoán</h3>
          <div className="inline-block px-8 py-3 bg-white text-olive-900 rounded-full font-serif font-bold text-3xl mb-4 shadow-sm border border-olive-200">
            {result.constitutionType}
          </div>
          <p className="text-lg text-olive-800 max-w-2xl mx-auto leading-relaxed">
            {result.explanation}
          </p>
        </div>

        <h3 className="text-xl font-serif font-bold text-olive-900 mb-4 shrink-0">Chỉ số Tạng Phủ Chi Tiết</h3>
        <div className="flex-1 flex flex-col gap-4">
          {/* Tỳ Vị */}
          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-100 flex items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
              <Heart size={32} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-emerald-900 mb-1">Tỳ Vị (Tiêu hóa)</h4>
              <p className="text-sm text-emerald-700 mb-2">Khả năng hấp thụ và chuyển hóa dinh dưỡng.</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-gray-100 px-3 py-1 rounded-md">Thực tế: <strong>{result.indices.digestion}</strong></span>
                <span className="bg-gray-100 px-3 py-1 rounded-md">Chuẩn: <strong>70-85</strong></span>
                <span className={`px-3 py-1 rounded-md font-bold ${tyViEval.bg} ${tyViEval.color}`}>{tyViEval.text}</span>
              </div>
            </div>
          </div>

          {/* Khí Huyết */}
          <div className="bg-white p-5 rounded-2xl border-2 border-red-100 flex items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 shrink-0">
              <Activity size={32} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-red-900 mb-1">Khí Huyết</h4>
              <p className="text-sm text-red-700 mb-2">Năng lượng sống và sự tuần hoàn máu.</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-gray-100 px-3 py-1 rounded-md">Thực tế: <strong>{result.indices.vitality}</strong></span>
                <span className="bg-gray-100 px-3 py-1 rounded-md">Chuẩn: <strong>75-90</strong></span>
                <span className={`px-3 py-1 rounded-md font-bold ${khiHuyetEval.bg} ${khiHuyetEval.color}`}>{khiHuyetEval.text}</span>
              </div>
            </div>
          </div>

          {/* Độ Thấp */}
          <div className="bg-white p-5 rounded-2xl border-2 border-blue-100 flex items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
              <Droplets size={32} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-blue-900 mb-1">Độ Thấp (Ẩm)</h4>
              <p className="text-sm text-blue-700 mb-2">Sự tích tụ chất lỏng dư thừa gây nặng nề.</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-gray-100 px-3 py-1 rounded-md">Thực tế: <strong>{result.indices.dampness}</strong></span>
                <span className="bg-gray-100 px-3 py-1 rounded-md">Chuẩn: <strong>10-30</strong></span>
                <span className={`px-3 py-1 rounded-md font-bold ${doThapEval.bg} ${doThapEval.color}`}>{doThapEval.text}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trang 5: Causes & Lifestyle */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b-2 border-olive-100 pb-4 shrink-0">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-olive-900">Nguyên nhân & Lối sống</h2>
        </div>

        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mb-8 shrink-0">
          <h3 className="text-xl font-bold text-amber-900 mb-3">Tại sao bạn có thể trạng này?</h3>
          <p className="text-amber-800 text-base leading-relaxed">
            Thể trạng <strong>{result.constitutionType}</strong> thường không xuất hiện đột ngột mà là kết quả của thói quen sinh hoạt và ăn uống kéo dài. Việc hiểu rõ nguyên nhân giúp bạn điều chỉnh lối sống hiệu quả hơn.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-olive-100 flex gap-6 items-center shadow-sm">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
              <Utensils size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-olive-900 mb-2">Thói quen ăn uống</h4>
              <ul className="space-y-2 text-olive-700">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Thường xuyên ăn đồ lạnh, nước đá.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Ăn uống không đúng giờ giấc.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Tiêu thụ nhiều đồ ngọt, dầu mỡ.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-olive-100 flex gap-6 items-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
              <Moon size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-olive-900 mb-2">Sinh hoạt & Nghỉ ngơi</h4>
              <ul className="space-y-2 text-olive-700">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Thức khuya, thiếu ngủ trầm trọng.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Làm việc quá sức, căng thẳng kéo dài.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Ít vận động, ngồi một chỗ nhiều.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-olive-100 flex gap-6 items-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
              <Wind size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-olive-900 mb-2">Yếu tố môi trường</h4>
              <ul className="space-y-2 text-olive-700">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Sống hoặc làm việc trong môi trường ẩm thấp.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Ngồi máy lạnh nhiệt độ thấp thường xuyên.</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Dầm mưa hoặc không giữ ấm cơ thể.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trang 6: Food Suggestions */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b-2 border-olive-100 pb-4 shrink-0">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <Leaf size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-olive-900">Gợi ý Dinh dưỡng</h2>
        </div>
        
        <p className="text-lg text-olive-700 mb-6 leading-relaxed font-serif italic text-center px-8 shrink-0">
          "Dược thực đồng nguyên" - Thức ăn cũng chính là thuốc. Chế độ ăn uống đóng vai trò quan trọng nhất trong việc cải thiện thể trạng.
        </p>

        <div className="grid grid-cols-2 gap-6 mb-8 shrink-0">
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <h3 className="text-xl font-serif font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-600"/> Nên ăn
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-emerald-900">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div> Gạo lứt, yến mạch, khoai lang
              </li>
              <li className="flex items-start gap-2 text-sm text-emerald-900">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div> Thịt gà, cá trắng, trứng
              </li>
              <li className="flex items-start gap-2 text-sm text-emerald-900">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div> Gừng, hành, tỏi (gia vị ấm)
              </li>
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
            <h3 className="text-xl font-serif font-bold text-red-900 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-red-600"/> Cần tránh
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-red-900">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div> Nước đá, kem, đồ uống lạnh
              </li>
              <li className="flex items-start gap-2 text-sm text-red-900">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div> Đồ chiên rán, nhiều dầu mỡ
              </li>
              <li className="flex items-start gap-2 text-sm text-red-900">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div> Bánh kẹo ngọt, đường tinh luyện
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 bg-amber-50 p-6 rounded-3xl border border-amber-100 flex flex-col">
          <h3 className="text-xl font-serif font-bold text-amber-900 mb-6 flex items-center gap-2 shrink-0">
            <Coffee size={24} /> Trà thảo mộc khuyên dùng
          </h3>
          <div className="flex-1 flex justify-around items-center">
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-amber-200 shadow-md mb-3 text-amber-600">
                <Flame size={40} />
              </div>
              <span className="font-bold text-lg text-amber-900">Trà Gừng</span>
              <span className="text-amber-700 text-sm mt-1">Làm ấm Tỳ Vị</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-red-200 shadow-md mb-3 text-red-500">
                <Heart size={40} />
              </div>
              <span className="font-bold text-lg text-amber-900">Trà Táo Đỏ</span>
              <span className="text-amber-700 text-sm mt-1">Bổ khí huyết</span>
            </div>
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-orange-200 shadow-md mb-3 text-orange-500">
                <Sun size={40} />
              </div>
              <span className="font-bold text-lg text-amber-900">Trà Kỷ Tử</span>
              <span className="text-amber-700 text-sm mt-1">Bổ Can Thận</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trang 7: 7-Day Meal Plan */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden">
        <div className="flex items-center gap-4 mb-6 border-b-2 border-olive-100 pb-4 shrink-0">
          <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center text-olive-700">
            <Calendar size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-olive-900">Thực đơn 7 ngày</h2>
        </div>
        
        <div className="flex-1 flex flex-col gap-3">
          {Object.entries(result.mealPlan).map(([day, meals], idx) => {
            const dayNames: Record<string, string> = {
              monday: 'Thứ 2', tuesday: 'Thứ 3', wednesday: 'Thứ 4',
              thursday: 'Thứ 5', friday: 'Thứ 6', saturday: 'Thứ 7', sunday: 'CN'
            };
            return (
              <div key={day} className="flex border border-olive-200 rounded-xl overflow-hidden shadow-sm flex-1">
                <div className="bg-olive-100 w-20 flex items-center justify-center font-serif font-bold text-lg text-olive-900 border-r border-olive-200">
                  {dayNames[day]}
                </div>
                <div className="flex-1 grid grid-cols-3 divide-x divide-olive-100">
                  <div className="p-3 bg-white flex flex-col justify-center">
                    <span className="block text-[10px] font-bold text-olive-400 uppercase tracking-wider mb-1">Sáng</span>
                    <span className="text-sm text-olive-800 font-medium line-clamp-2">{meals.breakfast}</span>
                  </div>
                  <div className="p-3 bg-white flex flex-col justify-center">
                    <span className="block text-[10px] font-bold text-olive-400 uppercase tracking-wider mb-1">Trưa</span>
                    <span className="text-sm text-olive-800 font-medium line-clamp-2">{meals.lunch}</span>
                  </div>
                  <div className="p-3 bg-olive-50/50 flex flex-col justify-center">
                    <span className="block text-[10px] font-bold text-olive-400 uppercase tracking-wider mb-1">Tối</span>
                    <span className="text-sm text-olive-800 font-medium line-clamp-2">{meals.dinner}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center gap-4 bg-olive-50 p-4 rounded-2xl border border-olive-100 shrink-0">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-olive-500 shrink-0">
            <Utensils size={24} />
          </div>
          <p className="text-olive-700 text-sm leading-relaxed">
            <strong>Lưu ý:</strong> Thực đơn mang tính tham khảo. Nguyên tắc quan trọng nhất là ăn chín, uống sôi, nhai kỹ và chỉ ăn no 8 phần.
          </p>
        </div>
      </div>

      {/* Trang 8: Exercises */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b-2 border-olive-100 pb-4 shrink-0">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Activity size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-olive-900">Bài tập Khí công & Vận động</h2>
        </div>
        
        <div className="flex-1 flex flex-col gap-6">
          {result.exerciseSuggestions.slice(0, 3).map((exercise, idx) => (
            <div key={idx} className="flex gap-6 bg-olive-50 p-6 rounded-3xl border border-olive-100 items-center flex-1">
              <div className="w-24 h-24 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm border-2 border-olive-200 text-blue-500">
                <User size={48} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-olive-900 mb-2">{exercise.name}</h4>
                <div className="inline-block px-3 py-1 bg-white text-olive-600 rounded-md text-xs font-bold mb-2 border border-olive-200 uppercase tracking-wider">
                  Thời gian: {exercise.duration}
                </div>
                <p className="text-olive-700 text-sm leading-relaxed">
                  <strong>Tác dụng:</strong> {exercise.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trang 9: Habits */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b-2 border-olive-100 pb-4 shrink-0">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <Leaf size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-olive-900">Thói quen Dưỡng sinh</h2>
        </div>
        
        <div className="flex-1 grid grid-cols-1 gap-6">
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500 shrink-0">
              <Droplets size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-blue-900 mb-2">Uống nước ấm</h4>
              <p className="text-blue-800 text-base">Khởi đầu ngày mới bằng 1 ly nước ấm. Tuyệt đối tránh nước đá lạnh để bảo vệ Tỳ Vị.</p>
            </div>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500 shrink-0">
              <Sun size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-amber-900 mb-2">Tắm nắng sáng</h4>
              <p className="text-amber-800 text-base">Phơi nắng 15-20 phút mỗi ngày trong khoảng 7h-9h sáng để hấp thụ dương khí.</p>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-500 shrink-0">
              <Apple size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-emerald-900 mb-2">Nhai kỹ no lâu</h4>
              <p className="text-emerald-800 text-base">Nhai thức ăn ít nhất 30 lần trước khi nuốt. Chỉ ăn no đến 8 phần để giảm tải tiêu hóa.</p>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-500 shrink-0">
              <Moon size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-indigo-900 mb-2">Ngủ trước 23h</h4>
              <p className="text-indigo-800 text-base">Giờ Tý (23h-1h) là thời điểm Âm khí thịnh nhất, cần ngủ say để dưỡng Âm và phục hồi.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trang 10: 30-Day Timeline */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden">
        <div className="flex items-center gap-4 mb-8 border-b-2 border-olive-100 pb-4 shrink-0">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent">
            <Calendar size={28} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-olive-900">Lộ trình Cải thiện 30 Ngày</h2>
        </div>
        
        <div className="relative max-w-2xl mx-auto py-4 flex-1 w-full">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-olive-100 rounded-full"></div>
          
          <div className="relative flex items-center mb-10">
            <div className="w-16 h-16 bg-emerald-500 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xl z-10 shrink-0">
              T1
            </div>
            <div className="ml-8 bg-olive-50 p-5 rounded-2xl border border-olive-100 w-full shadow-sm">
              <h3 className="text-lg font-bold text-olive-900 mb-2">Tuần 1: Điều chỉnh ăn uống</h3>
              <p className="text-olive-700 text-sm">Cắt giảm hoàn toàn đồ lạnh, đồ ngọt. Bắt đầu áp dụng thực đơn dưỡng sinh. Cơ thể cảm thấy nhẹ nhõm hơn.</p>
            </div>
          </div>

          <div className="relative flex items-center mb-10">
            <div className="w-16 h-16 bg-blue-500 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xl z-10 shrink-0">
              T2
            </div>
            <div className="ml-8 bg-olive-50 p-5 rounded-2xl border border-olive-100 w-full shadow-sm">
              <h3 className="text-lg font-bold text-olive-900 mb-2">Tuần 2: Cải thiện tiêu hóa</h3>
              <p className="text-olive-700 text-sm">Duy trì thói quen nhai kỹ. Bắt đầu tập nhẹ nhàng. Tình trạng đầy bụng giảm rõ rệt. Rêu lưỡi mỏng dần.</p>
            </div>
          </div>

          <div className="relative flex items-center mb-10">
            <div className="w-16 h-16 bg-amber-500 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xl z-10 shrink-0">
              T3
            </div>
            <div className="ml-8 bg-olive-50 p-5 rounded-2xl border border-olive-100 w-full shadow-sm">
              <h3 className="text-lg font-bold text-olive-900 mb-2">Tuần 3: Tăng cường năng lượng</h3>
              <p className="text-olive-700 text-sm">Khí huyết lưu thông tốt hơn. Giảm mệt mỏi buổi chiều. Giấc ngủ sâu hơn. Dấu hằn răng trên lưỡi mờ dần.</p>
            </div>
          </div>

          <div className="relative flex items-center">
            <div className="w-16 h-16 bg-accent rounded-full border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-xl z-10 shrink-0">
              T4
            </div>
            <div className="ml-8 bg-olive-50 p-5 rounded-2xl border border-olive-100 w-full shadow-sm">
              <h3 className="text-lg font-bold text-olive-900 mb-2">Tuần 4: Ổn định cơ thể</h3>
              <p className="text-olive-700 text-sm">Thiết lập trạng thái cân bằng mới. Sắc mặt hồng hào. Lưỡi dần trở về màu hồng nhạt, rêu trắng mỏng.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trang 11: Disclaimer */}
      <div className="print-page p-12 bg-white flex flex-col h-[297mm] overflow-hidden justify-center items-center text-center">
        <div className="w-32 h-32 bg-olive-50 rounded-full flex items-center justify-center text-olive-400 mb-8">
          <Shield size={64} />
        </div>
        <h2 className="text-4xl font-serif font-bold text-olive-900 mb-6">Lưu ý Y khoa</h2>
        
        <div className="max-w-2xl bg-olive-50 p-10 rounded-3xl border border-olive-100">
          <p className="text-xl text-olive-800 leading-relaxed mb-6">
            Báo cáo này được tạo ra bởi Trợ lý AI Đạt Không Wellness dựa trên hình ảnh và thông tin bạn cung cấp. 
          </p>
          <p className="text-xl text-olive-800 leading-relaxed mb-8">
            Các phân tích và gợi ý mang tính chất tham khảo về mặt dưỡng sinh, chăm sóc sức khỏe chủ động theo nguyên lý Y học cổ truyền.
          </p>
          <div className="inline-block px-6 py-3 bg-red-50 text-red-700 rounded-xl font-bold uppercase tracking-wider border border-red-100">
            Không thay thế cho chẩn đoán y khoa
          </div>
        </div>
        
        <div className="mt-16 text-olive-400 font-serif italic">
          Chúc bạn luôn dồi dào sức khỏe và bình an.
        </div>
      </div>

    </div>
  );
}
