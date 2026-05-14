import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, medicationsTable } from "@workspace/db";
import {
  CreateMedicationBody,
  UpdateMedicationBody,
  UpdateMedicationParams,
  GetMedicationParams,
  DeleteMedicationParams,
  MarkMedicationTakenParams,
  MarkMedicationTakenBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/medications/summary", async (req, res) => {
  try {
    const meds = await db.select().from(medicationsTable);
    const total = meds.length;
    const taken = meds.filter((m) => m.taken).length;
    const pending = total - taken;
    const takenPercent = total > 0 ? Math.round((taken / total) * 100) : 0;
    res.json({ total, taken, pending, takenPercent });
  } catch (err) {
    req.log.error({ err }, "Failed to get medication summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/medications", async (req, res) => {
  try {
    const meds = await db
      .select()
      .from(medicationsTable)
      .orderBy(medicationsTable.scheduledTime);
    res.json(meds);
  } catch (err) {
    req.log.error({ err }, "Failed to list medications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/medications", async (req, res) => {
  const parsed = CreateMedicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [med] = await db
      .insert(medicationsTable)
      .values({
        name: parsed.data.name,
        scheduledTime: parsed.data.scheduledTime,
        notes: parsed.data.notes ?? null,
      })
      .returning();
    res.status(201).json(med);
  } catch (err) {
    req.log.error({ err }, "Failed to create medication");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/medications/:id", async (req, res) => {
  const parsed = GetMedicationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [med] = await db
      .select()
      .from(medicationsTable)
      .where(eq(medicationsTable.id, parsed.data.id));
    if (!med) {
      res.status(404).json({ error: "Medication not found" });
      return;
    }
    res.json(med);
  } catch (err) {
    req.log.error({ err }, "Failed to get medication");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/medications/:id", async (req, res) => {
  const paramsParsed = UpdateMedicationParams.safeParse({
    id: Number(req.params.id),
  });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = UpdateMedicationBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }
  try {
    const updates: Partial<typeof medicationsTable.$inferInsert> = {};
    if (bodyParsed.data.name !== undefined) updates.name = bodyParsed.data.name;
    if (bodyParsed.data.scheduledTime !== undefined)
      updates.scheduledTime = bodyParsed.data.scheduledTime;
    if ("notes" in bodyParsed.data) updates.notes = bodyParsed.data.notes ?? null;

    const [med] = await db
      .update(medicationsTable)
      .set(updates)
      .where(eq(medicationsTable.id, paramsParsed.data.id))
      .returning();
    if (!med) {
      res.status(404).json({ error: "Medication not found" });
      return;
    }
    res.json(med);
  } catch (err) {
    req.log.error({ err }, "Failed to update medication");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/medications/:id", async (req, res) => {
  const parsed = DeleteMedicationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const result = await db
      .delete(medicationsTable)
      .where(eq(medicationsTable.id, parsed.data.id))
      .returning();
    if (result.length === 0) {
      res.status(404).json({ error: "Medication not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete medication");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/medications/:id/taken", async (req, res) => {
  const paramsParsed = MarkMedicationTakenParams.safeParse({
    id: Number(req.params.id),
  });
  if (!paramsParsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const bodyParsed = MarkMedicationTakenBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }
  try {
    const [med] = await db
      .update(medicationsTable)
      .set({ taken: bodyParsed.data.taken })
      .where(eq(medicationsTable.id, paramsParsed.data.id))
      .returning();
    if (!med) {
      res.status(404).json({ error: "Medication not found" });
      return;
    }
    res.json(med);
  } catch (err) {
    req.log.error({ err }, "Failed to update medication taken status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
