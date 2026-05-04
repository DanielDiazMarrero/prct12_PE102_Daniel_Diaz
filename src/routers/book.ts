import express from 'express';
import { Book, BookDocument } from '../models/book.js';
import { controllerPost } from '../controllers/post.js';
import { controllerGET } from '../controllers/get.js';


export const bookRouter = express.Router();

bookRouter.post('/books', async (req, res) => {
  //const book = new Book(req.body);

  try {
    //await book.save()
    const book: BookDocument = await controllerPost(req.body);
    res.status(201).send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

bookRouter.get('/books', async (req, res) => {
  /*const filter = req.query.genre?{genre: req.query.genre.toString()}:{};

  if (filter == null) {  // Si no se uso genre en la query, se busca si se usó author
    const filter = req.query.author?{genre: req.query.author.toString()}:{};
  }*/

  try {
    //const books = await Book.find(filter);

    const books: BookDocument[] = await controllerGET(req.query);

    if (books.length != 0) {
      res.send(books);
    } else {
      res.status(404).send("No se ha encontrado ningún libro");
    }
    
  } catch (error) {
    res.status(500).send(error);
  }
});

bookRouter.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).send("No se ha encontrado libro con ese ID");
    }
    return res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

bookRouter.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send("No se encontró el ID");
    }

    return res.send(book);
  } catch (error) {
    return res.status(400).send();
  }
});


bookRouter.patch('/books/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      error: 'An id must be provided',
    });
  } else if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['title', 'author', 'genre', 'Biography', 'year', 'pages', 'avialble', 'rating'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
                             new: true,
                             runValidators: true,
                           });
        if (!book) {
          res.status(404).send();
        } else {
          res.send(book);
        }
      } catch (error) {
        res.status(500).send(error);
      }
    }
  }
});