import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductKanbanComponent } from './product-kanban.component';

describe('ProductKanbanComponent', () => {
  let component: ProductKanbanComponent;
  let fixture: ComponentFixture<ProductKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductKanbanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
