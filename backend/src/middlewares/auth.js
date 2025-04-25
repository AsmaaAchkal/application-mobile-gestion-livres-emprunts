
import jwt from 'jsonwebtoken';

// Middleware pour vérifier si un utilisateur est authentifié
const authenticateToken = (req, res, next) => {

  // Récupérer le token JWT dans l'en-tête Authorization
  const token = req.headers['authorization']?.split(' ')[1]; // Le format attendu est 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Vérifier et décoder le token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    
    // Attacher les informations de l'utilisateur à la requête
    req.user = user;
    next(); // Continuer vers la route suivante
  });
};

export default authenticateToken;