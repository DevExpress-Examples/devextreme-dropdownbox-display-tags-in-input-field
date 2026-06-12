import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import CustomStore from 'devextreme/data/custom_store';
import { DxTreeViewModule, DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import Popup from 'devextreme/ui/popup';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';
import { DxTagBoxModule } from 'devextreme-angular/ui/tag-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxTemplateModule } from 'devextreme-angular/core';

@Component({
  imports: [DxDropDownBoxModule, DxTreeViewModule, DxTagBoxModule, DxTextBoxModule, DxTemplateModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('treeView', { static: false }) treeView!: DxTreeViewComponent;

  treeDataSource: CustomStore;

  treeBoxValue: string[];

  constructor(private readonly httpClient: HttpClient) {
    this.treeDataSource = this.makeAsyncDataSource(this.httpClient, 'treeProducts.json');
    this.treeBoxValue = ['1_1'];
  }

  makeAsyncDataSource(http: HttpClient, jsonFile: string): CustomStore {
    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load(): Promise<unknown> {
        return http
          .get(
            `https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/${jsonFile}`,
          )
          .toPromise();
      },
    });
  }

  onDropDownBoxValueChanged(): void {
    this.updateSelection(this.treeView?.instance);
  }

  onTreeViewReady(e: DxTreeViewTypes.ContentReadyEvent): void {
    this.updateSelection(e.component);
  }

  updateSelection(treeView: any): void {
    if (!treeView) return;

    if (!this.treeBoxValue) {
      treeView.unselectAll();
    }

    if (this.treeBoxValue) {
      this.treeBoxValue.forEach((value) => {
        treeView.selectItem(value);
      });
    }

    const element = document.querySelector('#myDropDownBox .dx-dropdowneditor-overlay');
    if (element) {
      const popup = Popup.getInstance(element) as Popup;
      const scrollable = treeView.getScrollable();
      const scrollTop = scrollable.scrollTop();
      popup.repaint();
      scrollable.scrollTo(scrollTop);
    }
  }

  onTreeViewSelectionChanged(e: DxTreeViewTypes.ItemSelectionChangedEvent): void {
    this.treeBoxValue = e.component.getSelectedNodeKeys();
  }

  onTagBoxValueChanged(): void {
    if (!this.treeView) return;
    const instance = this.treeView.instance;
    if (!instance) return;
    instance.unselectAll();
    this.updateSelection(instance);
  }
}
