import {
  Component,
  ViewChild,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

import CustomStore from "devextreme/data/custom_store";
import { DxTreeViewComponent } from "devextreme-angular";
import Popup from "devextreme/ui/popup";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent;
  treeDataSource: any;
  treeBoxValue: string[];
  
  constructor(private httpClient: HttpClient) {
    this.treeDataSource = this.makeAsyncDataSource(this.httpClient, 'treeProducts.json');
    this.treeBoxValue = ['1_1', '1_1_1'];
  }

  makeAsyncDataSource(http: HttpClient, jsonFile: string) {
    return new CustomStore({
      loadMode: "raw",
      key: "ID",
      load(): Promise<any> {
        return http
          .get(
            `https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/${jsonFile}`
          )
          .toPromise();
      }
    });
  }

  onDropDownBoxValueChanged(e: any) {
    this.updateSelection(this.treeView && this.treeView.instance);
  }

  onTreeViewReady(e: any) {
    this.updateSelection(e.component);
  }

  updateSelection(treeView: any) {
    if (!treeView) return;
    
    if (!this.treeBoxValue) {
      treeView.unselectAll();
    }

    if (this.treeBoxValue) {
      this.treeBoxValue.forEach(((value) => {
        treeView.selectItem(value);
      }));
    }

    let element = document.querySelector("#myDropDownBox .dx-dropdowneditor-overlay");
    if (element) {
      let popup = Popup.getInstance(element) as Popup,
        scrollable = treeView.getScrollable(),
        scrollTop = scrollable.scrollTop();
        popup.repaint();
        scrollable.scrollTo(scrollTop);
    }
  }

  onTreeViewSelectionChanged(e: any) {
    this.treeBoxValue = e.component.getSelectedNodeKeys();
  }

  onTagBoxValueChanged(e: any) {
    if (!this.treeView) return;
    this.treeView.instance.unselectAll();
    this.updateSelection(this.treeView.instance);
  }
}
