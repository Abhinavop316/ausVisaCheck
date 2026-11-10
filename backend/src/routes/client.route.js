const express = require("express");

const router = express.Router();

const clientController = require("../controllers/client.controller");

// Create a new client
router.post("/clients", clientController.createClient);
router.post("/get-client", clientController.getAClients);
router.put("/clients/:id", clientController.editClient);
router.get("/test-email", clientController.testEmail);
router.post("/test-email", clientController.testEmail);

module.exports = router;