const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
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

app.listen(3000);
