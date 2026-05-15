const express = require("express");
const { pool } = require("./db");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function validateTask(task) {
  return typeof task === "string" && task.trim().length >= 3;
}

app.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM todos ORDER BY id DESC");

  const listItems = rows
    .map((todo) => `<li>${todo.task}</li>`)
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Jenkins DevOps Web App</title>
      </head>
      <body>
        <h1>Jenkins DevOps Web App</h1>
        <p>This is a simple Node.js web application using MySQL database.</p>

        <form method="POST" action="/add">
          <input name="task" placeholder="Enter task" required />
          <button type="submit">Add Task</button>
        </form>

        <h2>Saved Tasks</h2>
        <ul>${listItems}</ul>
      </body>
    </html>
  `);
});

app.post("/add", async (req, res) => {
  const { task } = req.body;

  if (!validateTask(task)) {
    return res.status(400).send("Task must contain at least 3 characters.");
  }

  await pool.query("INSERT INTO todos (task) VALUES (?)", [task.trim()]);
  res.redirect("/");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Application is running"
  });
});

module.exports = {
  app,
  validateTask
};
