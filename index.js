require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");

const mailgun = require("mailgun-js")({
  apiKey: process.env.api_key,
  domain: process.env.domain,
});
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

app.post("/", (req, res) => {
  /* CREATION DE L'OBJET DATA */
  //   console.log(req.fields);
  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: process.env
      .MY_EMAIL /* EMAIL AVEC LAQUELLE VOUS VOUS ÊTES ENREGISTRÉS SUR MAILGUN */,
    subject: "Formulaire",
    text: req.fields.message,
  };
  //   console.log(data);

  mailgun.messages().send(data, (error, body) => {
    console.log(body);
    console.log(error);
    if (!error) {
      return res.json(body);
    }
    res.status(401).json(error);
  });
});

app.all("*", (req, res) => {
  res.status(400).json({ error: error.message });
});

app.listen(3000, () => {
  console.log("Server has started");
});
