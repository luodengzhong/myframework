var gridManager = null, refreshFlag = false,archivesState=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseZKAtt',
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
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('人员列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人员列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		updateHandler: function(){
			updateHandler();
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },	
		//{ display: "身份证号", name: "idCardNo", width: 150, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "考勤卡号", name: "clockingCardCode", width: 120, minWidth: 60, type: "string", align: "left" },
		{ display: "指纹数", name: "templateCount", width: 60, minWidth: 60, type: "string", align: "left" },
		{ display: "密码", name: "passwd", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "是否管理员", name: "priView", width: 60, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/zkAttAction!slicedQueryArchivesClockingCardCode.ajax',
		manageType:'hrBaseZKAtt',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
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

function updateHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var html=['<div class="ui-form">','<form method="post" action="" id="modifEmpForm">'];
	html.push("<div class='row'><dl>");
    html.push("<dt style='width:60px'>姓名&nbsp;:</dt>");
    html.push("<dd style='width:155px'>");
    html.push("<input type='text' class='text textReadonly' name='staffName' readonly='true' value='",row.staffName,"'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:60px'>考勤卡号&nbsp;:</dt>");
    html.push("<dd style='width:155px'>");
    html.push("<input type='text' class='text textReadonly' name='empNo' readonly='true' value='",row.clockingCardCode,"'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:60px'>考勤密码&nbsp;:</dt>");
    html.push("<dd style='width:155px'>");
    html.push("<input type='text' class='text' name='passwd'  value='",row.passwd,"'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:60px'>是否管理员&nbsp;:</dt>");
    html.push("<dd style='width:155px'>");
    html.push("<input type='text' class='text' name='pri'  value='",row.pri,"' combo='true' dataOptions='data:{14:\"是\",0:\"否\"}'/>");
    html.push("</dd>");
    html.push("</dl></div>");
	html.push('</form>','</div>');
	UICtrl.showDialog( {
		width:270,
		top:100,
		title : '考勤人员修改',
		height:120,
		content:html.join(''),
		ok : function(){
		    $('#modifEmpForm').ajaxSubmit({url: web_app.name + '/zkAttAction!updateHumEmployeePri.ajax',
				success : function() {
					reloadGrid();
				}
			});
			return true;
		}
	});
}

