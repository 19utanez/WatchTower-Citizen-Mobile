import express from 'express';
import { loginUser, getCitizens } from '../controllers/authController.js';

const router = express.Router();

// POST login route
router.post('/login', loginUser);

// GET route to fetch all citizens
router.get('/citizens', getCitizens);

export default router;
