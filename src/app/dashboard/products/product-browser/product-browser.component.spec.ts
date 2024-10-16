import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBrowserComponent } from './product-browser.component';

describe('ProductBrowserComponent', () => {
  let component: ProductBrowserComponent;
  let fixture: ComponentFixture<ProductBrowserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductBrowserComponent]
    });
    fixture = TestBed.createComponent(ProductBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
