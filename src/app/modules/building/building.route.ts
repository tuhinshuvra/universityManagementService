import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './building.controller';
import { BuildingValidations } from './building.validations';


const router = express.Router();

router.post('/',
  validateRequest(BuildingValidations.create)
  , BuildingController.insertIntoDB)
router.get('/', BuildingController.getAllFromDB)

export const buildingRoutes = router;