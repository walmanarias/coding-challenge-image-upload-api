import express from 'express';
import multer from 'multer';
import { S3Service } from './services/s3Service';

const app = express();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      return cb(error as any);
    }
    cb(null, true);
  }
});

// Store uploaded images information in memory (use a database in production)
const uploadedImages: Array<{
  id: string;
  originalname: string;
  key: string;
  mimetype: string;
}> = [];

app.post('/images', upload.single('image'), async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const key = await S3Service.uploadFile(req.file);
    const imageInfo = {
      id: Date.now().toString(),
      originalname: req.file.originalname,
      key,
      mimetype: req.file.mimetype
    };

    uploadedImages.push(imageInfo);
    res.status(201).json(imageInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.get('/images', async (req, res) => {
  try {
    const imagesWithUrls = await Promise.all(
      uploadedImages.map(async (image) => ({
        ...image,
        url: await S3Service.getSignedUrl(image.key)
      }))
    );
    res.json(imagesWithUrls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
