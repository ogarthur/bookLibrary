import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFormModal } from './book-form-modal';

describe('BookFormModal', () => {
  let component: BookFormModal;
  let fixture: ComponentFixture<BookFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
