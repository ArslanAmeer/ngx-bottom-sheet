import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NgxBottomSheetService} from "ngx-bottom-sheet";

@Component({
  selector: 'app-sample',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleComponent implements OnInit {

  bottomSheetData: any;

  closeFromInside = false;
  showPassedData = false;

  constructor(private readonly _bottomSheetService: NgxBottomSheetService) {
  }

  ngOnInit() {
    if (this.bottomSheetData) {
      console.log('Data from auto populated bottomSheetData property by Bottom Sheet Service: ', this.bottomSheetData);

      console.log('Data from injecting Bottom Service: ', this._bottomSheetService.currentSheetData);

      this.closeFromInside = this.bottomSheetData.closeFromInside;
      this.showPassedData = this.bottomSheetData.text;

    }
  }

  closeDialog(data: any) {
    this._bottomSheetService.close(data);
  }
}
