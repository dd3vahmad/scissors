import request from "supertest";
import app from "../../../../app";

describe("POST /api/v1", () => {
  it("returns status code 201 for successful user registration", async () => {
    const res = await request(app)
      .post("/api/v1/signup")
      .send({ firstname: "Ahmad" });

    expect(res.statusCode).toEqual(201);
  });
});
