import { Component, Input } from '@angular/core';
import { IBook } from '@books/domain';

@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCardComponent {
  @Input() book!: IBook;
}
