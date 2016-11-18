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
		manageType:'hrEstateQualificationManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn"};
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
	var html=[],organId='',name='';
	if(!data){
		html.push('房地产资质台账');
	}else{
		organId=data.id,name=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>房地产资质台账');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainOrganId').val(organId);
	$('#mainOrganName').val(name);
	if (gridManager&&organId!='') {
		UICtrl.gridSearch(gridManager,{organId:organId});
	}else{
		gridManager.options.parms['organId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){
			viewHandler();
		}, 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		moveHandler:moveHandler,
		saveSortIDHandler: saveSortIDHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "公司全称", name: "companyName", width: 160, minWidth: 60, type: "string", align: "left",frozen: true  },		  
		{ display: "管理机构路径", name: "fullName", width:220, minWidth: 60, type: "string", align: "left" },
		{ display: "公司简码", name: "companyCode", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "资质等级", name: "qualificationCredential", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "资质证号", name: "qualificationNum", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "准予开发时间", name: "grantStartDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "有效期", name: "grantEndDate", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "发证时间", name: "issueDate", width: 100, minWidth: 60, type: "date", align: "left" },	
		{ display: "现状", name: "currentSituation", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "网上申报资质用户名", name: "creditCard", width: 120, minWidth: 60, type: "string", align: "left" },
		{ display: "网上申报资质密码", name: "constructionNum", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
			render : function(item) {
				return "<input type='text' mask='nnn' id='txtSequence_" +item.id+ "' class='textbox' value='" + item.sequence + "' />";
			} 
		}
		],
		dataAction : 'server',
		url: web_app.name+'/estateQualificationAction!slicedQueryEstateQualification.ajax',
		manageType:'hrEstateQualificationManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			if($('#toolbar_menuUpdate').length>0){//存在编辑按钮
				updateHandler(data.id);
			}else{
				viewHandler(data.id);
			}
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
	var url=web_app.name + '/estateQualificationAction!showInsertEstateQualification.do?organId='+organId;
	parent.addTabItem({ tabid: 'HREstateQualificationAdd', text: '新增房地产资质信息', url:url});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	var url=web_app.name + '/estateQualificationAction!showUpdateEstateQualification.do?id='+id;
	parent.addTabItem({ tabid: 'HREstateQualificationAdd'+id, text: '编辑房地产资质台账', url:url});
}

function viewHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	var url=web_app.name + '/estateQualificationAction!showUpdateEstateQualification.do?id='+id+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HREstateQualificationView'+id, text: '查看房地产资质台账', url:url});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'estateQualificationAction!deleteEstateQualification.ajax',
		gridManager:gridManager,
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}


//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "estateQualificationAction!updateEstateQualificationSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager, onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}


function moveHandler(){

    ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "id"
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
            		manageType:'hrEstateQualificationManage',
            		getParam : function(e){
            			if(e){
            				return {showDisabledOrg:0,orgKindId : "ogn"};
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
    if (!moveToId) {
        Public.tip('请选择移动到的节点！');
        return false;
    }
    var params = {};
    params.organId = moveToId;
    params.organName = moveToName;
    params.ids = $.toJSON(ids);
    Public.ajax("estateQualificationAction!updateMoveEstateQualification.ajax", params, function (data) {
        reloadGrid();
        selectFunctionDialog.hide();
    });
}

