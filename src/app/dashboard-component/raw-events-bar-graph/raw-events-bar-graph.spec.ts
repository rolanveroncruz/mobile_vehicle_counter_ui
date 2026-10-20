import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawEventsBarGraph } from './raw-events-bar-graph';

describe('RawEventsBarGraph', () => {
  let component: RawEventsBarGraph;
  let fixture: ComponentFixture<RawEventsBarGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawEventsBarGraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawEventsBarGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
