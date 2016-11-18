var gridManager = null, refreshFlag = false,selectOrgDialog=null,overtimeSettlements=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	//initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseAttManage',
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
	$('#schOrgId').orgTree({manageType:'hrBaseAttManage',param: {searchQueryCondition: "org_kind_id in('ogn','dpt','pos')"}});
	$("#maingrid").on('click',function(e){
 		var $clicked = $(e.target || e.srcElement);
 		var id=null;
 		var editStatus= null;
 		if($clicked.is('a')){
 			id=$clicked.parent().attr('id');
 			editStatus=$clicked.parent().attr('editStatus');
 		}
 		else if($clicked.is('div')){
 			id=$clicked.parent().attr('id');
 		}
 		else if($clicked.is('td')){
 			id=$clicked.attr('id');
 		}
 		if(id!=null&&id!=undefined){
	 		if(editStatus!=null){
	 			showInfo(id,editStatus);
	 		}
	 		else{
	 			clickActIns(id);
	 		}
 		}
	});

	$("#maingrid").bind('selectstart',function(){return false;}); 
	
	$("#maingrid").on('dblclick',function(e){
		e.preventDefault();
		e.stopPropagation();
 		var $clicked = $(e.target || e.srcElement);
 		var id=null;
 		if($clicked.is('div')){
 			id=$clicked.parent().attr('id');
 		}
 		else if($clicked.is('td')){
 			id=$clicked.attr('id');
 		}
 		if(id!=null&&id!=undefined){
 			DblClickActDel(id);
 		}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],id='',name='',orgKindId='',fullId='';
	if(!data){
		html.push('排班信息');
	}else{
		id=data.id,name=data.name,orgKindId=data.orgKindId,fullId=data.fullId;
		$('#fullId').val(fullId);
		if(orgKindId=="psm"){//个人高亮显示排班信息
			if(!fullIdChk()){
				Public.tip("请在排班机构内选择人员");
				$('#personId').val("");
				$('#personName').val("");
				//取消树选中状态
				return;
			}
			$('#personId').val(id.split("@")[0]);//取personId
			$('#personName').val(name);
		}
		else{//显示岗位排班信息
			$('#personId').val("");
			$('#personName').val("");
		}
		reloadGrid();
	}
}

