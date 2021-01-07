const { Router } = require("express");
const Role = require("../models/Role");

const router = Router();

// /api/role/create
router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;
    const curRole = await Role.findOne({ name });
    if (curRole) {
      return res.status(400).json("Такая роль уже существует");
    }
    const role = new Role({ name });
    await role.save();
    res.status(201).json({ message: "Роль успешно добавлена" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/role/get
router.get("/get", async (req, res) => {
  try {
    const roles = await Role.find();
    if (roles) {
      return res.json({ roles: roles });
    } else {
      return res.status(400).json({ message: "Список ролей пуст" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/role/delete
router.delete("/delete", async (req, res) => {
  try {
    const { name } = req.body;
    const role = await Role.findOneAndDelete({ name });
    if (!role) {
      return res.status(400).json("Роль не найдена");
    }
    res.status.json({ message: "Роль успешно удалена" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// /api/role/createFromJSON
router.post("/createFromJSON", async (req, res) => {
  try {
    errMessage = [];
    for (property in req.body) {
      name = req.body[property];
      const curRole = await Role.findOne({ name });
      if (curRole) {
        continue;
      }
      const role = new Role({ name });
      await role.save();
    }
    res
      .status(201)
      .json({ message: "Роли успешно добавлена", errors: errMessage });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
