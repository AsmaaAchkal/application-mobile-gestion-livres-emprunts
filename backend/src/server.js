import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import livreRoutes from "./routes/livreRoutes.js";
import empruntRoutes from "./routes/empruntRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/livres", livreRoutes);
app.use("/api/emprunts", empruntRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
