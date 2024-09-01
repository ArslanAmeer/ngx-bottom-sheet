import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetComponent } from './ngx-bottom-sheet.component';
import { NgxBottomSheetService } from './ngx-bottom-sheet.service';

@NgModule({
  imports: [CommonModule],
  providers: [NgxBottomSheetService],
})
export class BottomSheetModule {}
