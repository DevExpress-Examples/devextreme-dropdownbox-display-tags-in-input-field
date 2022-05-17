import './App.css';
import 'devextreme/dist/css/dx.light.css';

import React, { useCallback, useEffect, useRef, useState } from "react";
import DropDownBox from "devextreme-react/drop-down-box";
import TreeView from "devextreme-react/tree-view";
import TagBox from "devextreme-react/tag-box";
import TextBox from "devextreme-react/text-box";
import CustomStore from "devextreme/data/custom_store";
import "whatwg-fetch";

const treeDataSource = new CustomStore({
  loadMode: "raw",
  key: "ID",
  load() {
    return fetch(
      `https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/treeProducts.json`
    ).then((response) => response.json());
  }
});

const renderTagBox = (treeBoxValue, setTreeBoxValue) => () => {
  const onValueChanged = useCallback(({ value }) => {
    setTreeBoxValue(value);
  }, []);

  return (<div>
    <TextBox visible={false} />
    <TagBox
      dataSource={treeDataSource}
      value={treeBoxValue}
      valueExpr="ID"
      displayExpr="name"
      onValueChanged={onValueChanged}
      openOnFieldClick={false}
      placeholder="Select a value..."
      showClearButton={true}
      width="100%"
    />
  </div>);
};

export default function App() {
  const treeView = useRef(null);
  const [treeBoxValue, setTreeBoxValue] = useState(["1_1"]);

  const onContentReady = useCallback(({ component }) => {
    if (!component.isNotFirstLoad && treeBoxValue) {
      component.isNotFirstLoad = true;
      treeBoxValue.forEach((item) => {
        component.selectItem(item);
      });
    }
  }, [treeBoxValue]);
  

  const onSelectionChanged = useCallback(({ component }) => {
    let keys = component.getSelectedNodeKeys();

    if (!component.customSelection && JSON.stringify(treeBoxValue) !== JSON.stringify(keys)) {
      setTreeBoxValue(keys);
    }
  }, [treeBoxValue]);

  const onValueChanged = useCallback(({ value }) => {
    setTreeBoxValue(value);
  }, []);

  useEffect(() => {
    const treeViewInstance = treeView?.current?.instance;

    // Synchronize TreeView
    if (!treeViewInstance) return;
    treeViewInstance.customSelection = true;
    treeViewInstance.unselectAll();
    if (treeBoxValue && treeBoxValue.length > 0) {
      treeBoxValue.forEach((item) => {
        treeViewInstance.selectItem(item);
      });
    }
    treeViewInstance.customSelection = false;
  }, [treeView, treeBoxValue]);

  return (
    <div className="dx-fieldset">
      <div className="dx-field">
        <div className="dx-field-label">DropDownBox with embedded TreeView</div>
        <div className="dx-field-value">
          <DropDownBox
            deferRendering={false}
            value={treeBoxValue}
            valueExpr="ID"
            displayExpr="name"
            dataSource={treeDataSource}
            fieldComponent={renderTagBox(treeBoxValue, setTreeBoxValue)}
            onValueChanged={onValueChanged}
          >
            <TreeView
              ref={treeView}
              onContentReady={onContentReady}
              dataSource={treeDataSource}
              dataStructure="plain"
              keyExpr="ID"
              parentIdExpr="categoryId"
              selectionMode="multiple"
              showCheckBoxesMode="normal"
              selectNodesRecursive={false}
              displayExpr="name"
              selectByClick={true}
              onItemSelectionChanged={onSelectionChanged}
            />
          </DropDownBox>
        </div>
      </div>
    </div>
  );
}