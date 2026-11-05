import { Request, Response } from "express";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
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

/** Compare un mot de passe saisi avec un hash "sel:hash" stocké en base. */
const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
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

/**
 * Authentification fictive : vérifie le couple login / mot de passe et renvoie
 * l'utilisateur (sans mot de passe). Aucun jeton n'est émis (JWT prévu plus tard).
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { login, password } = req.body;

  if (typeof login !== "string" || typeof password !== "string" || !login || !password) {
    res.status(400).json({ message: "Login et mot de passe requis." });
    return;
  }

  try {
    // unscoped() pour récupérer le hash, exclu par le defaultScope
    const user = await Users.unscoped().findOne({ where: { login } });
    if (!user || !(await verifyPassword(password, user.password))) {
      res.status(401).json({ message: "Login ou mot de passe incorrect." });
      return;
    }
    const { password: _hidden, ...publicUser } = user.toJSON();
    res.status(200).json(publicUser);
  } catch (err: unknown) {
    res.status(500).json({ message: "Erreur lors de la connexion: " + errorMessage(err) });
  }
};

export default { getAll, getById, create, update, remove, login };
