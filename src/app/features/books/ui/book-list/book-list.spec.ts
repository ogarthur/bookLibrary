import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InMemoryBookService } from '@books/infrastructure';
import { BookStateService } from '@books/infrastructure';
import { Router } from '@angular/router';
import { IBook } from '@books/domain';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { BookListComponent } from './book-list';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let mockBookService: any;
  let mockBookStateService: any;
  let mockRouter: any;

  const mockBooks: IBook[] = [
    { id: '1', title: 'Book 1', author: 'Author 1', genre: 'Fiction', year: '2000' },
    { id: '2', title: 'Book 2', author: 'Author 2', genre: 'Non-Fiction', year: '2001' },
  ];

  beforeEach(async () => {
    // Jasmine spies for service methods
    mockBookService = {
      getBooks: jasmine.createSpy('getBooks').and.returnValue(
        of({
          items: mockBooks,
          totalItems: mockBooks.length,
          totalPages: 1,
          currentPage: 1,
          pageSize: 5,
        }),
      ),
      getTotalBooks: jasmine.createSpy('getTotalBooks').and.returnValue(mockBooks.length),
      addBook: jasmine.createSpy('addBook').and.returnValue(of(true)),
    };

    mockBookStateService = {
      currentPage: signal(1),
      pageSize: signal(5),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [BookListComponent], // standalone component
      providers: [
        { provide: InMemoryBookService, useValue: mockBookService },
        { provide: BookStateService, useValue: mockBookStateService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load books on init', () => {
    expect(mockBookService.getBooks).toHaveBeenCalledWith(1, 5);
    expect(component.books).toEqual(mockBooks);
    expect(component.totalPages).toBe(1);
  });

  it('should go to next page if not last page', () => {
    component.totalPages = 2;
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(mockBookService.getBooks).toHaveBeenCalledWith(2, 5);
  });

  it('should not go to next page if already last page', () => {
    component.totalPages = 1;
    component.nextPage();
    expect(component.currentPage).toBe(1);
  });

  it('should go to previous page if not first page', () => {
    component.bookState.currentPage.set(2);
    component.prevPage();
    expect(component.currentPage).toBe(1);
    expect(mockBookService.getBooks).toHaveBeenCalledWith(1, 5);
  });

  it('should not go to previous page if on first page', () => {
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should open modal when addBook is called', () => {
    component.addBook();
    expect(component.showModal()).toBe(true);
  });

  it('should save book from modal and close modal', () => {
    const newBook: IBook = { id: '', title: 'New Book', author: 'Me', year: 2025 };

    // Mock crypto.randomUUID
    const originalRandomUUID = crypto.randomUUID;
    (crypto as any).randomUUID = () => 'new-id';

    component.onModalSave(newBook);

    expect(mockBookService.addBook).toHaveBeenCalledWith({ ...newBook, id: 'new-id' });
    expect(component.showModal()).toBe(false);

    // Restore original
    (crypto as any).randomUUID = originalRandomUUID;
  });

  it('should close modal when onModalClose is called', () => {
    component.showModal.set(true);
    component.onModalClose();
    expect(component.showModal()).toBe(false);
  });

  it('should navigate to book details', () => {
    component.gotoDetails('1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/library', '1']);
  });
});
