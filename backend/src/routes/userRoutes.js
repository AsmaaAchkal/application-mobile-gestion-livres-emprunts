import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getUsers, 
    getUserById, 
    deleteUser, 
    updateUser 
} from '../controllers/userController.js';
import authenticateToken from '../middlewares/auth.js';
import authorizeRole from '../middlewares/authorization.js';

const router = express.Router();

// Routes publiques (pas besoin d'authentification)
router.post('/register', registerUser); // Inscription
router.post('/login', loginUser); // Connexion

// Routes protégées (nécessitent une authentification)
router.get('/', authenticateToken, authorizeRole('ADMIN'), getUsers); // Obtenir tous les utilisateurs
router.get('/:id', authenticateToken, authorizeRole('ADMIN'), getUserById); // Obtenir un utilisateur par ID
router.delete('/:id', authenticateToken, authorizeRole('ADMIN'), deleteUser); // Supprimer un utilisateur
router.put('/:id', authenticateToken, updateUser); // Modifier un utilisateur

export default router;
