require("dotenv").config();

const { app } = require("./app");
const { initDb } = require("./db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
