import express from 'express';
import {
    addLivre,
    getLivres,
    getLivreById,
    updateLivre,
    deleteLivre,
    getLivresDisponibles // Nouvelle fonction ajoutée
} from '../controllers/livreController.js';
import authenticateToken from '../middlewares/auth.js';
import authorizeRole from '../middlewares/authorization.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('ADMIN'), addLivre);
router.get('/', authenticateToken, getLivres);
router.get('/disponibles', authenticateToken, getLivresDisponibles);  // Nouvelle route pour les livres disponibles
router.get('/:id', authenticateToken, getLivreById);
router.put('/:id', authenticateToken, authorizeRole('ADMIN'), updateLivre);
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteLivre);

export default router;
