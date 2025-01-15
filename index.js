const express = require('express');
const routerApi = require('./routes');
const cors = require('cors');
const app = express();
const port = 3999;

const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error-handler');

app.use(express.json()); // Middleware para parsear JSON
app.use(cors());
app.get('/', (req, res) => {
  res.send('SAYCE!');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
