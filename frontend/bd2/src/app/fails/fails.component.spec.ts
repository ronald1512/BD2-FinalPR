import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailsComponent } from './fails.component';

describe('FailsComponent', () => {
  let component: FailsComponent;
  let fixture: ComponentFixture<FailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
