import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook } from '@books/domain';
import { HttpBookService, InMemoryBookService } from '@books/infrastructure';
import { NotificationService } from '@core/services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'environments/environment';
import { BookFormModalComponent } from '../book-form-modal/book-form-modal';

@Component({
  selector: 'app-book-detail',
  imports: [FontAwesomeModule, BookFormModalComponent],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetailComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  iBookService = !environment.useHttpBooks ? inject(InMemoryBookService) : inject(HttpBookService);

  notificationService = inject(NotificationService);

  book: IBook | undefined;
  faEdit = faEdit;
  faTrash = faTrash;
  faArrowLeft = faArrowLeft;

  showModal = signal(false);

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.iBookService.getBookById(bookId).subscribe({
        next: (book) => {
          this.book = book;
        },
        error: (err) => {
          console.error('Failed to fetch book:', err);
          this.notificationService.showError('Failed to fetch book');
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/library']);
  }

  editBook() {
    console.log('Edit book clicked');
    this.showModal.set(true);
  }

  deleteBook() {
    if (!this.book) return;
    const confirmed = window.confirm('Are you sure you want to delete this book?');
    if (!confirmed) return;

    this.iBookService.deleteBook(this.book.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Book deleted successfully');
        this.router.navigate(['/library']);
      },
      error: (err: any) => {
        console.error('Failed to delete book:', err);
        this.notificationService.showError('Failed to delete book');
      },
    });
  }

  onModalSave(book: IBook) {
    book.id = crypto.randomUUID();
    this.iBookService.addBook(book);

    this.showModal.set(false);
  }

  onModalClose() {
    this.showModal.set(false);
  }
}
