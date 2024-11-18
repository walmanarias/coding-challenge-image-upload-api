import request from 'supertest';
import app from './server';
import { S3Service } from './services/s3Service';

// Mock S3Service
jest.mock('./services/s3Service');

describe('Image Upload API', () => {
  beforeEach(() => {
    // Mock S3 upload
    (S3Service.uploadFile as jest.Mock).mockResolvedValue('test-key');
    // Mock signed URL generation
    (S3Service.getSignedUrl as jest.Mock).mockResolvedValue('https://test-url.com/image.jpg');
  });

  it('should upload an image successfully', async () => {
    const response = await request(app)
      .post('/images')
      .attach('image', Buffer.from('fake-image'), {
        filename: 'test.jpg',
        contentType: 'image/jpeg'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('key');
    expect(response.body).toHaveProperty('originalname');
    expect(response.body).toHaveProperty('mimetype');
  });

  it('should return 400 when no image is provided', async () => {
    const response = await request(app)
      .post('/images')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should retrieve list of uploaded images with signed URLs', async () => {
    const response = await request(app)
      .get('/images');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('url');
    }
  });
});