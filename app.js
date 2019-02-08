const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require('mongoose');
const { schema, resolver } = require("./graphql");

const app = express();
app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema,
    rootValue: resolver,
    graphiql: true,
  })
);

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds123532.mlab.com:23532/${process.env.MONGO_DB}`)
  .then(_ => app.listen(3000))
  .catch(err => console.log(err));
