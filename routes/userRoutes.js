
import express from 'express';
import {
    deleteUser,
    getAllUsers,
    getUserById,
    loginUser, registerManyUsers,
    registerUser,
    updateUser
} from "../controllers/userController.js";


const router = express.Router();

router.post('/register', registerUser);
router.post('/registerMany', registerManyUsers);
router.post('/login', loginUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUserById);
router.get('/', getAllUsers);
router.put('/:id', updateUser);

export default router;
