import { Request, Response } from "express";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { UniqueConstraintError, ValidationError } from "sequelize";
import db from "../models";

const Users = db.users;
const scryptAsync = promisify(scrypt);

const parseId = (req: Request): number => {
  const paramId = req.params.id;
  return Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);
};

const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

/** Hache le mot de passe avec un sel aléatoire, au format "sel:hash". */
const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Users.findAll({
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs: " + errorMessage(err)
    });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req);
  try {
    const data = await Users.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: `Aucun utilisateur trouvé avec l'id=${id}.` });
    }
  } catch (err: unknown) {
    res.status(500).json({
      message: `Erreur lors de la récupération de l'utilisateur id=${id}: ` + errorMessage(err)
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { login, prenom, nom, email, password } = req.body;

  if (typeof password !== "string" || password.length < 6) {
    res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    return;
  }

  try {
    const user = await Users.create({
      login,
      prenom,
      nom,
      email,
      password: await hashPassword(password)
    });
    const { password: _hidden, ...publicUser } = user.toJSON();
    res.status(201).json(publicUser);
  } catch (err: unknown) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({ message: "Ce login ou cet email est déjà utilisé." });
      return;
    }
    if (err instanceof ValidationError) {
      res.status(400).json({ message: "Données invalides: " + err.message });
      return;
    }
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur: " + errorMessage(err)
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req);
  const { login, prenom, nom, email, password } = req.body;

  if (password !== undefined && (typeof password !== "string" || password.length < 6)) {
    res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    return;
  }

  try {
    const user = await Users.findByPk(id);
    if (!user) {
      res.status(404).json({ message: `Aucun utilisateur trouvé avec l'id=${id}.` });
      return;
    }
    await user.update({
      login,
      prenom,
      nom,
      email,
      ...(password ? { password: await hashPassword(password) } : {})
    });
    const { password: _hidden, ...publicUser } = user.toJSON();
    res.status(200).json(publicUser);
  } catch (err: unknown) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({ message: "Ce login ou cet email est déjà utilisé." });
      return;
    }
    if (err instanceof ValidationError) {
      res.status(400).json({ message: "Données invalides: " + err.message });
      return;
    }
    res.status(500).json({
      message: `Erreur lors de la modification de l'utilisateur id=${id}: ` + errorMessage(err)
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req);
  try {
    const deleted = await Users.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: `Aucun utilisateur trouvé avec l'id=${id}.` });
    }
  } catch (err: unknown) {
    res.status(500).json({
      message: `Erreur lors de la suppression de l'utilisateur id=${id}: ` + errorMessage(err)
    });
  }
};

export default { getAll, getById, create, update, remove };
