import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnerAIDashboardComponent } from './conner-ai-dashboard.component';

describe('ConnerAIDashboardComponent', () => {
  let component: ConnerAIDashboardComponent;
  let fixture: ComponentFixture<ConnerAIDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnerAIDashboardComponent]
    });
    fixture = TestBed.createComponent(ConnerAIDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