//初始化表格
function initializeGrid() {
	//根据新增过滤字段判断是否初始化
	var schOrgId = $('#schOrgId').val();
	if(schOrgId==""){
		$("#maingrid").html("");
		return;
	}
	var workKind = $('#workKind').val();
	if(workKind==''){
		return;
	}
	var htmlStr = "<table style='width: 99%;' class='tableInput'>";
	var columns = [];
	//查询班次信息,作为表头
	Public.syncAjax(web_app.name+'/attBaseInfoAction!queryWorkShift.ajax', 
		{schOrgId:schOrgId,workKind:workKind},
		function(tableData){
			if(tableData==""){//没有有效班次
				return;
			}
			htmlStr = htmlStr + "<thead><tr class='table_grid_head_tr'><th  width='60'>日期</th>";
			$.each(tableData, function (index, data) {
				htmlStr = htmlStr + "<th width='150' >" + data.workShiftName + "</th>";
				columns.splice(index, 0,data.workShiftId);
			});
			columns.splice(columns.length, 0,"");
			htmlStr = htmlStr + "<th width='150'>休假</th>";
			htmlStr = htmlStr + "</tr></thead>";
	});
	var schedulingData = [];
	if(columns.length==0){
		Public.tip("排班机构没有该工种类型的有效班次");
		$("#maingrid").html("");
		return;
	}
	//排班表数据
	Public.syncAjax(web_app.name+'/attBaseInfoAction!slicedQueryScheduling.ajax', 
		{startDate:$('#startDate').val(),endDate:$('#endDate').val(),schOrgId:schOrgId,workKind:workKind},
		function(data){
			schedulingData = data;
	});
	//时间段生成td
	Public.syncAjax(web_app.name+'/attBaseInfoAction!querySchedulingPeriod.ajax', 
		{startDate:$('#startDate').val(),endDate:$('#endDate').val()},
		function(tableData){
			//var loginPsmId = tableData.psmId;
			$.each(tableData.data, function (index, data) {
				var personId = $('#personId').val();
				var cpersonId = $('#personId').val();//用于判断是否显示详细
				//if(personId==""){//初始化时，登录人着色
				//	personId = loginPsmId;
				//}
				//日期列
				var schedulingDay = data.schedulingDay;
				htmlStr = htmlStr + "<tr style='min-height:30px;'>";
				htmlStr = htmlStr + "<td>" + schedulingDay +"</td>";
				for(var i=0;i<columns.length;i++){
					var innerStr = "";
					var innerPersonId = "";
					var color = "#FFFFFF";
					$.each(schedulingData, function (index, data) {
						var editStatus = true;//默认可编辑
						if(data.workDate.substr(0,10)==schedulingDay&&data.workShiftId==columns[i]){
							innerPersonId = innerPersonId + data.ownerPersonId + "@";
							if(data.status=='1'||data.workShiftId==''){//已结算的不允许修改,休假的不能修改
								editStatus = false;
							}
							var personName = data.ownerPersonName;
							if(data.executorPersonId!=""){
								personName = personName + "(" + data.executorPersonName +  "[代])";
							}
							/*if(cpersonId==""){
								innerStr = innerStr + "<div id=\""+data.schedulingId+"\" ><a href='#' onClick='showInfo(\""+data.schedulingId+"\","+editStatus+")'>" + personName + "</a></div>";
							}
							else{
								innerStr = innerStr + "<div id=\""+data.schedulingId+"\" >" +personName + "</div>";
							}*/
							innerStr = innerStr + "<div id=\""+data.schedulingId+"\" editStatus=\""+editStatus+"\"><a href='#'>" + personName + "</a></div>";
						}
					});
					if(personId!=""&&innerPersonId.indexOf(personId)>-1){
						color = "#D1EEEE";
					}
					if(cpersonId==""){
						htmlStr = htmlStr + "<td valign='top' style='background:"+color+"' id='"+columns[i]+"@"+schedulingDay+"'>"+innerStr+"</td>";
					}
					else{
						htmlStr = htmlStr + "<td valign='top' style='background:"+color+"' id='"+columns[i]+"@"+schedulingDay+"'>"+innerStr+"<input id='"+columns[i]+"@"+schedulingDay+"@' type='hidden' value='"+innerPersonId+"' /></td>";
					}
				}
				htmlStr = htmlStr + "</tr>";
			});
	});
	htmlStr = htmlStr + "</table>";
	$("#maingrid").html(htmlStr);
}

function dataSelectChk(){
	var param = $("#queryMainForm").formToJSON();
	if(!param) return false;
	if(!Public.compareDate(param['endDate'],param['startDate'])){
		Public.tip("开始日期不能大于结束日期!");
		return false;
	}
	//时间不能超过一个月
	var dateDiff=Public.dateDiff('day',param['endDate'],param['startDate']);
	if(dateDiff>31){
		Public.tip("时间不能超过一个月!");
		return false;
	}
	return true;
}
//查询
function query() {
	if(dataSelectChk()){
		initializeGrid();
	}
}

//刷新表格
function reloadGrid() {
	initializeGrid();
} 

function fullIdChk(){
	var fullId = $('#fullId').val();
	var schOrgId = $('#schOrgId').val();
	if(fullId.indexOf(schOrgId)>-1){
		return true;
	}
	else{
		return false;
	}
}

//点击操作,需判断权限
function clickActIns(ids) {
	var personId = $('#personId').val();
	var personName = $('#personName').val();
	var workKind = $('#workKind').val();
	if(personId!=""&&personId!=null){
		var psmIds = document.getElementById(ids+"@").value;
		var arrayId = ids.split("@");
		if(!fullIdChk()){
			Public.tip("请在排班机构内选择人员");
			return;
		}
		//判断单元格是否有该人员
		/*if(psmIds.indexOf(personId)>-1){
			$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!deleteScheduling.ajax',
				param:{workShiftId:arrayId[0],workDate:arrayId[1],ownerPersonId:personId,workKind:workKind,schOrgId:$('#schOrgId').val()},
				success : function(data) {
					reloadGrid();
				}
			});
		}
		else{*/
		if(psmIds.indexOf(personId)<0){
			$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!insertScheduling.ajax',
				param:{workShiftId:arrayId[0],workDate:arrayId[1],ownerPersonId:personId,ownerPersonName:personName,workKind:workKind,fullId:$('#fullId').val(),schOrgId:$('#schOrgId').val()},
				success : function(data) {
					reloadGrid();
				}
			});
		}
	}
}

