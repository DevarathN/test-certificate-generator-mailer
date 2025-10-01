const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const routes = require('./src/routes');

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json({ limit: '100kb' }));

app.use('/api', routes);
app.get('/', (req, res) => res.send('Certificate service running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
