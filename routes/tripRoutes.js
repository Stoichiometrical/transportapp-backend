
import express from 'express';
import {
    createManyTrips,
    createTrip,
    deleteTrip,
    getAllTrips,
    getTripById, getTripsByOrganizerId, updateApprovalStatus, updateNitishStatus,
    updateTrip
} from "../controllers/tripController.js";


const router = express.Router();

router.post('/', createTrip);
router.post('/bulk', createManyTrips);
router.delete('/:id', deleteTrip);
router.put('/:id', updateTrip);
router.get('/', getAllTrips);
router.get('/:id', getTripById);
router.get('/organizer/:organizerId', getTripsByOrganizerId);

router.put('/updateApprovalStatus/:tripId', updateApprovalStatus);
router.put('/updateNitishStatus/:tripId', updateNitishStatus);

export default router;
