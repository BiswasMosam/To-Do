const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workflow = require('../models/Workflow');

// Get user's workflow data
router.get('/', auth, async (req, res) => {
  try {
    let workflow = await Workflow.findOne({ user: req.user.id });
    if (!workflow) {
      workflow = await Workflow.create({ user: req.user.id, tasks: [], connections: [] });
    }
    res.json(workflow);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user's workflow data
router.post('/', auth, async (req, res) => {
  const { tasks, connections } = req.body;
  try {
    let workflow = await Workflow.findOne({ user: req.user.id });
    if (workflow) {
      workflow.tasks = tasks;
      workflow.connections = connections;
      await workflow.save();
    } else {
      workflow = await Workflow.create({
        user: req.user.id,
        tasks,
        connections
      });
    }
    res.json(workflow);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
