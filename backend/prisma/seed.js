import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hachage des mots de passe
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);

  // Création des utilisateurs
  const user1 = await prisma.user.create({
    data: {
      nom: 'Dupont',
      prenom: 'Jean',
      telephone: '0123456789',
      email: 'jean.dupont1@example.com',
      password: hashedPassword1, // Mot de passe haché
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nom: 'Martin',
      prenom: 'Claire',
      telephone: '0987654321',
      email: 'claire.martin@example.com',
      password: hashedPassword2, // Mot de passe haché
      role: 'ADMIN',
    },
  });

  // Création des livres
  const book1 = await prisma.livre.create({
    data: {
      titre: 'Le Petit Prince',
      auteur: 'Antoine de Saint-Exupéry',
      datePublication: new Date('1943-04-06'),
      description: 'Un conte poétique et philosophique.',
      categorie: 'Philosophie',
      isbn: '978-0156012195',
      langue: 'Français',
      nbPages: 96,
      disponible: true,
    },
  });

  const book2 = await prisma.livre.create({
    data: {
      titre: '1984',
      auteur: 'George Orwell',
      datePublication: new Date('1949-06-08'),
      description: 'Une dystopie sur un régime totalitaire.',
      categorie: 'Science-fiction',
      isbn: '978-0451524935',
      langue: 'Anglais',
      nbPages: 328,
      disponible: true,
    },
  });

  const book3 = await prisma.livre.create({
    data: {
      titre: 'La Peste',
      auteur: 'Albert Camus',
      datePublication: new Date('1947-09-10'),
      description: 'Une réflexion sur l’absurdité de la condition humaine.',
      categorie: 'Roman',
      isbn: '978-2070403323',
      langue: 'Français',
      nbPages: 300,
      disponible: true,
    },
  });

  // Création des emprunts
  await prisma.emprunt.createMany({
    data: [
      {
        userId: user1.id,
        livreId: book1.id,
        dateEmprunt: new Date('2025-03-01'),
        dateRetour: null, // Non retourné
      },
      {
        userId: user1.id,
        livreId: book2.id,
        dateEmprunt: new Date('2025-03-10'),
        dateRetour: null, // Non retourné
      },
      {
        userId: user2.id,
        livreId: book3.id,
        dateEmprunt: new Date('2025-03-20'),
        dateRetour: new Date('2025-03-30'), // Retourné
      },
    ],
  });

  // Mise à jour de la disponibilité des livres
  await prisma.livre.updateMany({
    where: { id: { in: [book1.id, book2.id] } },
    data: { disponible: false }, // Non disponibles car empruntés
  });

  await prisma.livre.update({
    where: { id: book3.id },
    data: { disponible: true }, // Disponible car retourné
  });

  console.log('✅ Données de test insérées avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
