import { useState, useCallback, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import api from '@/lib/api';

interface ImageUploaderMultipleProps {
  value: string;
  onChange: (urls: string) => void;
  label?: string;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  category?: string;
}

export function ImageUploaderMultiple({
  value,
  onChange,
  label = '图片',
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  disabled = false,
  category = 'default',
}: ImageUploaderMultipleProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const urls = value
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        setError(`${file.name} 超过 ${maxSize / 1024 / 1024}MB 限制`);
        return;
      }
      if (!validTypes.includes(file.type)) {
        setError(`${file.name} 格式不支持，只支持 JPG、PNG、GIF、WebP、BMP`);
        return;
      }
      validFiles.push(file);
    }

    setError('');
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('category', category);

        const response = await api.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          uploadedUrls.push(response.data.url);
        } else {
          setError(response.data.message || `${file.name} 上传失败`);
        }
      }

      if (uploadedUrls.length > 0) {
        const newUrls = [...urls, ...uploadedUrls];
        onChange(newUrls.join(','));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '上传失败，请重试');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [maxSize, onChange, urls]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleRemove = useCallback((index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    onChange(newUrls.join(','));
  }, [onChange, urls]);

  const handleMove = useCallback((index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= urls.length) return;
    const newUrls = [...urls];
    [newUrls[index], newUrls[newIndex]] = [newUrls[newIndex], newUrls[index]];
    onChange(newUrls.join(','));
  }, [onChange, urls]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}

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
                <Upload size={24} className="text-yingge-gold" />
              </div>
              <p className="text-gray-600 font-medium text-sm">点击选择图片</p>
              <p className="text-gray-400 text-xs mt-1">或拖拽图片到此处</p>
              <p className="text-gray-400 text-xs mt-1">支持多张，最大 {maxSize / 1024 / 1024}MB/张</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || uploading}
        />
      </div>

      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}

      {urls.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {urls.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white">
              <img
                src={url}
                alt={`图片 ${index + 1}`}
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 bg-white/90 rounded-full hover:bg-white disabled:opacity-30 transition-colors"
                  title="前移"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 1)}
                  disabled={index === urls.length - 1}
                  className="p-1.5 bg-white/90 rounded-full hover:bg-white disabled:opacity-30 transition-colors"
                  title="后移"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="删除"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-yingge-gold text-yingge-dark text-xs font-bold rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {urls.length > 0 && (
        <div className="mt-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-yingge-gold focus:border-transparent outline-none"
            placeholder="图片URL（逗号分隔）"
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploaderMultiple;
