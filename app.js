const express = require("express");
const app = express();
const routes = require("./routes/routes.js");
const cors = require("cors");
const port = 3030;

app.use(cors({ origin: "*" }));
// app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

routes(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
