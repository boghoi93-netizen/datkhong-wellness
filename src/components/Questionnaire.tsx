import React, { useState } from 'react';
import { QuestionnaireAnswers, DynamicQuestion } from '../types';
import { ClipboardList, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuestionnaireProps {
  questions: DynamicQuestion[];
  onSubmit: (answers: QuestionnaireAnswers) => void;
  onBack: () => void;
}

export default function Questionnaire({ questions, onSubmit, onBack }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});

  const handleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < questions.length) {
      alert('Vui lòng trả lời tất cả các câu hỏi để có kết quả chính xác nhất.');
      return;
    }
    onSubmit(answers);
  };

  const options = [
    'Không bao giờ',
    'Thỉnh thoảng',
    'Thường xuyên',
    'Gần như mỗi ngày'
  ];

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-olive-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center text-olive-700">
          <ClipboardList size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-olive-900">Khảo sát sức khỏe</h2>
          <p className="text-olive-600 text-sm">Vài câu hỏi nhỏ để hiểu rõ hơn về bạn</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-olive-50/50 p-6 rounded-2xl border border-olive-100">
            <label className="block text-lg font-medium text-olive-900 mb-4">
              {index + 1}. {q.text}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(q.id, option)}
                  className={`py-3 px-4 rounded-xl border text-left transition-all ${
                    answers[q.id] === option
                      ? 'bg-accent text-white border-accent shadow-md'
                      : 'bg-white text-olive-700 border-olive-200 hover:border-accent hover:bg-olive-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-6 border border-olive-200 rounded-xl text-lg font-medium text-olive-700 bg-white hover:bg-olive-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <button
            type="submit"
            className="flex-1 py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-accent hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            Hoàn thành
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
