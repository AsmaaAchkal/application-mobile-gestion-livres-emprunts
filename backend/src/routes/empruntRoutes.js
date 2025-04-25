import express from 'express';
import {
    createEmprunt,
    getEmprunts,
    // getEmpruntById,
    returnLivre,
    deleteEmprunt,
    getEmpruntsByCurrentUser,
} from '../controllers/empruntController.js';
import authenticateToken from '../middlewares/auth.js';
import authorizeRole from '../middlewares/authorization.js';

const router = express.Router();

router.post('/', authenticateToken, createEmprunt);
router.get('/', authenticateToken, getEmprunts);
// router.get('/:id', authenticateToken, getEmpruntById);
router.get('/byuser', authenticateToken, getEmpruntsByCurrentUser);
router.put('/return/:id', authenticateToken, authorizeRole('USER'), returnLivre); // Pour retourner un livre
router.delete('/:id', authenticateToken, deleteEmprunt);

export default router;
