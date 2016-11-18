var treeManager, flag, includeProcUnit;

$(document).ready(function () {
	getQueryParameters();
	
    loadProcTree();
    UICtrl.autoSetWrapperDivHeight();

    function getQueryParameters() {
    	flag = Public.getQueryStringByName("flag") || 1;
    	includeProcUnit =  Public.getQueryStringByName("includeProcUnit") || 1;
	} 
});

function onBeforeExpand(node) {
    if (node.data.hasChildren) {
        if (!node.data.children || node.data.children.length == 0) {
            Public.ajax(web_app + "/processManageAction!loadTreeLeaf.ajax", {
                parentId: node.data.reProcdefTreeId,
                flag: flag,
                includeProcUnit: includeProcUnit
            }, function (data) {
                treeManager.append(node.target, data.Rows);
            });
        }
    }
}

function loadProcTree() {
    treeManager = UICtrl.tree("#maintree", {
        url: web_app + "/processManageAction!loadTreeLeaf.ajax",
        param: {
        	parentId: 1,
            flag: flag,
            includeProcUnit: includeProcUnit
        },
        idFieldName: "reProcdefTreeId",
        parentIDFieldName: "parentId",
        textFieldName: "name",
        checkbox: true,
        iconFieldName: "nodeIcon",
        btnClickToToggleOnly: true,
        autoCheckboxEven: false,
        nodeWidth: 180,
        isLeaf: function (data) {
            data.children = [];
            return data.hasChildren == 0;
        },
        dataRender: function (data) {
            return data.Rows;
        },
        onBeforeExpand: onBeforeExpand,
        onBeforeSelect: function(data){
        	return data.procId;
        }
    });
    
}

/**
* 得到选择的对象
*/
function getSelectedObj() {
    var data = treeManager.getChecked();
    var rows = [];
    $.each(data, function (i, o) {
        rows.push(o.data);
    });

    if (rows.length == 0){
    	Public.errorTip("请选择数据。");
    }
    return rows;
}


