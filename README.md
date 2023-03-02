<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/422028482/21.1.5%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1040029)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
<!-- default badges end -->
# DevExtreme DropDownBox - How to display tags in the input field

This example demonstrates how to use the [DevExtreme TagBox](https://js.devexpress.com/Documentation/Guide/UI_Components/TagBox/Getting_Started_with_TagBox/) component to display tags in the DevExtreme DropDownBox's input field. The [DevExtreme TreeView](https://js.devexpress.com/Documentation/Guide/UI_Components/TreeView/Getting_Started_with_TreeView/) component is used to create a hierarchical view in the drop-down field.

<div align="center"><img alt="DropDownBox with integrated TagBox and TreeView" src="https://user-images.githubusercontent.com/18551316/142602619-b41ca373-fa29-4c42-8c6c-ed6cba9a499f.png" /></div>

**NOTE:** If you do not need a complex UI in the drop-down field, but still want to display tags, try a standalone TagBox component. You can refer to the [Getting Started with TagBox](https://js.devexpress.com/Documentation/Guide/UI_Components/TagBox/Getting_Started_with_TagBox/) article to find out if the TagBox is the choice for you.

To implement the UI shown above, follow these steps:

1. **Synchronize the DropDownBox with the embedded TreeView**       
You can find detailed instructions in the following help topic: [DropDownBox - Synchronize with the Embedded Element](https://js.devexpress.com/Documentation/Guide/UI_Components/DropDownBox/Synchronize_with_the_Embedded_Element/)

1. **Integrate the TagBox with the DropDownBox**        
Configure the TagBox in the DropDownBox's [fieldTemplate](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#fieldTemplate). Bind the TagBox to the same [dataSource](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#dataSource) used by the DropDownBox and TreeView, and specify the [valueExpr](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#valueExpr) and [displayExpr](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#displayExpr) properties. Set the TagBox's [value](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#value) to be the **value** of the DropDownBox and implement the [onValueChanged](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxTagBox/Configuration/#onValueChanged) event handler to synchronize the TagBox with the rest of the components. Other TagBox properties shown in the code below are optional.

    ```js
    const dropDownBox = $("#treeBox").dxDropDownBox({
        value: ["1_1"],
        valueExpr: "ID",
        displayExpr: "name",
        dataSource: dataSource,
        fieldTemplate: function(value, fieldElement) {
            $("<div>").dxTagBox({
                dataSource: dataSource,
                valueExpr: "ID",
                displayExpr: "name",
                value: value,
                onValueChanged: function (e) {
                    dropDownBox.option("value", e.value);
                    syncTreeViewSelection(treeView, e.value)
                },
                showClearButton: true,
                placeholder: value.length ? "" : "Select a value...",
                openOnFieldClick: false,
                width: "100%"
            }).appendTo(fieldElement);
        },
        // ...
    }).dxDropDownBox("instance");
    ```
    
    ## Files to Review

- **Angular**
    - [app.component.html](Angular/src/app/app.component.html)
    - [app.component.ts](Angular/src/app/app.component.ts)
- **jQuery**
    - [index.js](jQuery/src/index.js)
- **React**
    - [App.js](React/src/App.js)
- **Vue**
    - [App.vue](Vue/src/App.vue)
- **ASP.Net**    
    - [Index.cshtml](ASP.NET/Pages/Index.cshtml)

## Documentation

- [Getting Started with DropDownBox](https://js.devexpress.com/Documentation/Guide/UI_Components/DropDownBox/Getting_Started_with_DropDownBox/)

- [DropDownBox - API Reference](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/)
