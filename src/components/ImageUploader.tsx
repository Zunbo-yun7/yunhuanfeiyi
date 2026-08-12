import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import api from '@/lib/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  category?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = '图片',
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  disabled = false,
  category = 'default',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (file.size > maxSize) {
      setError(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setError('只支持 JPG、PNG、GIF、WebP、BMP 格式的图片');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);

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
      setError(err.response?.data?.message || '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  }, [maxSize, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {value && <span className="ml-2 text-gray-400">(点击更换)</span>}
        </label>
      )}
      
      <div
        ref={dropZoneRef}
        onClick={!disabled && !value ? handleClick : undefined}
        onDrop={!disabled ? handleDrop : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        className={`
          relative border-2 border-dashed rounded-lg transition-all duration-300 overflow-hidden
          ${disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : value 
              ? 'border-gray-200 bg-white' 
              : 'border-gray-300 bg-gray-50 hover:border-yingge-gold hover:bg-yingge-gold/5 cursor-pointer'
          }
        `}
      >
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="预览"
              className="w-full h-48 object-contain"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            {uploading ? (
              <>
                <div className="w-12 h-12 border-4 border-yingge-gold border-t-transparent rounded-full animate-spin mb-4" />
                <span className="text-gray-500">上传中...</span>
              </>
            ) : (
              <>
                <div className="p-4 bg-yingge-gold/10 rounded-full mb-4">
                  <Upload size={28} className="text-yingge-gold" />
                </div>
                <p className="text-gray-600 font-medium">点击选择图片</p>
                <p className="text-gray-400 text-sm mt-1">或拖拽图片到此处</p>
                <p className="text-gray-400 text-xs mt-2">支持 JPG、PNG、GIF、WebP，最大 {maxSize / 1024 / 1024}MB</p>
              </>
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}

      {value && (
        <div className="mt-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
            placeholder="图片URL"
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;