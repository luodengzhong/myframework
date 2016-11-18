var gridManager = null, refreshFlag = false; var fullId=null;
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
		manageType:'hrBasePersonquatoData',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='',dptId='';
	if(!data){
		html.push('编制人数列表');
	}else{
		fullId=data.fullId,fullName=data.fullName,dptId=data.id;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>编制人数列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId,dptId:dptId});
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
		deleteHandler:deleteHandler
	});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
	{ display: "单位名称", name: "name",id:"name", width: 150, minWidth: 60, type: "string", align: "left" ,
			render:function(item){
				if(item.existNum>item.num && item.num !=null){
					return '<font style="color:red;width:100%;height:100%;font-size:15px">'+item.name+'</font>';
				} 
				return item.name;}
					},
		{ display: "编制类别", name: "staffingLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "定员人数", name: "num", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "已有人数(人力)", name: "hrExistNum", width: 100, minWidth: 60, type: "string", align: "left"	},		
		{ display: "已有人数(营销)", name: "yxExistNum", width: 100, minWidth: 60, type: "string", align: "left"	},		   
		{ display: "上浮幅度(%)", name: "upRanage", width: 100, minWidth: 60, type: "string", align: "left",
			render:function(item){
				if(Public.isBlank(item.upRanage)) return'';
    		 	return item.upRanage+'%';
			}},	
	    { display: "单位路径", name: "fullName", width: 200, minWidth: 60, type: "string", align: "left" },
		{ display: "备注", name: "remark", width: 100, minWidth: 60, type: "string", align: "left" }

		],
		dataAction : 'server',
		url: web_app.name+'/hRPersonnelQuotaAction!slicedQueryOrganNumber.ajax',
		manageType:'hrBasePersonquatoData',
		pageSize : 40,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		tree: {
            columnId: 'name',
            idField: 'flagId',
            parentIDField: 'parentFlagId'
        },
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			//updateHandler(data.dptId,data.organNumberId,data.staffingLevel);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
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

function deleteHandler(){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		var organNumberId=row.organNumberId;
		 var fn=function(){reloadGrid();Public.successTip("删除成功!") };

		 UICtrl.confirm('您确定删除选中的数据吗?',function(){
    		Public.ajax(web_app.name + '/hRPersonnelQuotaAction!deleteOrganNumber.ajax',{organNumberId:organNumberId},fn);
    	});	
		
}
function addHandler(){
	var data = $('#maintree').commonTree('getSelected');
	if(!data){
		Public.tip('请选择左侧组织机构树!');
		return;
	}
	var dptId=data.id;
	var name=data.name;
	var fullName=data.fullName;
	var parentId=data.parentId;
	UICtrl.showAjaxDialog({url: web_app.name + '/hRPersonnelQuotaAction!showInsertOrganNumber.load',
		param:{dptId:dptId,name:name,fullName:fullName,parentId:parentId}, 
		ok: insert,
		width:550,
		title:"添加编制",
		close: dialogClose});
}
//编辑按钮
function updateHandler(dptId,organNumberId,staffingLevel){
	var name=null,fullName=null,parentId=null,  existNum=null;
	if(!organNumberId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		 dptId=row.dptId;
		 organNumberId=row.organNumberId;
		 staffingLevel=row.staffingLevel;
		 name=row.name;
	     fullName=row.fullName;
	     parentId=row.parentId;
	       existNum=row.existNum;
	}
	if(!organNumberId){
		UICtrl.showAjaxDialog({url: web_app.name + '/hRPersonnelQuotaAction!showInsertOrganNumber.load',
		param:{dptId:dptId,name:name,fullName:fullName,parentId:parentId}, 
		ok: insert,
		width:550,
		title:"添加编制",
		close: dialogClose});
	}else{
	UICtrl.showAjaxDialog({url: web_app.name + '/hRPersonnelQuotaAction!showUpdateOrganNumber.load', 
		param:{organNumberId:organNumberId,dptId:dptId}, 
		width:550,
		title:"修改编制",
		init:initDialog,
		ok: update,
		close: dialogClose});
	}
}
function initDialog(){
	var el=$('#staffingLevel');
	UICtrl.disable(el);
}


//新增保存
function insert() {
	var organNumberId=$('#organNumberId').val();
	if(organNumberId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/hRPersonnelQuotaAction!insertOrganNumber.ajax',
		success : function(data) {
			$('#organNumberId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/hRPersonnelQuotaAction!updateOrganNumber.ajax',
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
