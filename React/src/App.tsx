import {
  useCallback, useRef, useState,
} from 'react';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView, { type TreeViewTypes, type TreeViewRef } from 'devextreme-react/tree-view';
import TagBox, { type TagBoxTypes } from 'devextreme-react/tag-box';
import CustomStore from 'devextreme/data/custom_store';

function makeAsyncDataSource(jsonFile: string): CustomStore {
  return new CustomStore({
    loadMode: 'raw',
    key: 'ID',
    load(): Promise<unknown> {
      return fetch(
        `https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/${jsonFile}`,
      ).then((response) => response.json());
    },
  });
}

const dataSource = makeAsyncDataSource('treeProducts.json');

function App(): JSX.Element {
  const treeViewRef = useRef<TreeViewRef>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>(['1_1']);

  const syncTreeViewSelection = useCallback((treeViewInstance: any, value: string[]) => {
    if (!treeViewInstance) return;

    treeViewInstance.unselectAll();

    if (value.length > 0) {
      value.forEach((item: string) => {
        treeViewInstance.selectItem(item);
      });
    }
  }, []);

  const onTreeViewContentReady = useCallback((e: TreeViewTypes.ContentReadyEvent) => {
    const treeViewInstance = e.component;
    syncTreeViewSelection(treeViewInstance, selectedValues);
  }, [selectedValues, syncTreeViewSelection]);

  const onTreeViewSelectionChanged = useCallback((e: TreeViewTypes.ItemSelectionChangedEvent) => {
    const selectedKeys = e.component.getSelectedNodeKeys();
    setSelectedValues(selectedKeys);
  }, []);

  const onTagBoxValueChanged = useCallback((e: TagBoxTypes.ValueChangedEvent) => {
    setSelectedValues(e.value);
    const treeViewInstance = treeViewRef.current?.instance();
    syncTreeViewSelection(treeViewInstance, e.value);
  }, [syncTreeViewSelection]);

  const fieldRender = useCallback(() => (
    <TagBox
      dataSource={dataSource}
      value={selectedValues}
      valueExpr="ID"
      displayExpr="name"
      showClearButton={true}
      placeholder={selectedValues?.length ? '' : 'Select a value...'}
      openOnFieldClick={false}
      width="100%"
      onValueChanged={onTagBoxValueChanged}
    />
  ), [selectedValues, onTagBoxValueChanged]);

  const contentRender = useCallback(() => (
    <TreeView
      ref={treeViewRef}
      dataSource={dataSource}
      dataStructure="plain"
      keyExpr="ID"
      parentIdExpr="categoryId"
      selectionMode="multiple"
      displayExpr="name"
      selectByClick={true}
      onContentReady={onTreeViewContentReady}
      selectNodesRecursive={false}
      showCheckBoxesMode="normal"
      onItemSelectionChanged={onTreeViewSelectionChanged}
    />
  ), [onTreeViewContentReady, onTreeViewSelectionChanged]);

  return (
    <div className="dx-fieldset">
      <div className="dx-field">
        <div className="dx-field-label">DropDownBox with embedded TreeView</div>
        <div className="dx-field-value">
          <DropDownBox
            value={selectedValues}
            valueExpr="ID"
            displayExpr="name"
            dataSource={dataSource}
            fieldRender={fieldRender}
            contentRender={contentRender}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