//点击操作,需判断权限
function DblClickActDel(ids) {
	var personId = $('#personId').val();
	var workKind = $('#workKind').val();
	if(personId!=""&&personId!=null){
		var psmIds = document.getElementById(ids+"@").value;
		var arrayId = ids.split("@");
		if(!fullIdChk()){
			Public.tip("请在排班机构内选择人员");
			return;
		}
		//判断单元格是否有该人员
		if(psmIds.indexOf(personId)>-1){
			$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!deleteScheduling.ajax',
				param:{workShiftId:arrayId[0],workDate:arrayId[1],ownerPersonId:personId,workKind:workKind,schOrgId:$('#schOrgId').val()},
				success : function(data) {
					reloadGrid();
				}
			});
		}
	}
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!updateScheduling.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//删除
function deldata(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/attBaseInfoAction!deleteScheduling.ajax',
		success : function() {
			//refreshFlag = true;
			reloadGrid();//需要重新展示数据
		}
	});
}

function initBox(){
	$('#executorPersonName').searchbox({ type:"hr", name: "queryAllArchiveSelect",manageType:'hrBaseAttManage',
		back:{
                 staffName:"#executorPersonName",personId:"#executorPersonId"
		}
	});
}

var delbutton = [{
		id : 'delbtn',
		name : '删除',
		callback : deldata}];
