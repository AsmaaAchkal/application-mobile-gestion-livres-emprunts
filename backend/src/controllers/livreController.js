import prisma from "../config/dbConfig.js";

// Ajouter un livre
export const addLivre = async (req, res) => {
    try {
        let { titre, auteur, datePublication, description, categorie, isbn, langue, nbPages, disponible } = req.body;

        // Vérification de l'existence de l'ISBN
        if (isbn) {
            const existingLivre = await prisma.livre.findUnique({
                where: { isbn }
            });
            if (existingLivre) {
                return res.status(400).json({ error: "Un livre avec cet ISBN existe déjà." });
            }
        }

        // Vérifier et convertir `datePublication`
        if (datePublication) {
            datePublication = new Date(datePublication);
            if (isNaN(datePublication.getTime())) {
                return res.status(400).json({ error: "Format de date invalide" });
            }
        }
 
        nbPages=parseInt(nbPages);
        
        // Créer un nouveau livre
        const newLivre = await prisma.livre.create({
            data: {
                titre,
                auteur,
                datePublication,
                description,
                categorie,
                isbn,
                langue,
                nbPages,
                disponible
            }
        });

        res.status(201).json({ message: "Livre ajouté avec succès", newLivre });
    } catch (error) {
        console.error("Erreur lors de l'ajout du livre :", error);
        res.status(500).json({ error: "Erreur lors de l'ajout du livre" });
    }
};

// Récupérer tous les livres
export const getLivres = async (req, res) => {
    try {
        const livres = await prisma.livre.findMany();
        res.json(livres);
        console.log(livres);
    } catch (error) {
        console.error("Erreur lors de la récupération des livres :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des livres" });
    }
};

// Récupérer un livre par son ID
export const getLivreById = async (req, res) => {
    try {
        const { id } = req.params;
        const livre = await prisma.livre.findUnique({
            where: { id: parseInt(id) }
        });

        if (!livre) {
            return res.status(404).json({ error: "Livre non trouvé" });
        }

        res.json(livre);
    } catch (error) {
        console.error("Erreur lors de la récupération du livre par ID :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Récupérer les livres disponibles
export const getLivresDisponibles = async (req, res) => {
   try {
       const livresDisponibles = await prisma.livre.findMany({
           where: {
               disponible: true // Filtre pour obtenir uniquement les livres disponibles
           }
       });

       res.json(livresDisponibles);
   } catch (error) {
       console.error("Erreur lors de la récupération des livres disponibles :", error);
       res.status(500).json({ error: "Erreur lors de la récupération des livres disponibles" });
   }
};

// Modifier un livre
export const updateLivre = async (req, res) => {
    try {
        const { id } = req.params;
        let { titre, auteur, datePublication, description, categorie, isbn, langue, nbPages, disponible } = req.body;

        // Vérifier si le livre existe
        const existingLivre = await prisma.livre.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingLivre) {
            return res.status(404).json({ error: "Livre non trouvé" });
        }

        // Vérifier si un autre livre a le même ISBN (si modifié)
        if (isbn && isbn !== existingLivre.isbn) {
            const isbnExists = await prisma.livre.findUnique({
                where: { isbn }
            });
            if (isbnExists) {
                return res.status(400).json({ error: "Un livre avec cet ISBN existe déjà." });
            }
        }

         // Vérifier et convertir `datePublication`
         if (datePublication) {
            datePublication = new Date(datePublication);
            if (isNaN(datePublication.getTime())) {
                return res.status(400).json({ error: "Format de date invalide" });
            }
        }

        // Mettre à jour les champs du livre
        const updatedLivre = await prisma.livre.update({
            where: { id: parseInt(id) },
            data: {
                titre,
                auteur,
                datePublication,
                description,
                categorie,
                isbn,
                langue,
                nbPages,
                disponible
            },
        });

        res.json({ message: "Livre mis à jour avec succès", updatedLivre });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du livre :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du livre" });
    }
};

// Supprimer un livre
export const deleteLivre = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si le livre existe avant la suppression
        const livre = await prisma.livre.findUnique({ where: { id: parseInt(id) } });
        if (!livre) {
            return res.status(404).json({ error: "Livre non trouvé" });
        }

         // Supprimer les emprunts liés
         await prisma.emprunt.deleteMany({ where: { livreId: parseInt(id) } });

        // Supprimer le livre
        await prisma.livre.delete({ where: { id: parseInt(id) } });

        res.json({ message: "Livre supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du livre :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du livre" });
    }
};

