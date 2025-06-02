import {Router} from 'express';
import { deleteNotification, deletePlantHistory, getPlantHistory, getProfile, storePlantHistory, updateProfile, uploadImage } from '../controllers/farmerController.js';
import { upload } from '../utils/s3.js';


const router = Router();


router.get('/profile',getProfile);
router.put('/profile',updateProfile);
router.post("/image",upload.single('image'),uploadImage);
router.post('/plant',storePlantHistory);
router.get('/plant',getPlantHistory);
router.patch('/delete-notification',deleteNotification);
router.delete('/delete-history/:id',deletePlantHistory);


export default router;