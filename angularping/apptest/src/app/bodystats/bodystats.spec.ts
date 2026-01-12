import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bodystats } from './bodystats';

describe('Bodystats', () => {
  let component: Bodystats;
  let fixture: ComponentFixture<Bodystats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bodystats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bodystats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
