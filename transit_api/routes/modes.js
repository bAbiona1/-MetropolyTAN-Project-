const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all modes
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM mode");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET a single mode by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM mode WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Mode not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST (create) a new mode
router.post("/", async (req, res) => {
  try {
    const { libelle } = req.body;
    // Basic validation
    if (!libelle) { // Check for undefined id as well
        return res.status(400).json({ msg: "Please include id and libelle" });
    }
    const [result] = await pool.query(
      "INSERT INTO mode (libelle) VALUES (?)",
      [libelle]
    );
    // Fetch the newly created mode
    const [newMode] = await pool.query("SELECT * FROM mode WHERE id = ?", [result.insertId]);
    res.status(201).json(newMode[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ msg: "Mode with this ID already exists" });
    }
    res.status(500).send("Server Error");
  }
});

// PUT (update) a mode by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { libelle } = req.body;

    // Check if mode exists
    const [existing] = await pool.query("SELECT * FROM mode WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Mode not found" });
    }

    if (libelle === undefined) {
        return res.status(400).json({ msg: "Libelle is required for update" });
    }

    await pool.query("UPDATE mode SET libelle = ? WHERE id = ?", [libelle, id]);

    // Fetch the updated mode
    const [updatedMode] = await pool.query("SELECT * FROM mode WHERE id = ?", [id]);
    res.json(updatedMode[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE a mode by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if mode exists
    const [existing] = await pool.query("SELECT * FROM mode WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Mode not found" });
    }

    // Note: Consider foreign key constraints. Deleting a mode might fail
    // if it's referenced by a line.
    const [result] = await pool.query("DELETE FROM mode WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Mode not found" });
    }

    res.json({ msg: "Mode deleted successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ msg: "Cannot delete mode because it is referenced by one or more lines." });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;

