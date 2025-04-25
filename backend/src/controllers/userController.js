import prisma from "../config/dbConfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Inscription d'un utilisateur
export const registerUser = async (req, res) => {
    try {
        
        const { nom, prenom, telephone, email, password, role  } = req.body;

        console.log("Données récupérées : ", req.body);

        // Vérification de l'existence de l'utilisateur
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { nom, prenom, telephone, email, password: hashedPassword, role },
        });
        res.status(201).json({ message: "Utilisateur créé", newUser });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
};

// Connexion de l'utilisateur
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Mot de passe incorrect" });
        
        // Générer un token JWT
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        console.log({ message: "Connexion réussie", token, user });  // Pour déboguer

        res.json({ message: "Connexion réussie", token, user });
    } catch (error) {
        res.status(500).json({ error: "Erreur de connexion" });
    }
};

// Récupérer tous les utilisateurs
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
};

// Récupérer un utilisateur spécifique par ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
  
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
  
        res.json(user);
    } catch (error) {
        console.error("Erreur lors de la récupération du user par ID :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'utilisateur existe avant suppression
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Supprimer les emprunts liés
        await prisma.emprunt.deleteMany({ where: { userId: parseInt(id) } });

        // Supprimer l'utilisateur
        await prisma.user.delete({ where: { id: parseInt(id) } });

        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
};

// Modifier un utilisateur
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID reçu depuis les paramètres de l'URL :", id);
        const { nom, prenom, telephone, email, newPassword, role } = req.body;

        console.log("Données reçues :", req.body);

        // Vérifier si l'ID est un nombre valide
        if (isNaN(id)) {
            return res.status(400).json({ error: "L'ID utilisateur fourni est invalide" });
        }

        // Vérifier si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
                             

        if (!existingUser) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Vérifier l'unicité de l'email et du téléphone
        if (email) {
            const emailExists = await prisma.user.findUnique({ where: { email } });
            if (emailExists && emailExists.id !== parseInt(id)) {
                return res.status(400).json({ error: "Cet email est déjà utilisé" });
            }
        }

        if (telephone) {
            const phoneExists = await prisma.user.findUnique({ where: { telephone } });
            if (phoneExists && phoneExists.id !== parseInt(id)) {
                return res.status(400).json({ error: "Ce numéro de téléphone est déjà utilisé" });
            }
        }

        // Construire l'objet de mise à jour
        let updatedFields = { nom, prenom, telephone, email, role };

        // Vérifier si un nouveau mot de passe est fourni
        if (newPassword && newPassword.trim() !== "") {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updatedFields.password = hashedPassword;
            console.log("Nouveau mot de passe haché et mis à jour.");
        }

        // Mettre à jour l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updatedFields,
        });

        res.json({ message: "Utilisateur mis à jour avec succès.", updatedUser });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
};
