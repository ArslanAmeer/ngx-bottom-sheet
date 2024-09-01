import { Component } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { SampleComponent } from './sample/sample.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-bottom-sheet-demo';

  constructor(private readonly _bottomSheetService: NgxBottomSheetService) {}

  openBottomSheet() {
    this._bottomSheetService.open(SampleComponent, {
      height: '50%',
      closeOnBackdropClick: false,
    });
  }
}
