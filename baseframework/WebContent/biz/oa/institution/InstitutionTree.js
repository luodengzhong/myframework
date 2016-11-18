var oaInstitutionTree, reviseAuthorityGridManager = null,selectInstitutionTree,
	readAuthorityGridManager = null, refreshFlag = false, parentId = 0, 
    selectMoveDialog = null,yesNoList = {0: '否', 1: '是'};
$(document).ready(function () {
	UICtrl.autoSetWrapperDivHeight();
	bindEvents();//绑定按钮事件
	initializeUI();

	initInstitutionTree();
	initializeGrid();
});

function initializeUI() {
    UICtrl.layout("#layout", {
        leftWidth: 240,
        heightDiff: -10,
        onSizeChanged: function () {
        	reviseAuthorityGridManager.reRender();
        	readAuthorityGridManager.reRender();
        }
    });
}

var InstImagePath = web_app.name + "/themes/default/images/standardToolbar/standard/";
//var oaInstitutionTreeUrl = web_app.name+'/institutionTreeAction!slicedQueryInstitutionTree.ajax';
var oaInstitutionTreeUrl = web_app.name+'/institutionTreeAction!slicedQueryInstitutionAuthorityTree.ajax';
function initInstitutionTree(){
	var params = {};
    params.parentId = 0;
    oaInstitutionTree = UICtrl.tree("#oaInstitutionTree",{
		url:oaInstitutionTreeUrl,
		param:params,
		idFieldName : 'institutionTreeId',
		textFieldName : "name",
		checkbox : false,
        nodeWidth : 155,
        isLeaf : function(data)
        {
            if (!data) return false;
            if(data.status=="0"){
            	data.icon = InstImagePath+'stop.gif';
            }
            return data.hasChild == false;
        },
        delay: function(e){
            return { url:oaInstitutionTreeUrl,
            	parms:{parentId: e.data.institutionTreeId}};
        },
        onClick: function (node) {
            if (!node || !node.data)
                return;
            $("#treename").val(node.data.name);
            $("input[name='status'][value=" + node.data.status + "]").attr("checked", true);
            $("#treesequence").val(node.data.sequence);
            $('#treeopfunctionCode').val(node.data.opfunctionCode);
            $('#kind').val(node.data.kind);
            if(node.data.opfunctionCode!="Other"){
            	$('#treeopfunctionCode').combox('setText',node.data.opfunctionName);
            }
            else{
            	$('#treeopfunctionCode').combox('setText','其它（暂无菜单模块）');
            }
            refreshInstitutionAuthorityGrid(node.data.institutionTreeId);
        }
    });
}

function getInstitutionTreeId(){
	return $('#institutionTreeId').val();
}

function getKind(){
	return $('#kind').val();
}

function refreshInstitutionTree(){
	oaInstitutionTree.clear();
	refreshInstitutionAuthorityGrid(0);
	var params = {};
    params.parentId = 0;
    $("#treename").val("");
    $("input[name='status']").attr("checked", false);
    $("#treesequence").val("");
    $('#treeopfunctionCode').val("");
    $('#treeopfunctionCode').combox('setText',"");
    oaInstitutionTree.loadData(null,oaInstitutionTreeUrl,params);
}

function refreshInstitutionAuthorityGrid(institutionTreeId) {
	$('#institutionTreeId').val(institutionTreeId);
	reviseAuthorityGridManager.options.parms.bizId = institutionTreeId;
	reviseAuthorityGridManager.loadData();
	readAuthorityGridManager.options.parms.bizId = institutionTreeId;
	readAuthorityGridManager.loadData();
}

function bindEvents() {
    $("#insertInstitutionTree").click(function () {
    	insertInstitutionTree();
    });

    $("#updateInstitutionTree").click(function () {
    	updateInstitutionTree();
    });

    $("#deleteInstitutionTree").click(function () {
    	deleteInstitutionTree();
    });
    
    $("#enableInstitutionTree").click(function () {
    	enableInstitutionTree();
    });
    
    $("#disableInstitutionTree").click(function () {
    	disableInstitutionTree();
    });

    $("#moveInstitutionTree").click(function () {
    	moveInstitutionTree();
    });

}

