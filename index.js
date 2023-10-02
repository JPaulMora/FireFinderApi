const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' })); // allow origin all
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

app.use('/api/v1', require('./v1.js'))
