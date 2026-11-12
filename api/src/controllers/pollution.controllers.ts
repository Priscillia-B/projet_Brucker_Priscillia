import { Request, Response } from "express";
import { ValidationError } from "sequelize";
import db from "../models";
import { parseId, sendServerError } from "../utils/http.utils";
import { PollutionCreationAttributes } from "../models/pollutions.model";

const Pollutions = db.pollutions;

const pickFields = (body: Record<string, unknown>): PollutionCreationAttributes => ({
  titre: body.titre as string,
  type: body.type as string,
  description: body.description as string,
  date: body.date as string,
  lieu: body.lieu as string,
  latitude: body.latitude as number,
  longitude: body.longitude as number,
  photoUrl: (body.photoUrl as string) || null,
  indice: body.indice === undefined || body.indice === null || body.indice === ""
    ? null
    : Number(body.indice)
});

/**
 * Récupère la liste de toutes les mesures de pollution depuis la base PostgreSQL.
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.findAll({
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    sendServerError(res, "Erreur lors de la récupération des données de pollution", err);
  }
};

/**
 * Récupère une mesure de pollution par son identifiant.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req);
  try {
    const data = await Pollutions.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    sendServerError(res, `Erreur lors de la récupération de la pollution id=${id}`, err);
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.create(pickFields(req.body));
    res.status(201).json(data);
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      res.status(400).json({ message: "Données invalides: " + err.message });
      return;
    }
    sendServerError(res, "Erreur lors de la création de la pollution", err);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req);
  try {
    const pollution = await Pollutions.findByPk(id);
    if (!pollution) {
      res.status(404).json({ message: `Aucune pollution trouvée avec l'id=${id}.` });
      return;
    }
    await pollution.update(pickFields(req.body));
    res.status(200).json(pollution);
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      res.status(400).json({ message: "Données invalides: " + err.message });
      return;
    }
    sendServerError(res, `Erreur lors de la modification de la pollution id=${id}`, err);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req);
  try {
    const deleted = await Pollutions.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: `Aucune pollution trouvée avec l'id=${id}.` });
    }
  } catch (err: unknown) {
    sendServerError(res, `Erreur lors de la suppression de la pollution id=${id}`, err);
  }
};

export default { getAll, getById, create, update, remove };
