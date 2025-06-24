const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all locations
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM location");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET a single location by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM location WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Location not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST (create) a new location
router.post("/", async (req, res) => {
  try {
    const { adresse, latitude, longitude } = req.body;
    // Basic validation
    if (!adresse || !latitude || !longitude) {
        return res.status(400).json({ msg: "Please include adresse, latitude, and longitude" });
    }
    const [result] = await pool.query(
      "INSERT INTO location (adresse, latitude, longitude) VALUES (?, ?, ?)",
      [adresse, latitude, longitude]
    );
    // Fetch the newly created location to return it
    const [newLocation] = await pool.query("SELECT * FROM location WHERE id = ?", [result.insertId]);
    res.status(201).json(newLocation[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT (update) a location by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { adresse, latitude, longitude } = req.body;

    // Check if location exists
    const [existing] = await pool.query("SELECT * FROM location WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Location not found" });
    }

    // Build update query dynamically based on provided fields
    let updateFields = [];
    let queryParams = [];
    if (adresse !== undefined) {
        updateFields.push("adresse = ?");
        queryParams.push(adresse);
    }
    if (latitude !== undefined) {
        updateFields.push("latitude = ?");
        queryParams.push(latitude);
    }
    if (longitude !== undefined) {
        updateFields.push("longitude = ?");
        queryParams.push(longitude);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ msg: "No fields provided for update" });
    }

    queryParams.push(id); // Add id for the WHERE clause

    const sql = `UPDATE location SET ${updateFields.join(", ")} WHERE id = ?`;

    await pool.query(sql, queryParams);

    // Fetch the updated location
    const [updatedLocation] = await pool.query("SELECT * FROM location WHERE id = ?", [id]);
    res.json(updatedLocation[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE a location by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if location exists before attempting delete
    const [existing] = await pool.query("SELECT * FROM location WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: "Location not found" });
    }

    // Note: Consider foreign key constraints. Deleting a location might fail
    // if it's referenced by a stop. Handle this appropriately (e.g., cascade delete or prevent deletion).
    const [result] = await pool.query("DELETE FROM location WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        // This case should ideally be caught by the check above, but added for robustness
        return res.status(404).json({ msg: "Location not found" });
    }

    res.json({ msg: "Location deleted successfully" });
  } catch (err) {
    console.error(err.message);
     // Handle foreign key constraint violation error
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ msg: "Cannot delete location because it is referenced by one or more stops." });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;

