const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');

require('dotenv').config();

const database = require('./config/database');

const taskAppVer1 = require('./api/v1/routes/index.route');

database.connect();
const app = express();
app.use(bodyParser.json());
app.use(cors());

taskAppVer1(app);

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
})
