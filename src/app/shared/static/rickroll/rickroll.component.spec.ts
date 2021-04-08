import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RickrollComponent } from './rickroll.component';

describe('RickrollComponent', () => {
  let component: RickrollComponent;
  let fixture: ComponentFixture<RickrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RickrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RickrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
