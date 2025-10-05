import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IBook } from '@books/domain';

@Component({
  selector: 'app-book-form-modal',
  templateUrl: './book-form-modal.html',
  styleUrl: './book-form-modal.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class BookFormModalComponent implements OnChanges {
  @Input() title = 'Add Book';
  @Input() book!: IBook | undefined;
  @Output() saved = new EventEmitter<IBook>();
  @Output() closed = new EventEmitter<void>();

  fb = inject(FormBuilder);

  bookForm = this.fb.group({
    title: [this.book ? this.book.title : '', [Validators.required, Validators.minLength(1)]],
    author: [this.book ? this.book.author : '', [Validators.required, Validators.minLength(2)]],
    year: [
      this.book ? Number(this.book.year) : '',
      [Validators.required, Validators.min(0), Validators.max(new Date().getFullYear())],
    ],
    genre: [this.book ? this.book.genre : '', [Validators.required]],
    coverUrl: [
      this.book ? this.book.coverUrl : '',
      [Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif)$/i)],
    ],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['book'] && this.book) {
      console.log('BookFormModalComponent - ngOnChanges - book changed:', this.book);
      this.bookForm.patchValue({
        title: this.book.title,
        author: this.book.author,
        year: Number(this.book.year),
        genre: this.book.genre,
        coverUrl: this.book.coverUrl,
      });
      // Force all controls to be touched so validation errors show
      this.bookForm.markAllAsTouched();

      // Update validity
      this.bookForm.updateValueAndValidity();
    }
  }

  submit() {
    this.saved.emit(this.bookForm.value as IBook);
    this.close();
  }

  close() {
    this.closed.emit();
  }
}
