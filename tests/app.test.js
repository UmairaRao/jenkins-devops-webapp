const request = require("supertest");
const { app, validateTask } = require("../src/app");

describe("Task validation function", () => {
  test("should return true for valid task", () => {
    expect(validateTask("Complete Jenkins assignment")).toBe(true);
  });

  test("should return false for task shorter than 3 characters", () => {
    expect(validateTask("Hi")).toBe(false);
  });

  test("should return false for empty task", () => {
    expect(validateTask("")).toBe(false);
  });
});

describe("Health route", () => {
  test("GET /health should return application status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("OK");
    expect(response.body.message).toBe("Application is running");
  });
});
