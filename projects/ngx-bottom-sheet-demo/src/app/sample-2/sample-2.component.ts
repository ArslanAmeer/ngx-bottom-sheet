import {Component} from '@angular/core';
import {NgxBottomSheetService} from "ngx-bottom-sheet";

@Component({
  selector: 'app-sample-2',
  standalone: true,
  imports: [],
  templateUrl: './sample-2.component.html',
  styleUrl: './sample-2.component.scss'
})
export class Sample2Component {

  constructor(private readonly bottomSheetService: NgxBottomSheetService) {
  }


  closeSheet() {
    this.bottomSheetService.close();
  }
}
