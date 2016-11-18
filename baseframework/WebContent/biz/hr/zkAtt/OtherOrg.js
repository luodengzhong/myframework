var gridManager = null, refreshFlag = false,selectFunctionDialog=null;
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
		manageType:'hrBaseZKAtt',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],organId='',name='',fullId='';
	if(!data){
		html.push('外部单位信息');
	}else{
		organId=data.id,name=data.name,fullId=data.fullId;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>外部单位信息');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainOrganId').val(organId);
	$('#mainOrganName').val(name);
	$('#mainFullId').val(fullId);
	if (gridManager&&organId!='') {
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
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "名称", name: "name", width: 150, minWidth: 60, type: "string", align: "left" },		   
		{ display: "编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "联系人", name: "linkMan", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "联系方式", name: "linkInfo", width: 100, minWidth: 60, type: "string", align: "left" },	   
		{ display: "管理组织", name: "fullName", width: 350, minWidth: 60, type: "string", align: "left" },
		{ display: "人员管理", name: "otherOrgHum", width:90, minWidth: 60, type: "string", align: "center",isSort:false,
			 render: function(item) {
			 	var otherOrgId=item.otherOrgId;
				var html=['<a href="javascript:void(null);" class="GridStyle" onclick="managerHum('];
				html.push(otherOrgId,',\'',item.name,'\')">','人员管理','</a>');
				
				return html.join('');
			}
		},
		{ display: "考勤记录理", name: "otherOrgAtt", width: 90, minWidth: 60, type: "string", align: "center",isSort:false,
			 render: function(item) {
			 	var otherOrgId=item.otherOrgId;
				var html=[];
				html.push('<a href="javascript:void(null);" class="GridStyle" onclick="managerAtt(');
				html.push(otherOrgId,',\'',item.name,'\')">','考勤记录','</a>');
				return html.join('');
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/zkAttAction!slicedQueryOtherOrg.ajax',
		pageSize : 20,
		manageType:'hrBaseZKAtt',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'code',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.otherOrgId);
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
}

//添加按钮 
function addHandler() {
	var organId=$('#mainOrganId').val();
	if(organId==''){
		Public.tip('请选择单位！'); 
		return;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/zkAttAction!showInsertOtherOrg.load',width:600,title:'新增外部单位',
	ok: insert,init:function(){
		$('#detailName').on('blur',function(){
			if($('#detailCode').val()==''){
				$('#detailCode').val($.chineseLetter($(this).val()));
			}
		});
	}, close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.otherOrgId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/zkAttAction!showUpdateOtherOrg.load', param:{otherOrgId:id},width:600,title:'编辑外部单位',
	ok: update,init:function(){
		$('#detailName').on('blur',function(){
			if($('#detailCode').val()==''){
				$('#detailCode').val($.chineseLetter($(this).val()));
			}
		});
	}, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'zkAttAction!deleteOtherOrg.ajax',
		gridManager:gridManager,idFieldName: "otherOrgId",
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	var id=$('#detailId').val();
	if(id!='') return update();
	var organId=$('#mainOrganId').val();
	if(organId==''){
		Public.tip('请选择单位！'); 
		return;
	}
	$('#submitForm').ajaxSubmit({url: web_app.name + '/zkAttAction!insertOtherOrg.ajax',
		param:{orgId:organId,orgName:$('#mainOrganName').val(),fullId:$('#mainFullId').val()},
		success : function(data) {
			$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/zkAttAction!updateOtherOrg.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

function moveHandler(){
   var ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "otherOrgId"
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
            		manageType:'hrBaseZKAtt',
            		getParam : function(e){
            			if(e){
            				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
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
    var fullId=moveToNode.fullId;
    if (!moveToId) {
        Public.tip('请选择移动到的节点！');
        return false;
    }
    var ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "otherOrgId"
    });
    var params = {};
    params.orgId = moveToId;
    params.orgName = moveToName;
    params.fullId = fullId;
    params.ids = $.toJSON(ids);
    Public.ajax("zkAttAction!moveOtherOrg.ajax", params, function (data) {
        reloadGrid();
        selectFunctionDialog.hide();
    });
}

function managerHum(otherOrgId,name){
	UICtrl.showFrameDialog({
		url : web_app.name + '/zkAttAction!forwardListHumEmployee.do',
		param : {otherOrgId : otherOrgId},
		title : "["+name+"]人员信息",
		width : 880,
		height : 420,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}

function managerAtt(otherOrgId,name){
	/*UICtrl.showFrameDialog({
		url : web_app.name + '/zkAttAction!forwardListHumAttRecord.do',
		param : {otherOrgId : otherOrgId},
		title : "["+name+"]打卡记录",
		width : 880,
		height : 400,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});*/
	var url=web_app.name + '/zkAttAction!forwardListHumAttRecord.do?otherOrgId='+otherOrgId;
	parent.addTabItem({ tabid: 'zkAttRecord'+otherOrgId, text:"["+name+"]打卡记录", url:url});
}

