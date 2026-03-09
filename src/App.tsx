import React, { useState, useEffect } from 'react';
import { Camera, History as HistoryIcon, Loader2, Leaf, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisResult as AnalysisResultType, QuestionnaireAnswers, UserInfo } from './types';
import { analyzeTongueImage } from './services/geminiService';
import CameraCapture from './components/CameraCapture';
import UserInfoForm from './components/UserInfoForm';
import Questionnaire from './components/Questionnaire';
import AnalysisResult from './components/AnalysisResult';
import Dashboard from './components/Dashboard';
import History from './components/History';
import HealthReport from './components/HealthReport';

type ViewState = 'home' | 'camera' | 'userinfo' | 'questionnaire' | 'analyzing' | 'result' | 'dashboard' | 'history' | 'report';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [currentResult, setCurrentResult] = useState<AnalysisResultType | null>(null);
  const [history, setHistory] = useState<AnalysisResultType[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Temporary state during analysis flow
  const [tempImage, setTempImage] = useState<{base64: string, mime: string} | null>(null);
  const [tempUserInfo, setTempUserInfo] = useState<UserInfo | null>(null);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('datkhong_wellness_history_v2');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
          setView('dashboard');
        }
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history when it changes
  useEffect(() => {
    localStorage.setItem('datkhong_wellness_history_v2', JSON.stringify(history));
  }, [history]);

  const handleImageCaptured = (base64Image: string, mimeType: string) => {
    setTempImage({ base64: base64Image, mime: mimeType });
    setView('userinfo');
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setTempUserInfo(info);
    setView('questionnaire');
  };

  const handleQuestionnaireSubmit = async (answers: QuestionnaireAnswers) => {
    if (!tempImage) {
      setError("Lỗi: Không tìm thấy ảnh. Vui lòng thử lại.");
      setView('home');
      return;
    }

    if (!tempUserInfo) {
      setError("Lỗi: Không tìm thấy thông tin người dùng. Vui lòng thử lại.");
      setView('home');
      return;
    }

    setView('analyzing');
    setError(null);
    try {
      const resultData = await analyzeTongueImage(tempImage.base64, tempImage.mime, answers, tempUserInfo);
      
      const newResult: AnalysisResultType = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: `data:${tempImage.mime};base64,${tempImage.base64}`,
        userInfo: tempUserInfo,
        ...resultData,
      };

      setCurrentResult(newResult);
      setHistory(prev => [newResult, ...prev]);
      setTempImage(null);
      setTempUserInfo(null);
      setView('result');
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi phân tích.");
      setView('home');
    }
  };

  const handleSelectHistory = (result: AnalysisResultType) => {
    setCurrentResult(result);
    setView('result');
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử?')) {
      setHistory([]);
      setView('home');
    }
  };

  if (view === 'report' && currentResult) {
    return <HealthReport result={currentResult} onBack={() => setView('result')} />;
  }

  return (
    <div className="min-h-screen bg-olive-50 text-olive-900 font-sans selection:bg-accent/30">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-olive-800 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-olive-900/20">
              <Leaf size={48} className="text-olive-100" />
            </div>
            
            <h1 className="font-serif text-4xl font-bold text-center mb-2 text-olive-900">
              Đạt Không Wellness AI
            </h1>
            <p className="text-olive-600 text-center mb-12 text-lg">
              Trợ lý sức khỏe Đông y cá nhân hóa
            </p>

            {error && (
              <div className="w-full p-4 mb-8 text-sm text-red-800 bg-red-50 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="w-full space-y-4">
              <button 
                onClick={() => setView('camera')}
                className="w-full py-4 bg-olive-800 hover:bg-olive-900 text-white rounded-2xl font-medium text-lg transition-all shadow-lg shadow-olive-900/20 flex items-center justify-center gap-3 group"
              >
                <Camera size={24} className="group-hover:scale-110 transition-transform" />
                Chụp ảnh lưỡi để phân tích
              </button>

              {history.length > 0 && (
                <button 
                  onClick={() => setView('dashboard')}
                  className="w-full py-4 bg-white hover:bg-olive-100 text-olive-800 border border-olive-200 rounded-2xl font-medium transition-all flex items-center justify-center gap-3 group"
                >
                  <Activity size={24} className="text-olive-500 group-hover:text-olive-800 transition-colors" />
                  Dashboard sức khỏe
                </button>
              )}
            </div>
            
            <div className="mt-auto pt-12 text-center">
              <p className="text-xs text-olive-400 uppercase tracking-widest font-medium">
                Phân tích thể trạng • Gợi ý ăn uống • Bài tập
              </p>
            </div>
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen"
          >
            <Dashboard 
              history={history}
              onNewAnalysis={() => setView('camera')}
              onViewHistory={() => setView('history')}
              onViewDetails={(result) => {
                setCurrentResult(result);
                setView('result');
              }}
            />
          </motion.div>
        )}

        {view === 'camera' && (
          <motion.div 
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <CameraCapture 
              onImageCaptured={handleImageCaptured} 
              onCancel={() => setView(history.length > 0 ? 'dashboard' : 'home')} 
            />
          </motion.div>
        )}

        {view === 'userinfo' && (
          <motion.div 
            key="userinfo"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <UserInfoForm 
              onSubmit={handleUserInfoSubmit}
              onBack={() => setView('camera')}
            />
          </motion.div>
        )}

        {view === 'questionnaire' && (
          <motion.div 
            key="questionnaire"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen"
          >
            <Questionnaire 
              onSubmit={handleQuestionnaireSubmit}
              onBack={() => setView('userinfo')}
            />
          </motion.div>
        )}

        {view === 'analyzing' && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-olive-900/10 mb-8 relative">
              <div className="absolute inset-0 border-4 border-olive-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-olive-800 rounded-full border-t-transparent animate-spin"></div>
              <Leaf size={32} className="text-olive-800 animate-pulse" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-olive-900 mb-2 text-center">
              AI đang phân tích...
            </h2>
            <p className="text-olive-600 text-center max-w-xs">
              Vui lòng đợi trong giây lát, chúng tôi đang đánh giá thể trạng của bạn dựa trên hình ảnh và câu trả lời.
            </p>
          </motion.div>
        )}

        {view === 'result' && currentResult && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen"
          >
            <AnalysisResult 
              result={currentResult} 
              onBack={() => setView('dashboard')} 
              onExportReport={() => setView('report')}
            />
          </motion.div>
        )}

        {view === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen"
          >
            <History 
              history={history} 
              onSelect={handleSelectHistory} 
              onClear={handleClearHistory}
              onBack={() => setView('dashboard')} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
