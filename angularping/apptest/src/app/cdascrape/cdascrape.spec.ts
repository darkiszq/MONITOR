import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cdascrape } from './cdascrape';

describe('Cdascrape', () => {
  let component: Cdascrape;
  let fixture: ComponentFixture<Cdascrape>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cdascrape]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cdascrape);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
