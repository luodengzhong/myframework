var gridManager = null, refreshFlag = false;
var courseStatusMap = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
    courseStatusMap = $("#status").combox("getJSONData");
});

function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.TrainingCourseType,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.TrainingCourseType){
		parentId="";
		html.push('课程列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>课程列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	$('#flagCode').val(data.shortCode);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		viewHandler: function(){viewHandler()}
		
	  });
	gridManager = UICtrl.grid('#maingrid', {
        columns: [
            { display: "编号", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "体系", name: "systemTypeTextView", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "单位", name: "courseOrganName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "中心/部门", name: "courseCenterName", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "课程名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },
            { display: "课程大纲", name: "outline",  minWidth: 60, type: "string", align: "left" },
            { display: "适用学员", name: "adjustArchives", width: 100, minWidth: 60, type: "string", align: "center" },
            { display: "课程开发者", name: "trainingTeacherName", width: 100, minWidth: 60, type: "string", align: "center" },
            { display: "创建时间", name: "applicationDate", width: 100, minWidth: 60, type: "string", align: "center" },
            { display: "最后更新时间", name: "updateNewDate", width: 100, minWidth: 60, type: "string", align: "center" }
        ],
		dataAction : 'server',
		url: web_app.name+'/trainingCourseAction!slicedPersonnelQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'trainingCourseId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.id);
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

//编辑按钮
function viewHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
   /* if(row.status!='CREATED'){
        UICtrl.alert("课程已锁定，不能修改!");
        return;
    }*/
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingCourseAction!showUpdate.load',
	param:{trainingCourseId:row.trainingCourseId}, ok:false, close: dialogClose,
	title:'查看课程信息',width:600});
}


//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

