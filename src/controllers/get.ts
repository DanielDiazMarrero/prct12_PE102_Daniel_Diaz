import { Book, BookDocument } from '../models/book.js';

export const controllerGET = (query: any) => {
  const filter = query.genre?{genre: query.genre.toString()}:{};

  if (filter == null) {  // Si no se uso genre en la query, se busca si se usó author
    const filter = query.author?{genre: query.author.toString()}:{};
  }

  return new Promise<BookDocument[]>(async (resolve, reject) => {

    try {
      const books: BookDocument[] = await Book.find(filter);
      resolve(books)
    } catch (error) {
      reject(error)
    }
  })
}