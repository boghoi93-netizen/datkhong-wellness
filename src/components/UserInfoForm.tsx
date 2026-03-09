import React, { useState } from 'react';
import { User, Calendar, UserCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { UserInfo } from '../types';

interface UserInfoFormProps {
  onSubmit: (info: UserInfo) => void;
  onBack: () => void;
}

export default function UserInfoForm({ onSubmit, onBack }: UserInfoFormProps) {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthYear.trim() || !gender) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    
    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear) {
      setError('Năm sinh không hợp lệ.');
      return;
    }

    setError('');
    onSubmit({ name: name.trim(), birthYear, gender });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 bg-white rounded-3xl card-shadow">
      <div className="flex justify-between items-center w-full mb-6">
        <button onClick={onBack} className="p-2 text-olive-500 hover:text-olive-900 rounded-full hover:bg-olive-50 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-serif font-semibold text-olive-900">Thông tin cá nhân</h2>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <p className="text-olive-600 text-center mb-8">
        Vui lòng cung cấp thông tin để AI có thể phân tích chính xác hơn dựa trên độ tuổi và giới tính của bạn.
      </p>

      {error && (
        <div className="w-full p-3 mb-6 text-sm text-red-800 bg-red-50 rounded-xl border border-red-100 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-olive-800">Họ và tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-olive-400" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên của bạn"
              className="w-full pl-10 pr-4 py-3 bg-olive-50 border border-olive-200 rounded-xl text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-olive-800">Năm sinh</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-olive-400" />
            </div>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="Ví dụ: 1990"
              className="w-full pl-10 pr-4 py-3 bg-olive-50 border border-olive-200 rounded-xl text-olive-900 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-olive-800">Giới tính</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender('Nam')}
              className={`py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                gender === 'Nam' 
                  ? 'bg-olive-700 text-white border-olive-700 shadow-md' 
                  : 'bg-olive-50 text-olive-700 border-olive-200 hover:bg-olive-100'
              }`}
            >
              <UserCircle size={18} /> Nam
            </button>
            <button
              type="button"
              onClick={() => setGender('Nữ')}
              className={`py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${
                gender === 'Nữ' 
                  ? 'bg-olive-700 text-white border-olive-700 shadow-md' 
                  : 'bg-olive-50 text-olive-700 border-olive-200 hover:bg-olive-100'
              }`}
            >
              <UserCircle size={18} /> Nữ
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 py-4 bg-olive-800 hover:bg-olive-900 text-white rounded-xl font-medium text-lg transition-all shadow-lg shadow-olive-900/20 flex items-center justify-center gap-2 group"
        >
          Tiếp tục
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}
