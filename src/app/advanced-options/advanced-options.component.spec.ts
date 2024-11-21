import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedOptionsComponent } from './advanced-options.component';

describe('AdvancedOptionsComponent', () => {
  let component: AdvancedOptionsComponent;
  let fixture: ComponentFixture<AdvancedOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedOptionsComponent]
    });
    fixture = TestBed.createComponent(AdvancedOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