function showInfo(schedulingId,editStatus){
	if(editStatus){
		UICtrl.showAjaxDialog({url: web_app.name+'/attBaseInfoAction!forwardSchedulingListDetail.load',
			param:{schedulingId:schedulingId}, 
			title:'修改排班详情',init:initBox,
			close: dialogClose,width:610,ok:update,button:delbutton
		});
	}
	else{//考勤匹配正常项，不允许修改
		UICtrl.showAjaxDialog({url: web_app.name+'/attBaseInfoAction!forwardSchedulingListDetail.load',
			param:{schedulingId:schedulingId}, 
			title:'查看排班详情',init:initBox,
			close: dialogClose,width:610,ok:false
		});
	}
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//展示排班表
function showScheduling(){
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	if(dataSelectChk()){
		UICtrl.showAjaxDialog({url: web_app.name+'/attBaseInfoAction!forwardSchedulingTable.load',
			param:{startDate:startDate,endDate:endDate}, 
			title:'查看排班详情',init:initializeGrid2,
			ok:doExport,okVal:'导出'
		});
	}
}

var xmlStr = "";
function doExport(){
	var url = web_app.name+'/attBaseInfoAction!exportSchedulingTable.ajax';
	var fileName = "排班表";
	UICtrl.downFileByAjax(url,{xml:encodeURI(encodeURI(xmlStr))},fileName);
}


//初始化表格2
function initializeGrid2() {
	var dw=getDefaultDialogWidth()-50;
	var dh=getDefaultDialogHeight()-80;
	$('#tableDiv').css({width:dw,height:dh});
	//根据新增过滤字段判断是否初始化
	var schOrgId = $('#schOrgId').val();
	if(schOrgId==""){
		$("#tableGrid").html("");
		return;
	}
	var workKind = $('#workKind').val();
	if(workKind==''){
		$("#tableGrid").html("");
		return;
	}
	var htmlStr = "<table style='width: 99%;' class='tableInput'>";
	var columns = [];
	xmlStr = "<tables><table>";
	//查询时间段,作为表头
	Public.syncAjax(web_app.name+'/attBaseInfoAction!querySchedulingPeriod.ajax', 
		{startDate:$('#startDate').val(),endDate:$('#endDate').val()},
		function(tableData){
			var thead1 = "";
			var thead2 = "";
			var xmlhead1 = "";
			var xmlhead2 = "";
			xmlhead1 = "<row><col>日期</col>";
			xmlhead2 = "<row><col>姓名</col>";
			thead1 = "<tr class='table_grid_head_tr'><th width='60'>日期</th>";
			thead2 = "<tr class='table_grid_head_tr'><th>姓名</th>";
			$.each(tableData.data, function (index, data) {
				var schedulingDay = data.schedulingDay;
				xmlhead1 = xmlhead1 + "<col>" + schedulingDay.split('-')[2] + "</col>";
				xmlhead2 = xmlhead2 + "<col>" + data.weekDay + "</col>";
				thead1 = thead1 + "<th width='40'>" + schedulingDay.split('-')[2] + "</th>";
				thead2 = thead2 + "<th>" + data.weekDay + "</th>";
				columns.splice(index, 0,data.schedulingDay);
			});
			xmlhead1 = xmlhead1 + "<col rowSpan='2'>累计上班</col>";
			xmlhead1 = xmlhead1 + "<col rowSpan='2'>累计休假</col>";
			thead1 = thead1 + "<th rowspan='2' width='40'>累计上班</th>";
			thead1 = thead1 + "<th rowspan='2' width='40'>累计休假</th>";
			xmlStr = xmlStr + xmlhead1 + "</row>" + xmlhead2 + "</row>";
			htmlStr = htmlStr + "<thead>" + thead1 + "</tr>" + thead2 + "</tr>" + "</thead>";
	});
	var schedulingData = [];
	//排班表数据
	Public.syncAjax(web_app.name+'/attBaseInfoAction!slicedQueryScheduling.ajax', 
		{startDate:$('#startDate').val(),endDate:$('#endDate').val(),schOrgId:schOrgId,workKind:workKind},
		function(data){
			schedulingData = data;
	});
	//人员生成td
	Public.syncAjax(web_app.name+'/attBaseInfoAction!querySchedulingPerson.ajax', 
		{startDate:$('#startDate').val(),endDate:$('#endDate').val(),schOrgId:schOrgId,workKind:workKind},
		function(tableData){
			$.each(tableData, function (index, data) {
				//人员列
				var personId = data.personId;
				var personName = data.personName;
				xmlStr = xmlStr + "<row><col>" + personName + "</col>";
				htmlStr = htmlStr + "<tr>";
				htmlStr = htmlStr + "<td>" + personName +"</td>";
				//var countwork = 0;
				//var countrest = 0;
				//var countall = 0;
				for(var i=0;i<columns.length;i++){
					var innerStr = "";
					var color = "#FFFFFF";
					var innerXml = "";
					$.each(schedulingData, function (index, data) {
						if(((data.ownerPersonId==personId)
							||(data.executorPersonId==personId)
								)&&data.workDate.substr(0,10)==columns[i]){
							/*if(data.status=='1'){//||data.executorPersonId==personId
								color = "#D1EEEE";
							}*/
							
							var workShiftName = data.workShiftName;
							if(workShiftName==""||(data.ownerPersonId==personId&&data.executorPersonId!='')){
								workShiftName = "休假";
							}
							innerXml = innerXml + "," + workShiftName;
							innerStr = innerStr + "<div style='background:"+color+"'>" + workShiftName + "</div>";
						}
					});
					htmlStr = htmlStr + "<td valign='top'>"+innerStr+"</td>";
					xmlStr = xmlStr + "<col>" + innerXml.substring(1) + "</col>";
				}
				htmlStr = htmlStr + "<td valign='top' align='right'>"+data.sbcount+"</td>";
				htmlStr = htmlStr + "<td valign='top' align='right'>"+data.xjcount+"</td>";
				xmlStr = xmlStr + "<col>"+data.sbcount+"</col>";
				xmlStr = xmlStr + "<col>"+data.xjcount+"</col>";
				xmlStr = xmlStr + "</row>";
				htmlStr = htmlStr + "</tr>";
			});
	});
	xmlStr = xmlStr + "</table></tables>";
	htmlStr = htmlStr + "</table>";
	$("#tableGrid").html(htmlStr);
}