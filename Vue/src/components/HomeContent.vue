<script setup lang="ts">
import { ref } from 'vue';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DxDropDownBox, { type DxDropDownBoxTypes, type DxDropDownBox as DxDropDownBoxType } from 'devextreme-vue/drop-down-box';
import DxTagBox, { type DxTagBoxTypes } from 'devextreme-vue/tag-box';
import DxTextBox from 'devextreme-vue/text-box';
import DxTreeView, { type DxTreeView as DxTreeViewType, type DxTreeViewTypes } from 'devextreme-vue/tree-view';
import CustomStore from 'devextreme/data/custom_store';

const treeViewRef = ref<DxTreeViewType | null>(null);
const dropDownBoxRef = ref<DxDropDownBoxType | null>(null);
let popup: any = null;

const makeAsyncDataSource = (jsonFile: string) => new CustomStore({
  loadMode: 'raw',
  key: 'ID',
  load(): Promise<unknown> {
    return fetch(
      `https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/${jsonFile}`
    ).then((response) => response.json());
  },
});

const dataSource = makeAsyncDataSource('treeProducts.json');
const treeBoxValue = ref<string[]>(['1_1']);

const syncTreeViewSelection = (treeViewInstance: any, value: string[]): void => {
  if (!treeViewInstance) return;

  treeViewInstance.unselectAll();

  if (value.length > 0) {
    value.forEach((item: string) => {
      treeViewInstance.selectItem(item);
    });
  }
};

function onDropDownBoxInitialized(e: DxDropDownBoxTypes.InitializedEvent): void {
  popup = e.component;
}

function onTagBoxValueChanged(e: DxTagBoxTypes.ValueChangedEvent): void {
  treeBoxValue.value = e.value;

  if (dropDownBoxRef.value?.instance) {
    dropDownBoxRef.value.instance.option('value', e.value);
  }

  const treeView = treeViewRef.value?.instance;
  if (treeView) {
    syncTreeViewSelection(treeView, e.value);
  }

  if (popup) {
    popup.repaint();
  }
}

function onTreeViewContentReady(e: DxTreeViewTypes.ContentReadyEvent): void {
  const value = (dropDownBoxRef.value?.instance?.option('value')) || treeBoxValue.value;
  syncTreeViewSelection(e.component, value);
}

function onTreeViewItemSelectionChanged(e: DxTreeViewTypes.ItemSelectionChangedEvent): void {
  const selectedKeys = e.component.getSelectedNodeKeys();
  treeBoxValue.value = selectedKeys;

  if (dropDownBoxRef.value?.instance) {
    dropDownBoxRef.value.instance.option('value', selectedKeys);
  }
  if (popup) {
    popup.repaint();
  }
}
</script>

<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-label">DropDownBox with embedded TreeView</div>
      <div class="dx-field-value">
        <DxDropDownBox
          ref="dropDownBoxRef"
          v-model:value="treeBoxValue"
          :data-source="dataSource"
          value-expr="ID"
          display-expr="name"
          field-template="field"
          :drop-down-options="{
            onInitialized: onDropDownBoxInitialized
          }"
        >
          <template #field="{ data }">
            <div>
              <DxTextBox :visible="false"/>
              <DxTagBox
                :data-source="dataSource"
                :value="treeBoxValue"
                value-expr="ID"
                display-expr="name"
                :open-on-field-click="false"
                :placeholder="treeBoxValue && treeBoxValue.length ? '' : 'Select a value...'"
                :show-clear-button="true"
                width="100%"
                @value-changed="onTagBoxValueChanged"
              />
            </div>
          </template>

          <template #content>
            <DxTreeView
              ref="treeViewRef"
              :data-source="dataSource"
              :select-by-click="true"
              :select-nodes-recursive="false"
              data-structure="plain"
              key-expr="ID"
              parent-id-expr="categoryId"
              selection-mode="multiple"
              show-check-boxes-mode="normal"
              display-expr="name"
              @content-ready="onTreeViewContentReady"
              @item-selection-changed="onTreeViewItemSelectionChanged"
            />
          </template>
        </DxDropDownBox>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.dx-dropdowneditor-input-wrapper.dx-selectbox-container) {
  width: 100%;
}
</style>
