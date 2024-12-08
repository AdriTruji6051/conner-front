import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCantityComponent } from './modify-cantity.component';

describe('ModifyCantityComponent', () => {
  let component: ModifyCantityComponent;
  let fixture: ComponentFixture<ModifyCantityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyCantityComponent]
    });
    fixture = TestBed.createComponent(ModifyCantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
