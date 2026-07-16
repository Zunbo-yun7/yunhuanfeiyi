export function fileToBase64(file: File, maxSize: number = 256, quality: number = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > h) {
          if (w > maxSize) {
            h = h * maxSize / w;
            w = maxSize;
          }
        } else {
          if (h > maxSize) {
            w = w * maxSize / h;
            h = maxSize;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法获取canvas上下文'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = () => reject(new Error('图片加载失败'));
    };
    reader.onerror = (err) => reject(err);
  });
}

export function svgToPngBase64(svgElement: SVGSVGElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('无法获取canvas上下文'));
      return;
    }
    canvas.width = 256;
    canvas.height = 256;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/png', 0.7);
      resolve(base64);
    };
    img.onerror = () => reject(new Error('SVG转换失败'));
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  });
}

export function downloadBase64Image(base64: string, filename: string = 'image.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = base64;
  link.click();
}