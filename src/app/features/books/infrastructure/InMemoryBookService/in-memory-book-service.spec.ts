import { TestBed } from '@angular/core/testing';
import { IBook } from '@books/domain';
import { DEFAULT_BOOKS } from '@books/utils/demo.constants';
import { LoggerService, NotificationService } from '@core/services';
import { InMemoryBookService } from './in-memory-book-service';

describe('InMemoryBookService', () => {
  let service: InMemoryBookService;
  let loggerService: LoggerService;
  let notificationService: NotificationService;

  beforeEach(() => {
    const loggerMock = { log: jasmine.createSpy('log') };
    const notificationMock = { showSuccess: jasmine.createSpy('showSuccess') };

    TestBed.configureTestingModule({
      providers: [
        InMemoryBookService,
        { provide: LoggerService, useValue: loggerMock },
        { provide: NotificationService, useValue: notificationMock },
      ],
    });

    service = TestBed.inject(InMemoryBookService);
    loggerService = TestBed.inject(LoggerService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all books with pagination', (done) => {
    service.getBooks().subscribe((result:any) => {
      expect(result.items.length).toBeLessThanOrEqual(5); // default pageSize
      expect(result.totalItems).toBe(DEFAULT_BOOKS.length);
      expect(result.totalPages).toBe(Math.ceil(DEFAULT_BOOKS.length / 5));
      done();
    });
  });

  it('should return a book by ID', (done) => {
    const book = DEFAULT_BOOKS[0];
    service.getBookById(book.id).subscribe((result:any) => {
      expect(result).toEqual(book);
      done();
    });
  });

  it('should add a new book', (done) => {
    const newBook: IBook = {
      id: 'new', title: 'New Book', author: 'Author',
      year: '',
      genre: ''
    };
    service.addBook(newBook).subscribe((success) => {
      expect(success).toBeTrue();
      expect(service.getTotalBooks()).toBe(DEFAULT_BOOKS.length + 1);
      expect(loggerService.log).toHaveBeenCalledWith('Added book:', newBook);
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Book added successfully');
      done();
    });
  });

  it('should update an existing book', (done) => {
    const book = { ...DEFAULT_BOOKS[0], title: 'Updated Title' };
    service.updateBook(book).subscribe((success:any) => {
      expect(success).toBeTrue();
      service.getBookById(book.id).subscribe((updatedBook:any) => {
        expect(updatedBook?.title).toBe('Updated Title');
        expect(loggerService.log).toHaveBeenCalledWith('Updated book with id:', book.id);
        expect(notificationService.showSuccess).toHaveBeenCalledWith('Book updated successfully');
        done();
      });
    });
  });

  it('should delete a book', (done) => {
    const bookId = DEFAULT_BOOKS[0].id;
    service.deleteBook(bookId).subscribe((success:any) => {
      expect(success).toBeTrue();
      service.getBookById(bookId).subscribe((deletedBook:any) => {
        expect(deletedBook).toBeUndefined();
        expect(loggerService.log).toHaveBeenCalledWith('Deleted book with id:', bookId);
        expect(notificationService.showSuccess).toHaveBeenCalledWith('Book deleted successfully');
        done();
      });
    });
  });
});
