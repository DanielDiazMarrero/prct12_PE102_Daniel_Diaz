import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Book } from "../src/models/book.js";

const firstBook = {
  title: "La Venganza de los Sith",
  author: "George Lucas",
  isbn: "1122445577889"
}

beforeEach(async () => {
  await Book.deleteMany();
  await new Book(firstBook).save();
})

describe("POST /books", () => {
  test("Should successfully create a new book", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "El Ataque de los Clones",
        author: "George Lucas",
        isbn: "1122331144556",
      })
      .expect(201);
  });

  test("Should succesfully get the book", async () => {
    await request(app)
      .get(`/books?author="George Lucas"`)
      .expect(200);
  });

  test("Should successfully update a book", async () => {
    const book = await request(app)
                     .get(`/books?author="George Lucas"`);

    await request(app)
      .patch(`/books/${book._body[0]._id}`)
      .send({
        title: "El Ataque de los Clones II"
      })
      .expect(200);
  });

  test("Should successfully delete a book", async () => {
    const book = await request(app)
                     .get(`/books?author="George Lucas"`);

    await request(app)
      .delete(`/books/${book._body[0]._id}`)
      .expect(200);
  });
});