const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'Missing username or password' });

    const exists = await User.findOne({ where: { username } });
    if (exists) return res.status(409).json({ message: 'User exists' });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password_hash: hash,
      role: 'admin'
    });

    res.status(201).json({
      admin_id: user.admin_id,
      username: user.username,
      role: user.role,
    });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { admin_id: user.admin_id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '8h' }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { register, login };
