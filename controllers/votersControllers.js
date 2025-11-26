const { Voter } = require('../models');

async function createVoter(req, res) {
  try {
    const payload = req.body;

    if (!payload.first_name || !payload.last_name)
      return res.status(400).json({ message: 'first_name and last_name required' });

    const voter = await Voter.create(payload);
    res.status(201).json(voter);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllVoters(req, res) {
  try {
    const voters = await Voter.findAll();
    res.json(voters);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getVoter(req, res) {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (!voter) return res.status(404).json({ message: 'Voter not found' });
    res.json(voter);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateVoter(req, res) {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (!voter) return res.status(404).json({ message: 'Not found' });
    await voter.update(req.body);
    res.json(voter);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteVoter(req, res) {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (!voter) return res.status(404).json({ message: 'Not found' });
    await voter.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { createVoter, getAllVoters, getVoter, updateVoter, deleteVoter };
