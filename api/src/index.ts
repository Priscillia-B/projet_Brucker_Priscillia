import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import db from "./models";
import initRoutes from "./routes";

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  exposedHeaders: "Authorization"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// health checks
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to Pollution API." });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

db.sequelize
  .sync()
  .then(async () => {
    console.log("Synced db.");
    try {
      const count = await db.pollutions.count();
      if (count === 0) {
        await db.pollutions.bulkCreate([
          {
            titre: "Déchets plastiques sur la plage",
            type: "Plastique",
            description: "Bouteilles et sacs abandonnés sur le sable.",
            date: "2024-05-12",
            lieu: "Plage du Prado, Marseille",
            latitude: 43.2767,
            longitude: 5.3725,
            photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800"
          },
          {
            titre: "Déversement suspect",
            type: "Chimique",
            description: "Liquide verdâtre s'écoulant d'une canalisation.",
            date: "2024-06-20",
            lieu: "Le Rhône, Lyon",
            latitude: 45.75,
            longitude: 4.85
          },
          {
            titre: "Dépôt de gravats",
            type: "Dépôt sauvage",
            description: "Gravats de chantier jetés en forêt.",
            date: "2024-07-05",
            lieu: "Forêt de Fontainebleau",
            latitude: 48.4047,
            longitude: 2.7016
          },
          {
            titre: "Sacs plastiques flottant dans le port",
            type: "Eau",
            description: "Une dizaine de sacs et films plastiques dérivent entre les bateaux, près du quai.",
            date: "2024-08-22",
            lieu: "Vieux-Port, Marseille",
            latitude: 43.2951,
            longitude: 5.374,
            photoUrl: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800"
          },
          {
            titre: "Fumées noires d'une cheminée d'usine",
            type: "Air",
            description: "Panache de fumée noire et odeur âcre observés en fin de journée, plusieurs jours d'affilée.",
            date: "2024-09-14",
            lieu: "Zone industrielle, Fos-sur-Mer",
            latitude: 43.4378,
            longitude: 4.9447
          }
        ]);
        console.log("Jeu de données initial pour la table pollution inséré avec succès.");
      }
    } catch (seedErr: unknown) {
      console.warn("Remarque : impossible d'insérer les données d'initialisation :", seedErr);
    }
  })
  .catch((err: Error) => {
    console.log("Failed to sync db: " + err.message);
  });


initRoutes(app);

// set port, listen on 0.0.0.0 for Render and container environments
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}.`);
});

export default app;