//初始化表格
function initializeGrid() {
	
    var toolbarElementOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: function () {
            if (!checkSelectedInstitutionTree()) return;
    	    var node = oaInstitutionTree.getSelected();
    	    if(node.data.kind!="system"){
    	    	UICtrl.alert("选择的节点非系统节点，不能控制权限!");
    	    	return;
    		}
            showChooseOrgDialog(function(data){
				var addRows=[];
				$.each(data,function(i,o){
					var row=$.extend({},o,{orgUnitId:o['id'],orgUnitName:o['name'],kindId:'instReviseAuthority',
						bizId:getInstitutionTreeId(),sequence: reviseAuthorityGridManager.getData().length + 1});
					addRows.push(row);
				});
				reviseAuthorityGridManager.addRows(addRows);
			});
        },
        saveHandler: saveReviseAuthority,
        deleteHandler: function(){
			DataUtil.delSelectedRows({action:'institutionTreeAction!deleteAuthority.ajax',
				gridManager:reviseAuthorityGridManager,idFieldName:'commonHandlerId',
				onSuccess:function(){
					reviseAuthorityGridManager.loadData();
				}
			});
		}
    });
    reviseAuthorityGridManager = UICtrl.grid('#reviseAuthorityGrid', {
        columns: [
            { display: "修订对象ID", name: "orgUnitId", width: 220, minWidth: 120, type: "string", align: "left"},
            { display: "修订对象名称", name: "orgUnitName", width: 260, minWidth: 120, type: "string", align: "left"},	   	   
			{ display: "种类", name: "orgKindId", width: 120, minWidth: 80, type: "string", align: "left",
				render: function (item) {
	                   return OpmUtil.getOrgKindDisplay(item.orgKindId);
	             }},
            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'spinner', min: 1, max: 100, mask: 'nnn',required:true} }
        ],
        dataAction: 'server',
        url: web_app.name + '/institutionTreeAction!slicedQueryAuthority.ajax',
        pageSize: 20,
        parms:{bizId:0,kindId:'instReviseAuthority'},
        width: '99%',
        height: 170,
        //title:'修订权限配置',
        sortName: 'sequence',
        sortOrder: 'asc',
        headerRowHeight: 25,
        rowHeight: 25,
        usePager: false,
        toolbar: toolbarElementOptions,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        enabledEdit: true,
        checkbox: true,
        rownumbers: true
    });
     
    var toolbarHandlerOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: function () {
            if (!checkSelectedInstitutionTree()) return;
            var node = oaInstitutionTree.getSelected();
    	    if(node.data.kind!="system"){
    			  UICtrl.alert("选择的节点非系统节点，不能控制权限!");
    			  return;
    		}
            showChooseOrgDialog(function(data){
				var addRows=[];
				$.each(data,function(i,o){
					var row=$.extend({},o,{orgUnitId:o['id'],orgUnitName:o['name'],kindId:'instReadAuthority',
						bizId:getInstitutionTreeId(),sequence: readAuthorityGridManager.getData().length + 1});
					addRows.push(row);
				});
				readAuthorityGridManager.addRows(addRows);
			});
        },
        saveHandler: saveReadAuthority,
        deleteHandler: function(){
			DataUtil.delSelectedRows({action:'institutionTreeAction!deleteAuthority.ajax',
				gridManager:readAuthorityGridManager,idFieldName:'commonHandlerId',
				onSuccess:function(){
					readAuthorityGridManager.loadData();
				}
			});
		}
    });
    
    readAuthorityGridManager = UICtrl.grid('#readAuthorityGrid', {
        columns: [
            { display: "阅读对象ID", name: "orgUnitId", width: 220, minWidth: 120, type: "string", align: "left"},
            { display: "阅读对象名称", name: "orgUnitName", width: 260, minWidth: 120, type: "string", align: "left"},	   	   
			{ display: "种类", name: "orgKindId", width: 120, minWidth: 80, type: "string", align: "left",
				render: function (item) {
	                   return OpmUtil.getOrgKindDisplay(item.orgKindId);
	             }},
            { display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
                editor: { type: 'spinner', min: 1, max: 100, mask: 'nnn',required:true} }  
        ],
        dataAction: 'server',
        url: web_app.name + '/institutionTreeAction!slicedQueryAuthority.ajax',
        pageSize: 20,
        parms:{bizId:0,kindId:'instReadAuthority'},
        width: '99%',
        height: '100%',
        sortName: 'sequence',
        sortOrder: 'asc',
        //title:'阅读权限配置',
        usePager: false,
        heightDiff: -20,
        headerRowHeight: 25,
        rowHeight: 25,
        toolbar: toolbarHandlerOptions,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        enabledEdit: true,
        rownumbers: true,
        checkbox: true
    });
}

