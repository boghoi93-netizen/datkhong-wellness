import React, { useState } from 'react';
import { PersonalInfo } from '../types';
import { User, Calendar, Ruler, Weight, ArrowRight } from 'lucide-react';

interface PersonalInfoFormProps {
  onSubmit: (info: PersonalInfo) => void;
  initialData?: PersonalInfo;
}

export default function PersonalInfoForm({ onSubmit, initialData }: PersonalInfoFormProps) {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [birthYear, setBirthYear] = useState(initialData?.birthYear || '');
  const [height, setHeight] = useState(initialData?.height || '');
  const [weight, setWeight] = useState(initialData?.weight || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const h = parseFloat(height);
    const w = parseFloat(weight);
    
    if (!fullName || !birthYear || isNaN(h) || isNaN(w)) {
      alert('Vui lòng nhập đầy đủ và chính xác thông tin.');
      return;
    }

    const bmi = w / Math.pow(h / 100, 2);

    onSubmit({
      fullName,
      birthYear,
      height,
      weight,
      bmi: parseFloat(bmi.toFixed(1))
    });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-olive-100 max-w-md w-full mx-auto">
      <h2 className="text-2xl font-serif font-bold text-olive-900 mb-6 text-center">Thông tin cơ bản</h2>
      <p className="text-olive-600 mb-8 text-center text-sm">
        Vui lòng cung cấp một số thông tin để chúng tôi cá nhân hóa kết quả phân tích cho bạn.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-olive-700 mb-2">Họ và tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-olive-400">
              <User size={20} />
            </div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-olive-200 rounded-xl focus:ring-accent focus:border-accent bg-olive-50"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-olive-700 mb-2">Năm sinh</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-olive-400">
              <Calendar size={20} />
            </div>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-olive-200 rounded-xl focus:ring-accent focus:border-accent bg-olive-50"
              placeholder="1990"
              min="1900"
              max={new Date().getFullYear()}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-2">Chiều cao (cm)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-olive-400">
                <Ruler size={20} />
              </div>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-olive-200 rounded-xl focus:ring-accent focus:border-accent bg-olive-50"
                placeholder="170"
                min="50"
                max="250"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-olive-700 mb-2">Cân nặng (kg)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-olive-400">
                <Weight size={20} />
              </div>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-olive-200 rounded-xl focus:ring-accent focus:border-accent bg-olive-50"
                placeholder="65"
                min="10"
                max="300"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors mt-8"
        >
          Tiếp tục
          <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
}
