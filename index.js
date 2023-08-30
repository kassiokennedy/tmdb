const axios = require("axios");
// ---------- .ENV ----------------------------------------

require("dotenv").config();
const api_key = process.env.API_KEY;
const url = process.env.URL;

// ---------- EXPRESS ----------------------------------------

const express = require("express");
const app = express();
app.use(express.json());

// ---------- BODY-PARSER ----------------------------------------

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Configuração do EJS como template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

///////////////////////////////////////////////////////////////////////////////
//https://developer.themoviedb.org/reference/search-movie
app.get("/", (req, res) => {
  const movieName = req.query.movieName;
  const type = "movie";
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${url}/3/search/${type}?api_key=${api_key}&language=pt-BR&query=${movieName}&page=1&include_adult=false`,
    headers: {},
  };

  axios
    .request(config)
    .then((response) => {
      var filme, i, releaseDate;
      const overview = response.data.overview;
      const nPages = response.data.total_pages;
      const total_results = response.data.total_results;
      const filmes = response.data.results;
      console.log(`-----------------------------------------------------`);
      console.log(
        `-----------Pesquisa: ${movieName}\nTotal de páginas: ${nPages}\nTotal de resultados: ${total_results}`
      );
      // busca dentro de cada página da pesquisa
      for (let page = 1; page <= nPages; page++) {
        config.url = `https://api.themoviedb.org/3/search/${type}?api_key=${api_key}&language=pt-BR&query=${movieName}&page=${page}&include_adult=false`;

        axios
          .request(config)
          .then((response) => {
            //mostra o resultado referente a cada pagina
            console.log(`---------- Página ${page} ----------`);
            const filmes = response.data.results;
            // iteraçao da busca
            for (i = 0; i < filmes.length; i++) {
              if (filmes[i].title) {
                filme = filmes[i].title;
                releaseDate = filmes[i].release_date.substring(0, 4);
                console.log(
                  `\n'${i}: ${filme}' de ${releaseDate}.\n${overview}.\n`
                );
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // Após a iteração, envie os resultados para a página web
      // const filmes = response.data.results;
      res.render("index", { filmes, movieName, nPages });
    })
    .catch((error) => {
      console.log(error);
    });
});

// app.get("/", (req, res) => {
//   // const movieName = req.body.name;
//   const movieName = req.query.movieName;
//   console.log(movieName);
//   let config = {
//     method: "get",
//     maxBodyLength: Infinity,
//     url: `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=pt-BR&query=${movieName}&page=2&include_adult=false`,
//     headers: {},
//   };

//   axios
//     .request(config)
//     .then((response) => {
//       var filme, i, overview, releaseDate;

//       // for (i = 0; i < response.data.results.length; i++) {
//       //   if (response.data.results[i].title) {
//       //     filme = response.data.results[i].title;
//       //     // overview = response.data.results[i].overview;
//       //     releaseDate = response.data.results[i].release_date.substring(0, 4);
//       //     console.log(`\n'${filme}' de ${releaseDate}.\n${overview}.\n`);
//       //   }
//       // }

//       // res.send(response.data.results[0].overview);
//       const filmes = response.data.results;
//       res.render("index", { filmes });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

///////////////////////////////////////////////////////////////////////////////
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`----- Servidor rodando em http://localhost:${PORT} -----`);
});
///////////////////////////////////////////////////////////////////////////////
p;
