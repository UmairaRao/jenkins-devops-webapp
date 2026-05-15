const express = require("express");
const { pool } = require("./db");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function validateTask(task) {
  return typeof task === "string" && task.trim().length >= 3;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

app.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM todos ORDER BY id DESC");

  const listItems = rows.length
    ? rows
        .map(
          (todo) => `
            <div class="task-card">
              <div class="task-icon">✓</div>
              <div>
                <p class="task-title">${escapeHtml(todo.task)}</p>
                <p class="task-meta">Stored in MySQL database</p>
              </div>
            </div>
          `
        )
        .join("")
    : `<p class="empty-state">No tasks added yet. Add your first task above.</p>`;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jenkins DevOps Web App</title>
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a, #1e293b, #334155);
            color: #0f172a;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 16px;
          }

          .container {
            width: 100%;
            max-width: 980px;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
          }

          .hero {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #ffffff;
            padding: 42px;
          }

          .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.18);
            border: 1px solid rgba(255, 255, 255, 0.35);
            border-radius: 999px;
            padding: 8px 14px;
            font-size: 13px;
            margin-bottom: 18px;
          }

          h1 {
            font-size: 42px;
            line-height: 1.1;
            margin-bottom: 14px;
          }

          .hero p {
            font-size: 17px;
            max-width: 720px;
            line-height: 1.6;
            opacity: 0.95;
          }

          .content {
            padding: 34px 42px 42px;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
            margin-bottom: 28px;
          }

          .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 18px;
          }

          .info-card h3 {
            font-size: 15px;
            color: #1e293b;
            margin-bottom: 8px;
          }

          .info-card p {
            font-size: 14px;
            color: #64748b;
            line-height: 1.5;
          }

          .form-box {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 22px;
            margin-bottom: 30px;
          }

          .form-box h2,
          .tasks-section h2 {
            font-size: 22px;
            margin-bottom: 14px;
            color: #0f172a;
          }

          form {
            display: flex;
            gap: 12px;
          }

          input {
            flex: 1;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 14px 16px;
            font-size: 15px;
            outline: none;
          }

          input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
          }

          button {
            border: none;
            border-radius: 12px;
            padding: 14px 22px;
            background: #2563eb;
            color: #ffffff;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
          }

          button:hover {
            background: #1d4ed8;
          }

          .task-list {
            display: grid;
            gap: 12px;
          }

          .task-card {
            display: flex;
            align-items: center;
            gap: 14px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          }

          .task-icon {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #dcfce7;
            color: #166534;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
          }

          .task-title {
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
          }

          .task-meta {
            color: #64748b;
            font-size: 13px;
          }

          .empty-state {
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            color: #64748b;
            padding: 18px;
            border-radius: 14px;
          }

          .footer {
            margin-top: 30px;
            padding-top: 18px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 13px;
          }

          @media (max-width: 760px) {
            .hero,
            .content {
              padding: 28px;
            }

            h1 {
              font-size: 32px;
            }

            .grid {
              grid-template-columns: 1fr;
            }

            form {
              flex-direction: column;
            }

            button {
              width: 100%;
            }
          }
        </style>
      </head>

      <body>
        <main class="container">
          <section class="hero">
            <span class="badge">CI/CD Demo Application</span>
            <h1>Jenkins DevOps Web App</h1>
            <p>
              A containerized Node.js and MySQL web application created for demonstrating
              GitHub integration, unit testing, Docker deployment, and Jenkins pipeline automation.
            </p>
          </section>

          <section class="content">
            <div class="grid">
              <div class="info-card">
                <h3>Build</h3>
                <p>Application dependencies are installed and the project is prepared for execution.</p>
              </div>

              <div class="info-card">
                <h3>Test</h3>
                <p>Jest unit tests validate application logic and health-check routes.</p>
              </div>

              <div class="info-card">
                <h3>Deploy</h3>
                <p>Docker Compose runs the web application with a MySQL database container.</p>
              </div>
            </div>

            <div class="form-box">
              <h2>Add New Task</h2>
              <form method="POST" action="/add">
                <input name="task" placeholder="Example: Complete Jenkins assignment" required />
                <button type="submit">Add Task</button>
              </form>
            </div>

            <div class="tasks-section">
              <h2>Saved Tasks</h2>
              <div class="task-list">
                ${listItems}
              </div>
            </div>

            <div class="footer">
              Node.js • Express • MySQL • Docker • Jenkins Pipeline
            </div>
          </section>
        </main>
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
