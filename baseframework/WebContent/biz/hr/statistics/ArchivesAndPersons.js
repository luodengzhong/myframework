var archivesGridManager = null, personsGridManager = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeArchivesGrid();
	initializePersonGrid();
});

//初始化表格
function initializeArchivesGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		updateHandler: function(){
			updateHandler();
		}
	});
	var columns=[
	      { display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left"},	
	      { display: "证件号", name: "idCardNo", width: 150, minWidth: 60, type: "string", align: "left"},
	      { display: "性别", name: "sexTextView", width: 100, minWidth: 60, type: "string", align: "left"},
	      { display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	      { display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
	      { display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },	
	      { display: "用户ID", name: "personId", width: 250, minWidth: 60, type: "string", align: "left" },
	      { display: "登陆账号", name: "f07", width: 100, minWidth: 60, type: "string", align: "left" },
	      { display: "考勤号", name: "clockingCardCode", width: 100, minWidth: 60, type: "string", align: "left" }
	];
	archivesGridManager = UICtrl.grid('#archivesGrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!slicedQueryArchives.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.archivesId);
		}
	});
}

function initializePersonGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		resetPsw:{id:'resetPsw',text:'重置登陆密码',img:'page_dynamic.gif',click:function(){
			var row = personsGridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			UICtrl.confirm('您确定执行该操作吗?',function(){
				Public.ajax(web_app.name + "/hrSystemStatisticsAction!updatePassword.ajax",{id:row.id,type:'password'});
			});
		}},
		resetPayPsw:{id:'resetPayPsw',text:'重置个人密码',img:'page_dynamic.gif',click:function(){
			var row = personsGridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			UICtrl.confirm('您确定执行该操作吗?',function(){
				Public.ajax(web_app.name + "/hrSystemStatisticsAction!updatePassword.ajax",{id:row.id,type:'pay'});
			});
		}}
	});
	var columns=[
		  { display: "用户ID", name: "id", width: 250, minWidth: 60, type: "string", align: "left" },
	      { display: "姓名", name: "name", width: 100, minWidth: 60, type: "string", align: "left"},	
	      { display: "证件号", name: "idCard", width: 150, minWidth: 60, type: "string", align: "left"},
	      { display: "登陆账号", name: "loginName", width: 100, minWidth: 60, type: "string", align: "left" }
	];
	personsGridManager = UICtrl.grid('#personsGrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!slicedQueryOpPerson.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}

// 查询
function queryArchives() {
	UICtrl.gridSearch(archivesGridManager, {staffName:encodeURI($('#staffName').val())});
}
function queryPerson() {
	UICtrl.gridSearch(personsGridManager, {personName:encodeURI($('#personName').val())});
}

//刷新表格
function reloadGrid() {
	archivesGridManager.loadData();
} 

function updateHandler(archivesId){
	if(!archivesId){
		var row = archivesGridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		archivesId=row.archivesId;
	}
	 UICtrl.showAjaxDialog({
            url: web_app.name + '/hrSystemStatisticsAction!loadArchives.load',
            param: {
                archivesId: archivesId
            },
            title: "修改档案",
            width: 300,
            ok: function(){
            	var _self=this;
            	$('#submitForm').ajaxSubmit({
		            url: web_app.name + '/hrSystemStatisticsAction!updateArchives.ajax',
		            success: function (data) {
		                _self.close();
		                reloadGrid();
		            }
		        });
            }
        });
}


