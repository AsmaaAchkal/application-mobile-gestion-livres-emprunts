import prisma from "../config/dbConfig.js";



// Créer un emprunt
export const createEmprunt = async (req, res) => {
    try {
        const { userId, livreId } = req.body;

        // Vérifier si l'utilisateur et le livre existent
        const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
        const livre = await prisma.livre.findUnique({ where: { id: parseInt(livreId) } });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        if (!livre) {
            return res.status(404).json({ error: "Livre non trouvé" });
        }

        // Vérifier si le livre est disponible
        if (!livre.disponible) {
            return res.status(400).json({ error: "Le livre n'est pas disponible" });
        }

        // Créer un emprunt
        const emprunt = await prisma.emprunt.create({
            data: {
                userId,
                livreId,
            },
        });

        // Mettre à jour la disponibilité du livre
        await prisma.livre.update({
            where: { id: livreId },
            data: { disponible: false },
        });

        res.status(201).json({ message: "Emprunt créé avec succès", emprunt });
    } catch (error) {
        console.error("Erreur lors de la création de l'emprunt :", error);
        res.status(500).json({ error: "Erreur lors de la création de l'emprunt" });
    }
};

// Récupérer tous les emprunts
export const getEmprunts = async (req, res) => {
    try {
        const emprunts = await prisma.emprunt.findMany({
            include: {
                user: true,  // Inclure les informations sur l'utilisateur
                livre: true, // Inclure les informations sur le livre
            },
        });
        res.json(emprunts);
    } catch (error) {
        console.error("Erreur lors de la récupération des emprunts :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des emprunts" });
    }
};

// Récupérer les emprunts de l'utilisateur connecté
export const getEmpruntsByCurrentUser = async (req, res) => {
    try {
        const userId  = req.user.id; 

        if (!userId || isNaN(userId)) {
            console.log('noo ID !!!')
          }

        // Récupérer les emprunts de l'utilisateur, incluant les livres
        const emprunts = await prisma.emprunt.findMany({
            where: { 
                userId: userId },  // Récupérer uniquement les emprunts de l'utilisateur connecté
            include: {
                livre: true,  // Inclure les informations sur les livres empruntés
            },
        });

        // Diviser les emprunts en deux groupes
        const empruntsSansDateRetour = emprunts.filter((emprunt) => !emprunt.dateRetour);  // emprunts sans date de retour
        const empruntsAvecDateRetour = emprunts.filter((emprunt) => emprunt.dateRetour);  // emprunts avec date de retour

        // Retourner les emprunts séparés
        res.json({
            empruntsSansDateRetour,
            empruntsAvecDateRetour
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des emprunts de l'utilisateur :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des emprunts" });
    }
};

// Mettre à jour la date de retour d'un emprunt
export const returnLivre = async (req, res) => {
    try {
        const { id } = req.params;
        const { dateRetour } = req.body;

        // Mettre à jour la date de retour de l'emprunt
        const emprunt = await prisma.emprunt.update({
            where: { id: parseInt(id) },
            data: { dateRetour },
        });

        // Mettre à jour la disponibilité du livre
        await prisma.livre.update({
            where: { id: emprunt.livreId },
            data: { disponible: true },
        });

        res.json({ message: "Livre retourné avec succès", emprunt });
    } catch (error) {
        console.error("Erreur lors du retour du livre :", error);
        res.status(500).json({ error: "Erreur lors du retour du livre" });
    }
};

// Supprimer un emprunt
export const deleteEmprunt = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'emprunt existe
        const emprunt = await prisma.emprunt.findUnique({ where: { id: parseInt(id) } });
        if (!emprunt) {
            return res.status(404).json({ error: "Emprunt non trouvé" });
        }

        // Supprimer l'emprunt
        await prisma.emprunt.delete({ where: { id: parseInt(id) } });

        // Mettre à jour la disponibilité du livre
        await prisma.livre.update({
            where: { id: emprunt.livreId },
            data: { disponible: true },
        });

        res.json({ message: "Emprunt supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'emprunt :", error);
        res.status(500).json({ error: "Erreur lors de la suppression de l'emprunt" });
    }
};
