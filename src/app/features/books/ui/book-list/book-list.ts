import { Component, inject, signal, OnInit } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card';
import { IBook } from '@books/domain';
import { Router } from '@angular/router';
import { BookStateService, HttpBookService, InMemoryBookService } from '@books/infrastructure';
import { BookFormModalComponent } from '../book-form-modal/book-form-modal';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-book-list',
  imports: [BookCardComponent, BookFormModalComponent, CommonModule, FontAwesomeModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookListComponent implements OnInit {
  iBookService = !environment.useHttpBooks ? inject(InMemoryBookService) : inject(HttpBookService);
  bookState = inject(BookStateService);
  router = inject(Router);

  books = [] as IBook[];
  totalPages = 1;

  showModal = signal(false);
  faPlus = faPlus;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  ngOnInit() {
    this.loadBooks();
  }

  get currentPage() {
    return this.bookState.currentPage();
  }

  get pageSize() {
    return this.bookState.pageSize();
  }

  loadBooks() {
    this.iBookService.getBooks(this.currentPage, this.pageSize).subscribe((result) => {
      this.books = result.items;
      this.totalPages = result.totalPages;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.bookState.currentPage.set(this.currentPage + 1);
      this.loadBooks();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.bookState.currentPage.set(this.currentPage - 1);
      this.loadBooks();
    }
  }

  goToPage(page: number) {
    this.bookState.currentPage.set(page);
    this.loadBooks();
  }

  addBook() {
    this.showModal.set(true);
  }

  onModalSave(book: IBook) {
    book.id = crypto.randomUUID();
    this.iBookService.addBook(book);

    const totalBooks = this.iBookService.getTotalBooks();
    const lastPage = Math.ceil(totalBooks / this.pageSize);
    this.bookState.currentPage.set(lastPage);
    this.loadBooks();

    this.showModal.set(false);
  }

  onModalClose() {
    this.showModal.set(false);
  }

  gotoDetails(bookId: string) {
    this.router.navigate(['/library', bookId]);
  }
}
