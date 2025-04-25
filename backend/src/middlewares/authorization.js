
const authorizeRole = (requiredRole) => {
   return (req, res, next) => {
     // Vérifier si l'utilisateur est authentifié
     if (!req.user) {
       return res.status(401).json({ message: 'Accès refusé. Utilisateur non authentifié.' });
     }
 
     // Vérifier si l'utilisateur a le rôle requis
     if (req.user.role !== requiredRole) {
       const errorMessage =
         req.user.role === 'USER'
           ? 'Accès refusé. Vous n\'avez pas les droits suffisants. Vous êtes un utilisateur, et cette ressource nécessite un rôle administrateur.'
           : 'Accès refusé. Vous n\'avez pas les droits suffisants. Vous êtes un administrateur, et cette ressource nécessite un rôle utilisateur.';
 
       return res.status(403).json({ message: errorMessage });
     }
 
     // L'utilisateur a le rôle requis, donc on passe à la prochaine étape
     next();
   };
 };
 
 export default authorizeRole;
 