function checkSelectedInstitutionTree() {
    try {
    	if(oaInstitutionTree){
	        var selectedNode = oaInstitutionTree.getSelected();
	        if (selectedNode&& selectedNode.data.institutionTreeId != "1") {
	            return true;
	        }
    	}
    } catch (e) {

    }
    Public.errorTip("请选择制度树节点。");
    return false;
}

function saveReviseAuthority(){
	if (!checkItemDuplicate(reviseAuthorityGridManager, "orgUnitId", "orgUnitName", "修订权限对象")) return;

    var reviseAuthorityData = DataUtil.getGridData({ gridManager: reviseAuthorityGridManager});
    if (!reviseAuthorityData) return false;

    Public.ajax(web_app.name + '/institutionTreeAction!saveAuthority.ajax',
        { data: encodeURI($.toJSON(reviseAuthorityData)) },
        function () {
        	reviseAuthorityGridManager.loadData();
        }
    );
}

function saveReadAuthority(){
	if (!checkItemDuplicate(readAuthorityGridManager, "orgUnitId", "orgUnitName", "阅读权限对象")) return;

	var readAuthorityData = DataUtil.getGridData({ gridManager: readAuthorityGridManager });
    if (!readAuthorityData) return false;
    
    Public.ajax(web_app.name + '/institutionTreeAction!saveAuthority.ajax',
        { data: encodeURI($.toJSON(readAuthorityData)) },
        function () {
        	readAuthorityGridManager.loadData();
        }
    );
}

function checkItemDuplicate(grid, idFieldName, nameFiledName, message) {
    grid.endEdit();
    var data = grid.getData();
    var ids = [];
    var id;
    for (var i = 0; i < data.length; i++) {
        id = data[i][idFieldName];
        if ($.inArray(id, ids) > -1) {
            Public.tip(message + "[" + data[i][nameFiledName] + "]重复。");
            return false;
        }
        ids.push(id);
    }
    return true;
}


function insertInstitutionTree(){
	  if (!oaInstitutionTree) {
	        Public.tip("请选择制度树节点!");
	        return;
	  }
	  
	  var node = oaInstitutionTree.getSelected();
	  if (!node) {
		  Public.tip("请选择制度树节点!");
	     return;
	  }
	  
	  if(node.data.kind!="system"){
		  UICtrl.alert("选择的节点非系统节点，不能新增叶子!");
		  return;
	  }
	  if(node.data.isSystemChild=="f"){
		  UICtrl.alert("选择的节点存在非系统子节点，不能新增叶子!");
		  return;
	  }
	  //新增状态默认取父节点值
	  UICtrl.showAjaxDialog({
	     title: "添加制度树节点",
	     width: 300,
	     url: web_app.name + '/institutionTreeAction!showInsertInstitutionTree.load',
	     param: {
	         parentId: node.data.institutionTreeId,
	         status: node.data.status,
	         kind: 'system'
	     },
	     ok: doInsertInstitutionTree,
	     close: dialogClose
	  });
}

function updateInstitutionTree(){
    var id = getInstitutionTreeId();
    if (!checkInstitutionTreeId(id)) {
        return;
    }
    var node = oaInstitutionTree.getSelected();
    if(node.data.kind!="system"){
		  UICtrl.alert("选择的节点非系统节点，不能修改!");
		  return;
	}
    
    UICtrl.showAjaxDialog({
        title: "修改制度树节点",
        width: 300,
        url: web_app.name + '/institutionTreeAction!showUpdateInstitutionTree.load',
        param: {institutionTreeId: id},
        ok: doUpdateInstitutionTree, close: dialogClose
    });
}

function deleteInstitutionTree(){
	   var id = getInstitutionTreeId();
	    if (!checkInstitutionTreeId(id)) {
	        return;
	    }
	    var node = oaInstitutionTree.getSelected();
	    if(node.data.kind!="system"){
			  UICtrl.alert("选择的节点非系统节点，不能删除!");
			  return;
		}
	    var ids = [id];
	    UICtrl.confirm('确定删除吗?', function () {
	        Public.ajax(web_app.name + '/institutionTreeAction!deleteInstitutionTree.ajax', 
	        		{ids: $.toJSON(ids)
	        }, function (data) {
	        	refreshInstitutionTree();
	        });
	    });
}

function enableInstitutionTree(){
    var id = getInstitutionTreeId();
    if (!checkInstitutionTreeId(id)) {
        return;
    }
    UICtrl.confirm('确实要启用选中制度树吗?', function () {
        Public.ajax(web_app.name + '/institutionTreeAction!updateInstitutionTreeStatus.ajax', 
        		{status:1,institutionTreeId:id
        }, function (data) {
        	refreshInstitutionTree();
        });
    });	
}

