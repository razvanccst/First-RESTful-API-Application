const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//SETUP MongoDB

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//HTTP VERBS -
//REST GET (Get all Articles from DB)

// app.get("/articles", function (req, res) {
//   Article.find(function (err, articles) {
//     if (!err) {
//       res.send(articles);
//     } else {
//       res.send(err);
//     }
//   });
// });

// // REST POST - Via Postman

// app.post("/articles", function (req, res) {
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   newArticle.save(function (err) {
//     if (!err) {
//       res.send("Successfully added a new article");
//     } else {
//       res.send(err);
//     }
//   });
// });

// // REST DELETE - Delete all articles - Via Postman

// app.delete("/articles", function (req, res) {
//   Article.deleteMany(
//     /*{condition}*/ function (err) {
//       if (!err) {
//         res.send("Successfully deleted all articles");
//       } else {
//         res.send(err);
//       }
//     }
//   );
// });

// ADDING ROUTE - Code Refactoring adding route
// app.route("/articles").get().post().delete();

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, articles) {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(
      /*{condition}*/ function (err) {
        if (!err) {
          res.send("Successfully deleted all articles");
        } else {
          res.send(err);
        }
      }
    );
  });

//Get specific article

app
  .route("/articles/:articleTitle") // get article by title -- NOTE ":" added before choosen route name
  .get(function (req, res) {
    // read from DB
    // search by requested parameter
    console.log(req.params.articleTitle);

    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title is found.");
        }
      }
    );
  })

  // PUT REQUEST - chained to above GET SPECIFIC
  // Routing to the "Get Specific article" the new PUT method

  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle }, // selecting specific article
      { title: req.body.title, content: req.body.content }, // setting the new title and content via POSTMAN
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Succesfully updated article");
        }
      }
    );
  })

  // PATCH REQUEST - UPDATE GIVEN ARTICLE

  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle }, // selecting specific article by route
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successful updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  // DELETE SPECIFIC ITEM REQUEST

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successful deleted specific article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
