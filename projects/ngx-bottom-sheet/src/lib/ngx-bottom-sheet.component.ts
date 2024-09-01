import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from './ngx-bottom-sheet.service';

@Component({
  selector: 'ngx-bottom-sheet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #container [ngClass]="{ 'padding-top': showCloseButton }"></div>
    <span
      *ngIf="showCloseButton"
      class="close-button"
      (click)="closeBottomSheet()"
    >
      <i>
        <svg
          class="svg-icon"
          style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"
          />
        </svg>
      </i>
    </span>
  `,
  styleUrls: ['./ngx-bottom-sheet.component.scss'],
})
export class NgxBottomSheetComponent {
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;
  showCloseButton = true; // Default value
  constructor(private readonly _bottomSheetService: NgxBottomSheetService) {}

  closeBottomSheet(): void {
    this._bottomSheetService.close();
  }
}
