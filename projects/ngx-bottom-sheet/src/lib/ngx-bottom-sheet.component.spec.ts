import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxBottomSheetComponent } from './ngx-bottom-sheet.component';

describe('NgxBottomSheetComponent', () => {
  let component: NgxBottomSheetComponent;
  let fixture: ComponentFixture<NgxBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxBottomSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
