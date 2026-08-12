import { Router } from 'express';
import multer from 'multer';
import { uploadImage, uploadImages } from '../services/imageUpload.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的图片' });
    }

    const { originalname, buffer } = req.file;
    const { category } = req.body;
    
    const result = await uploadImage(buffer, originalname, category);

    if (result.success) {
      res.json({
        success: true,
        message: '上传成功',
        url: result.url,
      });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ success: false, message: '上传失败' });
  }
});

router.post('/images', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: '请选择要上传的图片' });
    }

    const { category } = req.body;

    const fileBuffers = req.files.map(file => ({
      buffer: file.buffer,
      fileName: file.originalname,
    }));

    const results = await uploadImages(fileBuffers, category);

    const successResults = results.filter(r => r.success);
    const failedCount = results.length - successResults.length;

    res.json({
      success: successResults.length > 0,
      message: failedCount === 0 ? '全部上传成功' : `成功上传 ${successResults.length} 张，失败 ${failedCount} 张`,
      urls: successResults.map(r => r.url),
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ success: false, message: '上传失败' });
  }
});

export default router;
