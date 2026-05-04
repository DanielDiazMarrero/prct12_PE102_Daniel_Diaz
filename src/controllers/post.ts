import { Book, BookDocument } from '../models/book.js';
import express from 'express';

export const controllerPost = (body: any) => {
  return new Promise<BookDocument>(async (resolve, reject) => {
    const book = new Book(body);

    try {
      await book.save()
      resolve(book);
    } catch (error) {
      reject(error);
    }
  })
}