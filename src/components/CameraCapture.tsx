import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface CameraCaptureProps {
  onImageCaptured: (base64Image: string, mimeType: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onImageCaptured, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      console.error("Lỗi truy cập camera:", err);
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền hoặc tải ảnh lên.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Calculate new dimensions (max 1024px)
      const MAX_DIMENSION = 1024;
      let width = video.videoWidth;
      let height = video.videoHeight;
      
      if (width > height && width > MAX_DIMENSION) {
        height = Math.round((height * MAX_DIMENSION) / width);
        width = MAX_DIMENSION;
      } else if (height > MAX_DIMENSION) {
        width = Math.round((width * MAX_DIMENSION) / height);
        height = MAX_DIMENSION;
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64Data = dataUrl.split(',')[1];
        stopCamera();
        onImageCaptured(base64Data, 'image/jpeg');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        
        // Resize uploaded image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIMENSION = 1024;
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const base64Data = dataUrl.split(',')[1];
            onImageCaptured(base64Data, 'image/jpeg');
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 bg-white rounded-3xl card-shadow">
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-xl font-serif font-semibold text-olive-900">Chụp ảnh lưỡi</h2>
        <button onClick={() => { stopCamera(); onCancel(); }} className="p-2 text-olive-500 hover:text-olive-900 rounded-full hover:bg-olive-50 transition-colors">
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="w-full p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-xl">
          {error}
        </div>
      )}

      {isCameraActive ? (
        <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden mb-6">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-2 border-white/30 rounded-2xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/3 border-2 border-dashed border-white/50 rounded-full opacity-50 pointer-events-none flex items-center justify-center">
            <span className="text-white/70 text-sm font-medium">Căn lưỡi vào đây</span>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-[3/4] bg-olive-50 rounded-2xl flex flex-col items-center justify-center mb-6 border-2 border-dashed border-olive-200">
          <Camera size={48} className="text-olive-300 mb-4" />
          <p className="text-olive-600 text-center px-6">
            Chụp ảnh lưỡi của bạn dưới ánh sáng tự nhiên để có kết quả chính xác nhất.
          </p>
        </div>
      )}

      <div className="flex flex-col w-full gap-3">
        {isCameraActive ? (
          <button 
            onClick={captureImage}
            className="w-full py-4 bg-olive-700 hover:bg-olive-800 text-white rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Chụp ảnh
          </button>
        ) : (
          <button 
            onClick={startCamera}
            className="w-full py-4 bg-olive-700 hover:bg-olive-800 text-white rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Mở Camera
          </button>
        )}
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-olive-200"></div>
          <span className="flex-shrink-0 mx-4 text-olive-400 text-sm">hoặc</span>
          <div className="flex-grow border-t border-olive-200"></div>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 bg-white border border-olive-200 hover:bg-olive-50 text-olive-800 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Upload size={20} />
          Tải ảnh lên
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
