import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthersComponent } from './authers.component';

describe('AuthersComponent', () => {
  let component: AuthersComponent;
  let fixture: ComponentFixture<AuthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
