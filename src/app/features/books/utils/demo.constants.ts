import { IBook } from '@books/domain';

export const DEFAULT_BOOKS = [
  {
    id: '1',
    title: "Old Man's War",
    author: 'John Scalzi',
    year: '2005',
    genre: 'Science Fiction',
    coverUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1509467059i/36510196.jpg',
  },
  {
    id: '2',
    title: 'Do Androids Dream of Electric Sheep?',
    author: 'Philip K. Dick',
    year: '1968',
    genre: 'Science Fiction',
    coverUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1519481930i/7082.jpg',
  },
  {
    id: '3',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    year: '1953',
    genre: 'Science Fiction',
    coverUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1469704347i/17470674.jpg',
  },
  {
    id: '4',
    title: 'Neuromancer',
    author: 'William Gibson',
    year: '1984',
    genre: 'Science Fiction',
    coverUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1629659965i/826097.jpg',
  },
  {
    id: '5',
    title: 'The Forever War',
    author: 'Joe Haldeman',
    year: '1974',
    genre: 'Science Fiction',
    coverUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386852511i/21611.jpg',
  },
  {
    id: '6',
    title: 'Kafka on the Shore',
    author: 'Haruki Murakami',
    year: '2002',
    genre: 'Magical Realism',
    coverUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1335198823i/7741999.jpg',
  },
  {
    id: '7',
    title: '1Q84',
    author: 'Haruki Murakami',
    year: '2009',
    genre: 'Magical Realism',
    coverUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1483103331i/10357575.jpg',
  },
  {
    id: '8',
    title: 'The Wind-Up Bird Chronicle',
    author: 'Haruki Murakami',
    year: '1994',
    genre: 'Magical Realism',
    coverUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327872639i/11275.jpg',
  },
] as unknown as IBook[];
