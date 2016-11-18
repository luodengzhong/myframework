var gridManager = null, selectFunctionDialog=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrDispatchManagerManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos,psm"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('#dispatchKindTypeName').treebox({
		width:200,
		name:'oaDispatchKindType',
		back:{text:'#dispatchKindTypeName',value:'#mainDispatchKindTypeId'}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',organId='',name='',fullName='';
	if(!data){
		html.push('文件编号类别');
	}else{
		fullId=data.fullId,fullName=data.fullName,organId=data.id,name=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>文件编号类别');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	$('#mainOrganId').val(organId);
	$('#mainOrganName').val(name);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		moveHandler:moveHandler,
		saveSortIDHandler: saveSortIDHandler,
		viewList:{id:'viewList',text:'使用情况',img:'page_text.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			UICtrl.showDispatchNoList(data.dispatchKindId);
		}},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		modifManagerOrg:{id:'modifManagerOrg',text:'设置使用机构',img:'page_favourites.gif',click:modifManagerOrg}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "类别", name: "dispatchKindTypeName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "管理组织", name: "orgUnitName", width: 120, minWidth: 60, type: "string", align: "left" },	
			{ display: "内容", name: "ruleContent", width: 200, minWidth: 60, type: "string", align: "left" },	
			{ display: "循环规则", name: "loopRuleTextView", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "最后修改时间", name: "lastUpdateDate", width: 100, minWidth: 60, type: "date", align: "left" },
			{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.getStatusInfo(item.status);
				}
			},
			{ display: "当前值", name: "value", width: 60, minWidth: 60, type: "date", align: "left" },
			{ display: "选择作废数据", name: "letsChooseCancel", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return item.letsChooseCancel==1?'是':'否';
				}
			},
			{ display: "序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.sequenceRender(item,'dispatchKindId');
				}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/dispatchManagerAction!slicedQueryDispatchKind.ajax',
		manageType:'hrDispatchManagerManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.dispatchKindId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
	onFolderTreeNodeClick();
}

//添加按钮 
function addHandler() {
	var organId=$('#mainOrganId').val();
	if(organId==''){
		Public.tip('请选择单位！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/dispatchManagerAction!showInsertDispatchKind.load',
		title:'新增文号类别',
		init:initDetailPage,
		width:330,
		ok:doSave
	});
}

//编辑按钮
function updateHandler(dispatchKindId){
	if(!dispatchKindId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		dispatchKindId=row.dispatchKindId;
	}
	UICtrl.showAjaxDialog({
		url: web_app.name + '/dispatchManagerAction!showUpdateDispatchKind.load',
		title:'编辑文号类别',
		param:{dispatchKindId:dispatchKindId},
		init:initDetailPage,
		width:330,
		ok:doSave
	});
}

function initDetailPage(doc){
	$('input[name="sequence"]',doc).spinner({countWidth:60});
	$('#detailDispatchKindTypeName').treebox({
		width:200,
		name:'oaDispatchKindType',
		back:{text:'#detailDispatchKindTypeName',value:'#detailDispatchKindTypeId'}
	});
}

function doSave(){
	var param={};
	if($('#detailDispatchKindId').val()==''){
		param['orgUnitId']=$('#mainOrganId').val();
		param['orgUnitName']=$('#mainOrganName').val();
		param['fullId']=$('#mainFullId').val();
	}
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/dispatchManagerAction!saveDispatchKind.ajax',
		param:param,
		success : function(data) {
			//$('#detailDispatchKindId').val(data);
			//refreshFlag = true;
			_self.close();
			reloadGrid();
		}
	});
}
//删除按钮
function deleteHandler(){
	DataUtil.del({action:'dispatchManagerAction!deleteDispatchKind.ajax',
		gridManager:gridManager,idFieldName: "dispatchKindId",
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}


//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "dispatchManagerAction!updateDispatchKindSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName: "dispatchKindId", onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}


function moveHandler(){
    ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "dispatchKindId"
    });
    if (!ids) {
        return;
    }
    if (!selectFunctionDialog) {
        selectFunctionDialog = UICtrl.showDialog({
            title: "移动到...",
            width: 350,
            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="movetree"></ul></div>',
            init: function () {
                $('#movetree').commonTree({
                	loadTreesAction:'orgAction!queryOrgs.ajax',
            		parentId :'orgRoot',
            		manageType:'hrDispatchManagerManage',
            		getParam : function(e){
            			if(e){
            				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos,psm"};
            			}
            			return {showDisabledOrg:0};
            		},
            		changeNodeIcon:function(data){
            			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
            		},
            		IsShowMenu:false
                });
            },
            ok: doMove,
            close: function () {
                this.hide();
                return false;
            }
        });
    } else {
        selectFunctionDialog.show().zindex();
    }

}


function doMove() {
    var moveToNode = $('#movetree').commonTree('getSelected');
    var moveToId = moveToNode.id;
    var moveToName=moveToNode.name;
    var moveToFullId=moveToNode.fullId;
    if (!moveToId) {
        Public.tip('请选择移动到的节点！');
        return false;
    }
    var params = {};
    params.organId = moveToId;
    params.organName = moveToName;
    params.fullId = moveToFullId;
    params.ids = $.toJSON(ids);
    Public.ajax("dispatchManagerAction!updateMoveDispatchKind.ajax", params, function (data) {
        reloadGrid();
        selectFunctionDialog.hide();
    });
}

function modifManagerOrg(){
	var row = gridManager.getSelectedRow();
	if(!row){
		Public.tip('请选择文件编号！');
		return false;
	}
	UICtrl.showFrameDialog({
		url: web_app.name + '/dispatchManagerAction!forwardDispatchKindOrg.do', 
		param : {
			dispatchKindId : row.dispatchKindId
		},
		title : "文件编号["+row.name+"]使用机构",
		width : 880,
		height : 400,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'dispatchManagerAction!updateDispatchKindStatus.ajax',
		gridManager: gridManager,idFieldName:'dispatchKindId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'dispatchManagerAction!updateDispatchKindStatus.ajax',
		gridManager: gridManager,idFieldName:'dispatchKindId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
