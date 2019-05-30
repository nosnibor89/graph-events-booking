const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require('mongoose');
const cors = require('cors');

const { schema, resolver } = require("./graphql");
const Auth = require('./middleware/auth');
const PORT = 3001;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(Auth);

app.use(
  "/graphql",
  graphqlHttp({
    schema,
    rootValue: resolver,
    graphiql: true,
  })
);

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds123532.mlab.com:23532/${process.env.MONGO_DB}`)
  .then(_ => {
    app.listen(PORT, () => {
      console.log('Graphl server listening on port ' + PORT);
    });
  })
  .catch(err => console.log(err));
