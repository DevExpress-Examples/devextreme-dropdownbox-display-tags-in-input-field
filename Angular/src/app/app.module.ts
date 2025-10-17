import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';
import { DxTreeViewModule } from 'devextreme-angular/ui/tree-view';
import { DxTagBoxModule } from 'devextreme-angular/ui/tag-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxTemplateModule } from 'devextreme-angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    DxTagBoxModule,
    DxTextBoxModule,
    DxTemplateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
