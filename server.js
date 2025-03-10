require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 3000;

app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

const Gadget = sequelize.define("Gadget", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Available", "Deployed", "Destroyed", "Decommissioned"),
    defaultValue: "Available",
  },
});

sequelize.sync();

const generateCodename = () => {
  const codenames = ["Gadget A", "Gadget B", "Gadget C", "Gadget D"];
  return codenames[Math.floor(Math.random() * codenames.length)];
};

// GET: Retrieve all gadgets
app.get("/gadgets", async (req, res) => {
  const gadgets = await Gadget.findAll();
  const gadgetsWithProbability = gadgets.map((gadget) => ({
    ...gadget.toJSON(),
  }));
  res.json(gadgetsWithProbability);
});

// POST: Add a new gadget
app.post("/gadgets", async (req, res) => {
  const newGadget = await Gadget.create({ name: generateCodename() });
  res.status(201).json(newGadget);
});

// PATCH: Update a gadget
app.patch("/gadgets/:id", async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const gadget = await Gadget.findByPk(id);
  
  if (!gadget) return res.status(404).json({ message: "Gadget not found" });
  
  await gadget.update({ name, status });
  res.json(gadget);
});

// DELETE: Decommission a gadget
app.delete("/gadgets/:id", async (req, res) => {
  const { id } = req.params;
  const gadget = await Gadget.findByPk(id);
  if (!gadget) return res.status(404).json({ message: "Gadget not found" });

  await gadget.update({ status: "Decommissioned", decommissionedAt: new Date() });
  res.json({ message: "Gadget decommissioned", gadget });
});

// POST: Self-destruct sequence
app.post("/gadgets/:id/self-destruct", async (req, res) => {
  const { id } = req.params;
  const gadget = await Gadget.findByPk(id);
  if (!gadget) return res.status(404).json({ message: "Gadget not found" });

  const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  await gadget.update({ status: "Destroyed" });

  res.json({ message: "Self-destruct initiated", confirmationCode, gadget });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
