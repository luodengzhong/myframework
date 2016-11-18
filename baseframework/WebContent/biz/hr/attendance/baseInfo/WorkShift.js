var gridManager = null, refreshFlag = false,yesOrNo = {0:'否', 1:'是'},
selectFunctionDialog=null;
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
	var html=[],id='',name='',orgKindId='',fullId='',fullName='';
	if(!data){
		html.push('班次信息');
	}else{
		id=data.id,name=data.name,orgKindId=data.orgKindId,fullId=data.fullId,fullName=data.fullName;
		if(orgKindId=="pos"){//显示岗位班次信息
			$('#schOrgId').val(id);
		}
		else if(orgKindId=="dpt"){//显示部门班次信息
			$('#schOrgId').val(id);
		}
		else if(orgKindId=="ogn"){//显示机构班次信息
			$('#schOrgId').val(id);
		}
		$('#fullId').val(fullId);
		$('#schOrgName').val(name);
		$('#schFullName').val(fullName);
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>班次信息');
		refreshGrid();
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
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
		changeHandler:{id:'Change',text:'变更排班组织',img:'cut.gif',click:changeHandler}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "机构名称", name: "orgName", width: 100, minWidth: 60, type: "string", align: "left" }, 
		{ display: "排班组织", name: "schOrgName", width: 100, minWidth: 60, type: "string", align: "left" }, 
		{ display: "班次名称", name: "workShiftName", width: 100, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',required:true}},
		{ display: "班次编号", name: "workCode", width: 60, minWidth: 40, type: "string", align: "left",
			editor: { type: 'text',required:true,mask:"nnnnnnnnnn"}},		   
		{ display: "上班时间", name: "startTime", width: 60, minWidth: 40, type: "string", align: "left",
			editor: { type: 'text',required:true, mask: "nn:nn"}},  
		{ display: "下班时间", name: "endTime", width: 60, minWidth: 40, type: "string", align: "left",
			editor: { type: 'text',required:true, mask: "^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$"}},
		{ display: "是否启用", name: "status", width: 60, minWidth: 40, type: "string", align: "left" ,
			editor: { type: 'combobox',data: yesOrNo,required:true},
			render: function (item) { 
				return yesOrNo[item.status];
			} },
		{ display: "工种类型", name: "workKindTextView", width: 60, minWidth: 50, type: "string", align: "left"},
		{ display: "班次计数", name: "workNum", width: 60, minWidth: 40, type: "string", align: "left",
			editor: { type: 'text',required:true,mask:"n.nn"}},	
		{ display: "排班组织全路径", name: "fullName", width: 160, minWidth: 80, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/attBaseInfoAction!slicedQueryWorkShift.ajax',
		parms: {schOrgId:getSchOrgId()},
		pageSize : 20,
		delayLoad:true,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'schOrgId,workCode',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData: function(){
			return (getSchOrgId()!="");
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.workShiftId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function getOrgName(){
	return $("#orgName").val();
}

function getSchOrgId(){
	return $("#schOrgId").val();
}

//移动班次
function moveHandler(){
	var rows = gridManager.getSelectedRows();
	if (rows.length < 1) {Public.tip('请选择数据！'); return; }
	if (rows.length > 1) {
		Public.tip("只能对一条数据进行处理！");
		return;
	}
	var row = rows[0];
	var workShiftId=row.workShiftId;
	//var schOrgId=row.schOrgId;
	var schOrgId=$('#schOrgId').val();
	var workKind=row.workKind;
	var workShiftName=row.workShiftName+"("+row.schOrgName+":"+row.workKindTextView+")";
	var html=['<div class="ui-form">','<form method="post" action="" id="changeWorkShiftForm">'];
	html.push("<div class='row'><dl>");
    html.push("<dt style='width:75px'>调整班次<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='hidden' name='workShiftId' value='"+workShiftId+"'/>");
    html.push("<input type='text' class='text' name='workShiftName' required='true' value='"+workShiftName+"' readonly='true' label='调整班次'/>");
    html.push("</dd>");
    html.push("</dl></div>");
	html.push("<div class='row'><dl>");
    html.push("<dt style='width:75px'>开始日期<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' name='startDate' required='true' maxlength='20'  date='true' label='开始日期'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:75px'>结束日期&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' name='endDate' maxlength='20' date='true' label='结束日期'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:75px'>目标班次<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' name='choiceWorkShiftId' id='choiceWorkShiftId' required='true' label='目标班次'/>");
    html.push("</dd>");
    html.push("</dl></div>");
	html.push('</form>','</div>');
	UICtrl.showDialog( {
		width:270,
		top:100,
		title : '调整排班班次',
		height:120,
		content:html.join(''),
		init:function(){
			Public.syncAjax(web_app.name+'/attBaseInfoAction!queryWorkShiftAll.ajax', 
					{schOrgId:schOrgId,workKind:workKind,workShiftId:workShiftId},
		            function(data){
						$('#choiceWorkShiftId').combox({data:data});
			});
		},
		ok : function(){
			var _self=this;
			var param=$('#changeWorkShiftForm').formToJSON();
			if(!param) return;
			if(param['endDate']!=""){
				if(Public.compareDate(param['startDate'],param['endDate'])&&param['startDate']!=param['endDate']){
					Public.tip("结束日期不能小于开始日期!");
					return;
				}
			}
			//执行数据变更
			UICtrl.confirm('确定执行该操作?',function(){
				Public.ajax(web_app.name + '/attBaseInfoAction!changeWorkShift.ajax', param, function(){
					//关闭父窗口
					_self.close();
					return true;
				});
			});
		}
	});
}

function changeHandler(){
    ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "workShiftId"
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
            				return {showDisabledOrg:0,orgKindId : "ogn,dpt,pos"};
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
    params.targetSchOrgId = moveToId;
    params.targetSchOrgId_text = moveToName;
    params.ids = $.toJSON(ids);
    Public.ajax("attBaseInfoAction!saveChangeSchOrg.ajax", params, function (data) {
    	reloadGrid();
        selectFunctionDialog.hide();
    });
}

// 查询
function query(obj) {
	var schOrgId = getSchOrgId();
	if(schOrgId==""){
		Public.tip("请选择左侧的排班组织");
		return;
	}
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//查询
function refreshGrid(){
	var obj = $("#queryMainForm");
	query(obj);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'attBaseInfoAction!updateWorkShiftStatus.ajax',
		gridManager: gridManager,idFieldName:'workShiftId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'attBaseInfoAction!updateWorkShiftStatus.ajax',
		gridManager: gridManager,idFieldName:'workShiftId', param:{status:0},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

var workShiftTmpId = '';
//添加按钮 
function addHandler() {
	var schOrgId = getSchOrgId();
	workShiftTmpId = '';
	if(schOrgId==""){
		Public.tip("请选择排班组织");
		return;
	}
	UICtrl.showAjaxDialog({url: web_app.name+'/attBaseInfoAction!forwardWorkShiftDetail.load',
		param:{schOrgId:schOrgId,schOrgName:$('#schOrgName').val(),fullName:$('#schFullName').val()},
		title:'新增班次信息',ok: insert,
		close: dialogClose,width:610,height:280
	});
}

var time_hm=/^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/;  
function checkTime(){
	if(!time_hm.test($('#startTime').val())){
		$('#startTime').val("");
		Public.tip("上班时间格式不正确，请重新输入！");
		return false;
	}
	if(!time_hm.test($('#endTime').val())){
		$('#endTime').val("");
		Public.tip("下班时间格式不正确，请重新输入！");
		return false;
	}
	return true;
}

function insert(){
	if(workShiftTmpId==''){
		if(!checkTime()){
			return;
		}
		$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!insertWorkShift.ajax',
			success : function(data) {
				workShiftTmpId = data;
				$('#workShiftId').val(data);
				refreshFlag = true;
			}
		});
	}
	else{
		update();
	}
}

//编辑保存
function update(){
	if(!checkTime()){
		return;
	}
	$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!updateWorkShift.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

function updateHandler(id){
	var workShiftId="";
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		workShiftId=row.workShiftId;
	}else{
		workShiftId=id;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/attBaseInfoAction!forwardWorkShiftDetail.load', 
			param:{workShiftId:workShiftId},
			title:'修改班次信息',ok:update,
			close: dialogClose,width:610,height:280});
}

//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({ action:'attBaseInfoAction!deleteWorkShift.ajax', 
		gridManager: gridManager, idFieldName: 'workShiftId',
		onSuccess:function(){
			reloadGrid();
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