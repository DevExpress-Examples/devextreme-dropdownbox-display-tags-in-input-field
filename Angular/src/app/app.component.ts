import {
  Component,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import CustomStore from 'devextreme/data/custom_store';
import { DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import Popup from 'devextreme/ui/popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
