import express from 'express';
import { loginUser, getCitizens, registerCitizen  } from '../controllers/authController.js';
const router = express.Router();

// POST login route
router.post('/login', loginUser);

// GET route to fetch all citizens
router.get('/citizens', getCitizens);

// Register route
router.post("/citizens", registerCitizen);

export default router;