function disableInstitutionTree(){
    var id = getInstitutionTreeId();
    if (!checkInstitutionTreeId(id)) {
        return;
    }
    UICtrl.confirm('确实要禁用选中制度树吗?', function () {
        Public.ajax(web_app.name + '/institutionTreeAction!updateInstitutionTreeStatus.ajax', 
        		{status:0,institutionTreeId:id
        }, function (data) {
        	refreshInstitutionTree();
        });
    });	
}

function moveInstitutionTree(){
	   try {
	        var selectedNode = oaInstitutionTree.getSelected();
	        if (!selectedNode || selectedNode.data.parentId == 0) {
	            Public.errorTip("请选择制度树节点。");
	            return;
	        }
	    } catch (e) {

	    }
	    if (!selectMoveDialog) {
	        selectMoveDialog = UICtrl.showDialog({
	                title: "移动到...",
	                width: 350,
	                content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="movetree"></ul></div>',
	                init: function () {
	                    var params = {};
	                    params.parentId = 0;
	                    selectInstitutionTree = UICtrl.tree("#movetree",{
	                		url:oaInstitutionTreeUrl,
	                		param:params,
	                		idFieldName : 'institutionTreeId',
	                		textFieldName : "name",
	                		checkbox : false,
	                        nodeWidth : 155,
	                        isLeaf : function(data)
	                        {
	                            if (!data) return false;
	                            return data.hasChild == false;
	                        },
	                        delay: function(e){
	                            return { url:oaInstitutionTreeUrl,
	                            	parms:{parentId: e.data.institutionTreeId}};
	                        }
	                    });
	                },
	                ok: doMoveInstitutionTree,
	                close: function () {
	                    this.hide();
	                    return false;
	                }
	            }
	        );
	    } else {
	    	selectInstitutionTree.clear();
	    	var params = {};
            params.parentId = 0;
            selectInstitutionTree.loadData(null,oaInstitutionTreeUrl,params);
	        selectMoveDialog.show().zindex();
	    }
}

function doMoveInstitutionTree(){
	 	var selectedNode = selectInstitutionTree.getSelected();
	 	var newParentId = selectedNode.data.institutionTreeId;
	    if (!newParentId) {
	        Public.errorTip("请选择需要移动节点。");
	        return;
	    }
	  //新节点不能为流程节点
	  /*  var newNodeIsProc = selectedNode.data.isProc;
	    if(newNodeIsProc=="1"){
	    	Public.errorTip("选择的父节点为流程节点，不能移动。");
	    	return;
	    }*/

	    var currentNode = oaInstitutionTree.getSelected();
	    var currentParentId = currentNode.data.parentId;
	    if (currentParentId == newParentId) {
	        Public.errorTip("没有更新父节点，不能移动。");
	        return;
	    }
	    
	    var params = {};
	    params.newParentId = newParentId;
	    params.id = currentNode.data.institutionTreeId;
	    if (params.newParentId == params.id) {
	        Public.errorTip("父、子节点相同，不能移动。");
	        return;
	    }

	    Public.ajax("institutionTreeAction!moveInstitutionTree.ajax", params, function (data) {
	        selectMoveDialog.hide();
	        refreshInstitutionTree();
	        Public.tip("您已成功移动制度树节点。");
	    });
}

function dialogClose() {
    if (refreshFlag) {
        refreshFlag = false;
    }
}

function checkInstitutionTreeId(id) {
    if (!id || id == 1) {
        Public.tip("无效的制度树节点Id。");
        return 0;
    }
    return id;
}

function doInsertInstitutionTree(){
    _self = this;
    $('#submitForm').ajaxSubmit({url: web_app.name + '/institutionTreeAction!insertInstitutionTree.ajax',
        success: function () {
        	refreshInstitutionTree();
            _self.close();
        }
    });
}

function doUpdateInstitutionTree(){
    _self = this;
    $('#submitForm').ajaxSubmit({url: web_app.name + '/institutionTreeAction!updateInstitutionTree.ajax',
        success: function () {
        	refreshInstitutionTree();
            _self.close();
        }
    });
}


//打开机构选择对话框
function showChooseOrgDialog(fn){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,psm,system';
	var options = { params: selectOrgParams,title : "选择组织",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if($.isFunction(fn)){
				fn.call(window,data);
			}
			this.close();
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}