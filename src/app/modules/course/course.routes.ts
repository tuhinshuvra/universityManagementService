import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.post('/', CourseController.insertIntoDB)
router.patch('/:id', CourseController.updateOneInDB)

export const courseRoutes = router;