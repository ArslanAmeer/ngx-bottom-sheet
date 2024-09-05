import {Component} from '@angular/core';
import {NgxBottomSheetService} from 'ngx-bottom-sheet';
import {SampleComponent} from './sample/sample.component';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-bottom-sheet-demo';
  input = '';

  constructor(private readonly _bottomSheetService: NgxBottomSheetService) {
  }

  openBottomSheet() {
    this._bottomSheetService.open(SampleComponent, {
      height: 'mid',
      closeOnBackdropClick: false,
    });
  }


  openBottomSheetToCLoseFromBackdropClick() {
    this._bottomSheetService.open(SampleComponent, {
      height: 'mid',
      closeOnBackdropClick: true,
    });
  }

  openBottomSheetWithCloseFromInsideComponent() {
    this._bottomSheetService.open(SampleComponent, {
      height: 'top',
      closeOnBackdropClick: false,
      data: {
        closeFromInside: true
      }
    }).afterClosed$.subscribe((data: any) => {
      console.log('Data from inside component: ', data);
    });
  }


  openBottomSheetAndPassData() {
    this._bottomSheetService.open(SampleComponent, {
      height: '50%',
      closeOnBackdropClick: false,
      data: {
        text: this.input
      },
    })
  }
}
