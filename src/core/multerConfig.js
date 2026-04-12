import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, 
    params: {
        folder: 'profiles',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 4 * 1024 * 1024 },
});

export default upload;