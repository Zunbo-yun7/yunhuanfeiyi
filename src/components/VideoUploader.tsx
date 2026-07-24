import { useState, useCallback, useRef } from 'react';
import { X, Video } from 'lucide-react';
import api from '@/lib/api';

interface VideoUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  maxSize?: number;
  disabled?: boolean;
}

export function VideoUploader({
  value,
  onChange,
  label = '视频',
  maxSize = 100 * 1024 * 1024,
  disabled = false,
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (file.size > maxSize) {
      setError(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('只支持 MP4、WebM、OGG、MOV 格式的视频');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onChange(response.data.url);
      } else {
        setError(response.data.message || '上传失败');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || '上传失败，请重试';
      if (msg.includes('图片') || msg.includes('image')) {
        setError('蜜蜂图床暂不支持视频文件，请填写视频 URL');
      } else {
        setError(msg);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [maxSize, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleRemove = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-black">
          <video
            src={value}
            controls
            className="w-full h-48 object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDrop={!disabled ? handleDrop : undefined}
          onDragOver={!disabled ? handleDragOver : undefined}
          className={`
            relative border-2 border-dashed rounded-lg transition-all duration-300 overflow-hidden
            ${disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 bg-gray-50 hover:border-yingge-gold hover:bg-yingge-gold/5 cursor-pointer'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center py-8">
            {uploading ? (
              <>
                <div className="w-10 h-10 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-gray-500 text-sm">上传中...</span>
              </>
            ) : (
              <>
                <div className="p-3 bg-yingge-gold/10 rounded-full mb-3">
                  <Video size={24} className="text-yingge-gold" />
                </div>
                <p className="text-gray-600 font-medium text-sm">点击选择视频</p>
                <p className="text-gray-400 text-xs mt-1">或拖拽视频到此处</p>
                <p className="text-gray-400 text-xs mt-1">支持 MP4、WebM、MOV，最大 {maxSize / 1024 / 1024}MB</p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}

      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
          placeholder="视频 URL（如蜜蜂图床不支持视频，请填写外部链接）"
        />
      </div>
    </div>
  );
}

export default VideoUploader;
