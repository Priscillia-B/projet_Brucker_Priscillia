import { Request, Response } from "express";

/** Récupère l'identifiant numérique passé dans l'URL (/:id). */
export const parseId = (req: Request): number => {
  const paramId = req.params.id;
  return Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);
};

/**
 * Renvoie une erreur 500 avec le contexte au client.
 * Le détail technique de l'erreur (SQL, noms de tables...) reste dans les logs serveur.
 */
export const sendServerError = (res: Response, context: string, err: unknown): void => {
  console.error(`[500] ${context}`, err);
  res.status(500).json({ message: `${context}. Veuillez réessayer plus tard.` });
};
