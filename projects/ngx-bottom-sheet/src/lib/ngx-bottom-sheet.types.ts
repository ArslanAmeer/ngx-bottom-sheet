// ngx-bottom-sheet.interfaces.ts

import {ComponentRef} from "@angular/core";
import {Subject} from "rxjs";
import {NgxBottomSheetComponent} from "./ngx-bottom-sheet.component";

export interface BottomSheetConfig {
  data?: BottomSheetDataRef;
  width?: 'small' | 'medium' | 'large' | 'full' | string;
  height?: 'full' | 'top' | 'mid' | 'quarter' | string;
  borderRadius?: string;
  backgroundColor?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

/**
 * The data to be passed to the bottom sheet.
 * @property {any} [key] - The data to be passed to the bottom sheet.
 * @example
 * // Example of passing data to the bottom sheet
 * const bottomSheetRef = this._bottomSheetService.open(SampleComponenet, {
 *  height: 'quarter',
 *  showCloseButton: false,
 *  backgroundColor: 'transparent',
 *  data: {
 *  text: 'Task',
 *  showReportButton: true
 *  }
 */
export interface BottomSheetDataRef {
  [key: string]: any;
}

export interface BottomSheetInstance {
  ref: ComponentRef<NgxBottomSheetComponent>;
  afterClosedSubject: Subject<any>;
  backdropElement: HTMLElement;
  config?: BottomSheetConfig;
}
