var treeManager, treeManager2, roleId, selectedData,refreshFlag=null;
$(function() {
	getQueryParameters();
	initializeUI();
	
	bindEvents();

	function getQueryParameters() {
		roleId = Public.getQueryStringByName("roleId");
	}
});

function bindEvents(){
	$(window).resize(function() {
		calculateTreeHeight();
		});
}

function calculateTreeHeight(){
	var height = $(window).height() - 60 -  40 - 10;
	 $("#divfunctionTree").height(height);
	 $("#divfunctionTree2").height(height);
}

function initializeUI(){
	//按钮
	$.getFormButton(
		[
	      {id:'saveDetail',name:'保 存',event:doAssignFunction},
	      {name:'关 闭',event:closeWindow}
	    ]
	);
	var rootFunction=$('#rootFunction');
	//下拉菜单数据改变后重新加载权限树
	rootFunction.combox({onChange:function(o){
		var old_id=$('#chooseFunctionId').val();
		if(old_id!=o.value){
			loadFunctionTree(o.value);
			loadSelectedFunctionTree(o.value);
			$('#chooseFunctionId').val(o.value);
		}
	}});
	var id=$('#rootFunction').val();
	loadFunctionTree(id);
	loadSelectedFunctionTree(id);
	$('#chooseFunctionId').val(id);
	
	calculateTreeHeight();
}

function closeWindow(){
	if(refreshFlag){
		//UICtrl.closeAndReloadParent('HRArchivesMaintain');
		UICtrl.closeCurrentTab();
	}else{
		UICtrl.closeCurrentTab();
	}
}
//保存授权
function doAssignFunction(){
	var data = selectedData,functionIds = [];
	if (!data) return;
	$.each(data,function(i,o){
		if(o['id']){
			functionIds.push({functionId:o['id'],permissionKind:o['type']});
		}
	});
	var params = {roleId:roleId,parentId:$('#chooseFunctionId').val()};
	params['functionIds'] = $.toJSON(functionIds);
	Public.ajax(web_app.name + "/permissionAction!assignFunPermission.ajax", params, function() {
		refreshFlag=true;
	});
}
function doDeleteAll(){
	selectedData=[];
	reloadSelectedFunctionTree();
}
function deleteData() {
	var rows = treeManager2.getChecked();
	if (!rows || rows.length < 1) {
		Public.tip('请选择右侧功能!');
		return;
	}
	for (var i = 0; i < rows.length; i++) {
		for (var j = 0; j < selectedData.length; j++) {
			if (selectedData[j].id == rows[i].data.id) {
				selectedData.splice(j, 1);
				break;
			}
		}
	}
	reloadSelectedFunctionTree();
}

function addData() {
	var rows = treeManager.getChecked();
	if (!rows || rows.length < 1) {
		Public.tip('请选择左侧功能!');
		return;
	}
	selectedData = selectedData || [];
	for (var i = 0; i < rows.length; i++) {
		var notAdded = true;
		for (var j = 0; j < selectedData.length; j++) {
			if (selectedData[j].id == rows[i].data.id) {
				notAdded = false;
				break;
			}
		}
		if (notAdded) {
			processParentData(rows[i].data);
			var data = {};
			data.id = rows[i].data.id;
			data.parentId = rows[i].data.parentId;
			data.name = rows[i].data.name;
			data.icon = rows[i].data.icon;
			data.hasChildren = rows[i].data.hasChildren;
			data.sequence = rows[i].data.sequence;
			data.type = rows[i].data.type;
			data.isexpand = true;
			data.roleId = roleId;
			selectedData[selectedData.length] = data;
		}
	}
	reloadSelectedFunctionTree();
}

