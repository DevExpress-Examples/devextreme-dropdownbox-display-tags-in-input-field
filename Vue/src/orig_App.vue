<template>
  <div class="dx-fieldset">
    <div class="dx-field">
      <div class="dx-field-label">DropDownBox with embedded TreeView</div>
      <div class="dx-field-value">
        <DxDropDownBox
          v-model:value="treeBoxValue"
          :data-source="treeDataSource"
          value-expr="ID"
          display-expr="name"
          placeholder="Select a value..."
          @value-changed="onDropDownBoxValueChanged($event, 'dropDownBox')"
          field-template="field"
          :element-attr="dropDownBoxAttributes"
        >
          <template #field>
            <div>
              <DxTextBox :visible="false" />
              <DxTagBox
                :data-source="treeDataSource"
                v-model:value="treeBoxValue"
                value-expr="ID"
                display-expr="name"
                :open-on-field-click="false"
                placeholder="Select a value..."
                :show-clear-button="true"
                @value-changed="syncTreeViewSelection($event, 'tagBox')"
              />
            </div>
          </template>

          <template #content>
            <DxTreeView
              :ref="treeViewName"
              :data-source="treeDataSource"
              :select-by-click="true"
              :select-nodes-recursive="false"
              data-structure="plain"
              key-expr="ID"
              parent-id-expr="categoryId"
              selection-mode="multiple"
              show-check-boxes-mode="normal"
              display-expr="name"
              @content-ready="syncTreeViewSelection($event)"
              @item-selection-changed="treeView_itemSelectionChanged($event)"
            />
          </template>
        </DxDropDownBox>
      </div>
    </div>
  </div>
</template>
<script>
import DxDropDownBox from "devextreme-vue/drop-down-box";
import DxTreeView from "devextreme-vue/tree-view";
import DxTagBox from "devextreme-vue/tag-box";
import DxTextBox from "devextreme-vue/text-box";
import CustomStore from "devextreme/data/custom_store";

import Popup from "devextreme/ui/popup";

import "whatwg-fetch";

export default {
  components: {
    DxDropDownBox,
    DxTreeView,
    DxTagBox,
    DxTextBox,
  },
  data() {
    return {
      treeDataSource: null,
      treeBoxValue: null,
      treeViewName: "tree-view",
      dropDownBoxAttributes: {
        id: "myDropDownBox",
      },
    };
  },
  created() {
    this.treeDataSource = this.makeAsyncDataSource("treeProducts.json");
    this.treeBoxValue = ["1_1"];
  },
  methods: {
    makeAsyncDataSource(jsonFile) {
      return new CustomStore({
        loadMode: "raw",
        key: "ID",
        load() {
          return fetch(
            `https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/${jsonFile}`
          ).then((response) => response.json());
        },
      });
    },
    syncTreeViewSelection(e, ee) {
      const treeView =
        (e.component.selectItem && e.component) ||
        (this.$refs[this.treeViewName] &&
          this.$refs[this.treeViewName].instance);

      if (treeView) {
        treeView.unselectAll();
        const values = e.value || this.treeBoxValue;
        values &&
          values.forEach((value) => {
            treeView.selectItem(value);
          });
      }
    },
    treeView_itemSelectionChanged(e) {
      this.treeBoxValue = e.component.getSelectedNodeKeys();
    },
    onDropDownBoxValueChanged(e) {
      const $popupEl = document.querySelector("#myDropDownBox .dx-dropdowneditor-overlay");
      if ($popupEl) {
        const popup = Popup.getInstance(
          document.querySelector("#myDropDownBox .dx-dropdowneditor-overlay")
        );
        popup.repaint();
      }
    }
  },
};
</script>
<style scoped>
:deep(.dx-dropdowneditor-input-wrapper.dx-selectbox-container) {
  width: 100%;
}
</style>
