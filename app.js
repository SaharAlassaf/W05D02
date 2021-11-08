const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 5000;
app.use(express.json());

function addToFile(movie) {
  fs.writeFile("./movies.json", JSON.stringify(movie), () => {
    console.log("Completed successfully ✅");
  });
}

/////////////////////////////////////////////////GET
// Show all movies
app.get("/movies", (req, res) => {
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());

    const movie = movies.filter((item) => !item.isDeleted);

    res.status(200).json(movie);
  });
});

// Show movie by id (query)
app.get("/movie", (req, res) => {
  const { id } = req.query;
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());

    movies.forEach((item) => {
      if (id == item.id) {
        if (item.isDeleted) {
          res.status(404).json("Not found");
        } else {
          const movie = movies.filter((item) => item.id == id);
          res.status(200).json(movie);
        }
      }
    });

  });
});

// Show favorite movies
app.get("/favMov", (req, res) => {
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());

    const movie = movies.filter((item) => item.isFav == true && !item.isDeleted);

    res.status(200).json(movie);
  });
});

/////////////////////////////////////////////////POST
// Add new movie
app.post("/addMov", (req, res) => {
  const { movName } = req.body;
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());

    movies.forEach((item) => {
      if (movName.trim() === item.movName.trim()) {
        res.status(404).json("Already exists");
      } else {
        movies.push({
          id: movies.length,
          movName: movName,
          isFav: false,
          isDeleted: false,
        });
        addToFile(movies);
        res.status(200).json(movies);
      }
    });

  });
});

/////////////////////////////////////////////////PUT
// Update favorite
app.put("/updateMov/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());

    movies.forEach((item) => {
      if (id == item.id) {
        if (item.isDeleted) {
          res.status(404).json("Not found");
        } else {
          item.isFav = !item.isFav;
          addToFile(movies);
          res.status(200).json(movies);
        }
      }
    });

  });
});

/////////////////////////////////////////////////DELETE
// Delete movie
app.delete("/deleMov/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());

    movies.forEach((item) => {
      if (id == item.id) {
        if (item.isDeleted) {
          res.status(404).json("Not found");
        } else {
          item.isDeleted = true;
          addToFile(movies);
          res.status(200).json(movies);
        }
      }
    });

  });
});

app.listen(PORT, () => {
  console.log("server is running");
});
