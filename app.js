const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 5000;
app.use(express.json());

let movies = [];

fs.readFile("./movies.json", (err, data) => {
  movies = JSON.parse(data.toString());
});

function addToFile(movie) {
  fs.writeFile("./movies.json", JSON.stringify(movie), () => {
    console.log("Completed successfully ✅");
  });
}

/////////////////////////////////////////////////GET
// Show all movies
app.get("/movies", (req, res) => {
  const movie = movies.filter((item) => !item.isDeleted);
  res.status(200).json(movie);
});

// Show movie by id (query)
app.get("/movie", (req, res) => {
  const { id } = req.query;

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

// Show favorite movies
app.get("/favMov", (req, res) => {
  const movie = movies.filter((item) => item.isFav == true && !item.isDeleted); // item.isFav == true >>> item.isFav
  res.status(200).json(movie);
});

/////////////////////////////////////////////////POST
// Add new movie
app.post("/addMov", (req, res) => {
  const { movName } = req.body;

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

/////////////////////////////////////////////////PUT
// Update favorite (params)
app.put("/updateMov/:id", (req, res) => {
  const { id } = req.params;

  let found = false;

  movies.forEach((item) => {
    if (id == item.id) {
      if (item.isDeleted) {
        res.status(404).json("Not found");
      } else {
        item.isFav = !item.isFav;
        found = true;
        addToFile(movies);
        res.status(200).json(movies);
      }
    }
  });

  if (found) {
    res.status(404).json("Not found");
  }
});

app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { movName, isFav, isDeleted } = req.body;

  let found = false;

  movies.forEach((item) => {
    if (id == item.id) {
      if (item.isDeleted) {
        res.status(404).json("Not found");
      } else {
        if (movName != undefined) item.movName = movName;
        if (isFav != undefined) item.isFav = isFav;
        if (isDeleted != undefined) item.isFav = isDeleted;
        found = true;
        addToFile(movies);
        res.status(200).json(movies);
      }
    }
  });

  if (found) {
    res.status(404).json("Not found");
  }
});

/////////////////////////////////////////////////DELETE
// Delete movie (params)
app.delete("/deleMov/:id", (req, res) => {
  const { id } = req.params;

  let found = false;

  movies.forEach((item) => {
    if (id == item.id) {
      if (item.isDeleted) {
        res.status(404).json("Not found");
      } else {
        item.isDeleted = true;
        found = true;
        addToFile(movies);
        res.status(200).json(movies);
      }
    }
  });
  if (found) {
    res.status(404).json("Not found");
  }
});

app.listen(PORT, () => {
  console.log("server is running");
});
