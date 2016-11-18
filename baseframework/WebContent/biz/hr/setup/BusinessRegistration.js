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
		manageType:'hrBusinessRegistrationManage',
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
		html.push('工商登记信息');
	}else{
		organId=data.id,name=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>工商登记信息');
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
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler,
		modifManagerOrg:{id:'modifManagerOrg',text:'设置管理机构',img:'page_favourites.gif',click:modifManagerOrg},
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "公司全称", name: "companyName", width: 160, minWidth: 60, type: "string", align: "left",frozen: true },		   
		{ display: "管理机构路径", name: "fullName", width:220, minWidth: 60, type: "string", align: "left" },
		{ display: "公司简码", name: "companyCode", width: 120, minWidth: 60, type: "string", align: "left" },		
		{ display: "公司类型", name: "companyKindTextView", width: 120, minWidth: 60, type: "string", align: "left" },		
		{ display: "营业执照号码", name: "licenseNumber", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "组织机构代码证", name: "organizationCode", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "注册资金（万元）", name: "registeredFund", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "注册地", name: "registrationPlace", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "法定代表人", name: "legalPerson", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "股东", name: "shareholder", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "持股比例", name: "proportion", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "董事长或执行董事", name: "chairman", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "董事", name: "director", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "监事", name: "supervisor", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "总经理", name: "generalManager", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "高管", name: "executive", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "营业期限", name: "allotedTime", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "变更历史", name: "changeContent", width: 280, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			} 
		},
		{ display: "序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left",
			render : function(item) {
				return "<input type='text' mask='nnn' id='txtSequence_" +item.id+ "' class='textbox' value='" + item.sequence + "' />";
			} 
		}
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryBusinessRegistration.ajax',
		manageType:'hrBusinessRegistrationManage',
		parms:{isOurCompany:1},
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
	/*UICtrl.showAjaxDialog({url: web_app.name + '/hrSetupAction!showInsertBusinessRegistration.load', ok: insert,init:function(){
		var that = this, DOM = that.DOM,
	    wrap = DOM.wrap[0];
		$('#detailTable').width($(wrap).width()-10);
		$('#detailCompanyName').on('blur',function(){
			$('#detailCompanyCode').val($.chineseLetter($(this).val()));
		});
	}, close: dialogClose});*/
	var url=web_app.name + '/hrSetupAction!showInsertBusinessRegistration.do?organId='+organId;
	parent.addTabItem({ tabid: 'HRBusinessRegistrationAdd', text: '新增工商登记信息', url:url});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	/*UICtrl.showAjaxDialog({url: web_app.name + '/hrSetupAction!showUpdateBusinessRegistration.load', param:{id:id}, ok: update,init:function(){
		var that = this, DOM = that.DOM,
	    wrap = DOM.wrap[0];
		$('#detailTable').width($(wrap).width()-10);
		$('#detailCompanyName').on('blur',function(){
			$('#detailCompanyCode').val($.chineseLetter($(this).val()));
		});
	}, close: dialogClose});*/
	var url=web_app.name + '/hrSetupAction!showUpdateBusinessRegistration.do?id='+id;
	parent.addTabItem({ tabid: 'HRBusinessRegistrationAdd'+id, text: '编辑工商登记信息', url:url});
}

function viewHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	var url=web_app.name + '/hrSetupAction!showUpdateBusinessRegistration.do?id='+id+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRBusinessRegistrationView'+id, text: '查看工商登记信息', url:url});
}
//删除按钮
function deleteHandler(){
	DataUtil.del({action:'hrSetupAction!deleteBusinessRegistration.ajax',
		gridManager:gridManager,
		onCheck:function(data){
			if(parseInt(data.status)!=0){
				Public.tip(data.companyName+'不是草稿状态,不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}
/*
//新增保存
function insert() {
	var id=$('#detailId').val();
	if(id!='') return update();
	var organId=$('#mainOrganId').val();
	if(organId==''){
		Public.tip('请选择单位！'); 
		return;
	}
	$('#submitForm').ajaxSubmit({url: web_app.name + '/hrSetupAction!insertBusinessRegistration.ajax',
		param:{organId:organId,organName:$('#mainOrganName').val()},
		success : function(data) {
			$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/hrSetupAction!updateBusinessRegistration.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}*/

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "hrSetupAction!updateBusinessRegistrationSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager, onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updateBusinessRegistrationStatus.ajax',
		gridManager: gridManager, param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updateBusinessRegistrationStatus.ajax',
		gridManager: gridManager,param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
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
            		manageType:'hrBusinessRegistrationManage',
            		getParam : function(e){
            			if(e){
            				return {showDisabledOrg:0,displayableOrgKinds : "ogn"};
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
    Public.ajax("hrSetupAction!moveBusinessRegistration.ajax", params, function (data) {
        reloadGrid();
        selectFunctionDialog.hide();
    });
}

function modifManagerOrg(){
	var row = gridManager.getSelectedRow();
	if(!row){
		Public.tip('请选择数据！');
		return false;
	}
	UICtrl.showFrameDialog({
		url: web_app.name + '/hrSetupAction!forwardBusinessRegistrationOrg.do', 
		param : {
			businessRegistrationId : row.id
		},
		title : "公司["+row.companyName+"]管理单位",
		width : 880,
		height : 400,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}
