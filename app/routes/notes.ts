import { Router } from "express";
import { getManager } from "typeorm";
import { v4 as uuid } from "uuid";

import { wrap } from "../utils";
import { NoteEntity } from "../entities";

export const notesRouter = Router();

// メモを追加する処理
notesRouter.post(
  "/api/notes",
  wrap(async (req, res) => {
    const title: string = req.body.title || "";
    const body: string = req.body.body || "";

    if (!title || !body) {
      res.sendStatus(400);
      return;
    }

    const mgr = getManager();
    const result = await mgr.save(NoteEntity, {
      id: uuid(),
      title,
      body,
    });

    res.status(201).json(result);
  })
);

// メモを読み込む処理
notesRouter.get(
  "/api/notes/:id",
  wrap(async (req, res) => {
    const id: string = req.params.id || "";

    if (!id) {
      res.sendStatus(400); // bad request
      return;
    }

    const mgr = getManager();
    const result = await mgr.findOne(NoteEntity, { id });

    if (!result) {
      res.sendStatus(404); // not found
      return;
    }
    res.status(200).json(result);
  })
);

// メモを削除する処理
notesRouter.delete(
  "/api/notes/:id",
  wrap(async (req, res) => {
    const id: string = req.params.id || "";

    if (!id) {
      res.sendStatus(400);
      return;
    }
    const mgr = getManager();
    const result = await mgr.findOne(NoteEntity, { id });

    if (!result) {
      res.sendStatus(404);
      return;
    }

    await mgr.delete(NoteEntity, { id });
    res.sendStatus(204);
  })
);
