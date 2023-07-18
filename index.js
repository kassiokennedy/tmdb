const axios = require("axios");

// --- EXPRESS
const express = require("express");
const app = express();
app.use(express.json());

// --- BODY-PARSER
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Configuração do EJS como template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

///////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  // const movieName = req.body.name;
  const movieName = req.query.movieName;
  console.log(movieName);
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.themoviedb.org/3/search/movie?api_key=2ef4c3907d49dff86e4c50f9eb6db17f&language=pt-BR&query=${movieName}&page=1&include_adult=false`,
    headers: {},
  };

  axios
    .request(config)
    .then((response) => {
      var filme, i, overview, releaseDate;

      // for (i = 0; i < response.data.results.length; i++) {
      //   if (response.data.results[i].title) {
      //     filme = response.data.results[i].title;
      //     // overview = response.data.results[i].overview;
      //     releaseDate = response.data.results[i].release_date.substring(0, 4);
      //     console.log(`\n'${filme}' de ${releaseDate}.\n${overview}.\n`);
      //   }
      // }

      // res.send(response.data.results[0].overview);
      const filmes = response.data.results;
      res.render("index", { filmes });
    })
    .catch((error) => {
      console.log(error);
    });
});

///////////////////////////////////////////////////////////////////////////////
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`----- Servidor rodando em http://localhost:${PORT} -----`);
});
///////////////////////////////////////////////////////////////////////////////
