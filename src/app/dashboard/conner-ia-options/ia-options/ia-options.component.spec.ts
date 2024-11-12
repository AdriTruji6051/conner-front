import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaOptionsComponent } from './ia-options.component';

describe('IaOptionsComponent', () => {
  let component: IaOptionsComponent;
  let fixture: ComponentFixture<IaOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IaOptionsComponent]
    });
    fixture = TestBed.createComponent(IaOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
