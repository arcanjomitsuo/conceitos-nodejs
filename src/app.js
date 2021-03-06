const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(req, res, next) {
  const { id } = req.params;
 
  res.locals.repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (res.locals.repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found'});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const {repositoryIndex} = response.locals;

  const repo = repositories.find(repository => repository.id === id);

  const repository = {id, url, title, techs, likes: repo.likes};

  repositories[repositoryIndex] = repository;

  console.log('repo', repository);

  return response.json(repository);

});

app.delete("/repositories/:id", validateRepositoryId, (req, res) => {
 
  const {repositoryIndex} = res.locals;

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  repository.likes += 1;

  return response.json(repository)
});

module.exports = app;