function processParentData(node) {
	var parentData = treeManager.getParent(node);
	if (parentData) {
		var notAdded = true;
		for (var i = 0; i < selectedData.length; i++) {
			if (selectedData[i].id == parentData.id) {
				notAdded = false;
				break;
			}
		}
		if (notAdded) {
			var data = {};	
			data.id = parentData.id;
			data.parentId = parentData.parentId;
			data.name = parentData.name;
			data.nodeIcon = parentData.nodeIcon;
			data.hasChildren = parentData.hasChildren;
			data.sequence = parentData.sequence;
			data.type = parentData.type;
			data.isexpand = true;
			data.roleId = roleId;
			selectedData[selectedData.length] = data;
			processParentData(parentData);
		}
	}
}
function isFunctionTreeLeaf(data){
	data.children = [];
	data.nodeIcon=DataUtil.changeFunctionIcon(data.icon);
    return data.hasChildren == 0;
}
function loadFunctionTree(parentId) {
	if (treeManager){
		var parentDiv=$('#functionTree').parent();
		$('#functionTree').removeAllNode();
		parentDiv.append('<ul id="functionTree"></ul>');
	}
	var loadUrl=web_app.name + "/permissionAction!queryFunctionsForAssign.ajax";
	treeManager=UICtrl.tree("#functionTree",{
		url:loadUrl,
		param:{parentId: parentId},
		idFieldName : 'id',
		parentIDFieldName : 'parentId',
		textFieldName : "name",
		iconFieldName : "nodeIcon",
		checkbox : true,
		btnClickToToggleOnly : true,
        isLeaf: isFunctionTreeLeaf,
        nodeWidth : 250,
        onBeforeCancelSelect:function(node){
        	if(node.data.type!='fun'){//不是功能权限不执行自动取消
        		return false;
        	}
        },
        delay: function(e){
            return { url:loadUrl,parms:{parentId: e.data.id} };
        },
        onClick: treeNodeOnclick
    });
}
function treeNodeOnclick(node,obj){
	if($(obj).hasClass('l-checkbox')){
		return;
	}
	if (node.data && node.data.type) {
        if(node.data.type=='field'){
        	showPermissionField(node.data.id,node.data.name);
        }
    }
}
function showPermissionField(id,name){
	UICtrl.showFrameDialog({
		url : web_app.name + "/system/opm/permissionField/showPermissionField.jsp",
		param : {functionFieldGroupId : id},
		title : name,
		width : 650,
		height : 400,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}
function loadSelectedFunctionTree(parentId) {
	if (treeManager2){
		var parentDiv=$('#functionTree2').parent();
		$('#functionTree2').removeAllNode();
		parentDiv.append('<ul id="functionTree2"></ul>');
	}
	var loadUrl=web_app.name + "/permissionAction!queryPermissionsForAssignByRoleId.ajax";
	treeManager2=UICtrl.tree("#functionTree2",{
		url:loadUrl,
		param:{roleId:roleId,parentId: parentId},
		idFieldName : 'id',
		parentIDFieldName : 'parentId',
		textFieldName : "name",
		iconFieldName : "nodeIcon",
		checkbox : true,
		nodeWidth : 250,
		btnClickToToggleOnly : true,
		onBeforeSelect:function(node){
			var obj=node.obj;
        	if($(obj).hasClass("l-checkbox")&&node.data.type!='fun'){//不是功能权限不执行自动取消
        		return false;
        	}
        },
        dataRender:function(data){
        	selectedData=data;
        	return data;
        },
        onClick: treeNodeOnclick
    });
}
//排序
function bubbleSort(array) {
	try {
		var len = array.length, d;
		for (var i = 0; i < len; i++) {
			for (var j = 0; j < len; j++) {
				if (array[i].sequence < array[j].sequence) {
					d = array[j];
					array[j] = array[i];
					array[i] = d;
				}
			}
		}
	} catch (e) {
	}
	return array;
}
function reloadSelectedFunctionTree() {
	if (treeManager2){
		var parentDiv=$('#functionTree2').parent();
		$('#functionTree2').removeAllNode();
		parentDiv.append('<ul id="functionTree2"></ul>');
	}
	for (var i = 0; i < selectedData.length; i++) {
		selectedData[i].treedataindex = undefined;
		if (selectedData[i] && selectedData[i].children)
			selectedData[i].children = [];
	}
	selectedData = bubbleSort(selectedData);
	treeManager2 = UICtrl.tree("#functionTree2", {
		data : selectedData,
		idFieldName : "id",
		parentIDFieldName : "parentId",
		textFieldName : "name",
		iconFieldName : "nodeIcon",
		checkbox : true,
		btnClickToToggleOnly : true,
		nodeWidth : 250,
		onBeforeSelect:function(node){
			var obj=node.obj;
        	if($(obj).hasClass("l-checkbox")&&node.data.type!='fun'){//不是功能权限不执行自动取消
        		return false;
        	}
        },
		isLeaf : function(data) {
			if (!data.parentId)
                data.nodeIcon = web_app.name +  "/themes/default/images/icons/function.gif";
            else {
                if (data.icon) {
                    data.nodeIcon = web_app.name + data.icon;
                }
            }
			return !(data.children && data.children.length > 0);
		},
		onClick: treeNodeOnclick
	});
	Public.tips({type:0,content:'功能移动成功!'}); 
}