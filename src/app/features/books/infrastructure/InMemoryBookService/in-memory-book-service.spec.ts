import { TestBed } from '@angular/core/testing';
import { IBook } from '@books/domain';
import { DEFAULT_BOOKS } from '@books/utils/demo.constants';
import { firstValueFrom } from 'rxjs';
import { InMemoryBookService } from './in-memory-book-service';

describe('InMemoryBookService', () => {
  let service: InMemoryBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemoryBookService],
    });
    service = TestBed.inject(InMemoryBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return paginated books', async () => {
    const result = await firstValueFrom(service.getBooks(1, 2));
    expect(result.items.length).toBe(2);
    expect(result.totalItems).toBe(DEFAULT_BOOKS.length);
    expect(result.totalPages).toBe(Math.ceil(DEFAULT_BOOKS.length / 2));
  });

  it('should return total books count', () => {
    const total = service.getTotalBooks();
    expect(total).toBe(DEFAULT_BOOKS.length);
  });

  it('should get a book by id', async () => {
    const book = DEFAULT_BOOKS[0];
    const result = await firstValueFrom(service.getBookById(book.id));
    expect(result).toEqual(book);
  });

  it('should add a new book', async () => {
    const newBook: IBook = {
      id: 'new-book',
      title: 'Test',
      author: 'Me',
      genre: 'Fiction',
      year: '2025',
    };
    await firstValueFrom(service.addBook(newBook));
    const total = service.getTotalBooks();
    expect(total).toBe(DEFAULT_BOOKS.length + 1);

    const addedBook = await firstValueFrom(service.getBookById('new-book'));
    expect(addedBook).toEqual(newBook);
  });

  it('should update an existing book', async () => {
    const bookToUpdate = { ...DEFAULT_BOOKS[0], title: 'Updated Title' };
    await firstValueFrom(service.updateBook(bookToUpdate));

    const updatedBook = await firstValueFrom(service.getBookById(bookToUpdate.id));
    expect(updatedBook?.title).toBe('Updated Title');
  });

  it('should delete a book', async () => {
    const bookToDelete = DEFAULT_BOOKS[0];
    await firstValueFrom(service.deleteBook(bookToDelete.id));

    const deletedBook = await firstValueFrom(service.getBookById(bookToDelete.id));
    expect(deletedBook).toBeUndefined();
    expect(service.getTotalBooks()).toBe(DEFAULT_BOOKS.length - 1);
  });
});
