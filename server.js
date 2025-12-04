const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const votersRoutes = require('./routes/voters');
const appointmentsRoutes = require('./routes/appointments');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/voters', votersRoutes);
app.use('/api/appointments', appointmentsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CICS Voters API running', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
