var project=null,taskManageType='taskBaseManage',operateCfg = {},orgId = "", owningObjectId = -99,selectFolderDialog = null;
var taskReportingWork=new Array();
var taskLevelKind=new Array();
var taskLevelJSONDate={};
var shortcutInfoSearchData={};//缓存自定义的查询方案
var queryParams={};//默认查询本月数据
var editMenu = null,viewMenu=null, hasGantt = 1;//菜单
try{window.onerror=function(){return false;};}catch(e){}
$(document).ready(function() {
	UICtrl.layout("#layout", {leftWidth : 240, rightWidth : 240, heightDiff : -5 });
	UICtrl.autoSetWrapperDivHeight();
	UICtrl.autoGroupAreaToggle();
	taskReportingWork=$('#mainTaskReportingWork').combox('getFormattedData');
	taskLevelKind=$('#mainTaskLevelKind').combox('getFormattedData');
	taskLevelJSONDate=$('#mainTaskLevelKind').combox('getJSONData');	
	//创建右键菜单
	//editMenu=new EditMenu();
	initializeOperateCfg();
	loadOrgTreeView();
	initUI();
	if(hasGantt ==1){
		viewMenu=new ViewMenu();
		initGantt();
	}
	bindEvent();
	queryQueryScheme();
});	

function initializeOperateCfg() {
    var path = web_app.name + '/orgAction!';
    operateCfg.queryOrgAction = path + 'queryOrgs.ajax';

    operateCfg.queryOrgFunctionAuthorizesAction = path + 'slicedQueryOrgFunctionAuthorizes.ajax';
    operateCfg.saveOrgFunctionAuthorizeAction = path + 'saveOrgFunctionAuthorize.ajax';
    operateCfg.deleteOrgFunctionAuthorizeAction = path + 'deleteOrgFunctionAuthorize.ajax';
}



function initUI(){
	$('body').css({backgroundColor:'#fff'});
	$('#queryDateRange6').setValue(6);
	$('#selectDateRange').combox('setValue',1);
	$('#selectEndDateRange').combox('setValue',1);
	$('#mainTaskLevelKind').combox('setValue','');
	$('#taskStatus0').setValue(0);
	$("#selectDateRange").combox({
			onChange: function(item){
				dateRangeKindId = item.value;
				$("#customDataRange")[dateRangeKindId == 10?'show':'hide']();
			}
	});
	$("#selectEndDateRange").combox({
			onChange: function(item){
				dateRangeKindId = item.value;
				$("#customEndDataRange")[dateRangeKindId == 10?'show':'hide']();
			}
	});
	UICtrl.layout("#layout", { leftWidth : 250,  heightDiff : -5,onSizeChanged:function(){
		if(project){
			project.setStyle("width:100%;");
		}
	}});
	$('#layout').find('div.l-layout-center').css({borderLeftWidth:0});
	$('#miniToolbar,#opToolbar').css({borderTopWidth:0,borderLeftColor:'#d0d0d0'});
	var addTaskButton=$("#addTaskButton");
	addTaskButton.contextMenu({
		width:"150px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=addTaskButton.offset(),height=addTaskButton.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			{name:"加入到选中任务之前",icon:'edit',handler:function(){addTask('before');}},
			{name:"加入到选中任务之后 ",icon:'next',handler:function(){addTask('after');}},
			{name:"加入到选中任务之内 ",icon:'paste',handler:function(){addTask('add');}}
		],
		onSelect:function(){
			this._hideMenu();
		}
	});
	setTimeout(function(){
		//查询条件默认不显示
		$('#titleConditionArea').find('a.togglebtn').trigger('click');
		$('#divConditionArea').hide();
	},0);
	

}

/**
 * 
 */
function initGantt(){

    var pageType = $('#pageType').val();  
    var pageHigheType = $('#pageHigheType').val();  
	project = new PlusGantt();
    if (pageType == 'backstage'||pageType == 'facestage') {
    	project.setMultiSelect(true);
	}
	setReadOnlyGantt(true);//设置甘特图只读
	project.setStyle("width:100%;");
	UICtrl.autoSetWrapperDivHeight(function(_size){

		if(pageHigheType&&_size.h>100&&pageHigheType == 'backstage'){
			project.setHeight(_size.h -45);
		}else if(_size.h>100){
			project.setHeight(_size.h -45);
		}
	});	
	project.setColumns([
	     new PlusProject.IDColumn(),
	     new mini.CheckColumn({header:""}),
	     new PlusProject.StatusColumn(),
	     new PlusProject.NameColumn({header:'计划名称'}),
	     new PlusProject.TaskOwnerName(),
	     new PlusProject.TaskDutyDeptName(),
	     new PlusProject.TaskLevelColumn(),
	     new PlusProject.TaskManagerName(),
	     new PlusProject.TaskExecutorName(),
	     new PlusProject.FinishDate(),
	     new PlusProject.ActualFinishDate(),
	     new PlusProject.PercentCompleteColumn(),
	     new PlusProject.StartDate(),
	     new PlusProject.ActualStartDate(),
	     new PlusProject.AdjustNumber()
	 ]);
	 //设置节点列
	 project.setTreeColumn("Name");
	 project.render(document.getElementById("ganttView"));
	 project.on('taskdblclick', function(e){
			var pageType = $('#pageType').val();
	 		var url=web_app.name + '/planTaskManagerAction!showTaskDetail.do?taskId='+e.task.UID;
	 		if(pageType){
	 			url = url+'&pageType='+pageType;
	 		}
			parent.addTabItem({ tabid: 'viewTask'+e.task.UID, text: '任务详情', url:url});
	 });
	 //默认不显示甘特图
	 hideGanttView();
	 load();
}
function showGanttView() {
     project.setShowGanttView(true);
      $('#showGanttView').hide();
     $('#hideGanttView').show();
     $('#zoomIn').show();
     $('#zoomOut').show();
}
function hideGanttView() {
     project.setShowGanttView(false);
     $('#showGanttView').show();
     $('#hideGanttView').hide();
     $('#zoomIn').hide();
     $('#zoomOut').hide();
}


function bindEvent(){
	 //快捷查询按钮
    $('#ui-grid-query-button').on('click',function () {
         doQueryList($('#ui-grid-query-input').val());
     });
     $('#ui-grid-query-input').on('keyup',function (e) {
         var value = $(this).val();
         var k = e.charCode || e.keyCode || e.which;
         if (k == 13) {
             doQueryList(value);
         }
    });
    //日期范围选择
    $('#queryDateRangeDiv').on('click',function(e){
    	var $clicked = $(e.target || e.srcElement);
    	if($clicked.is('input')){
    		setTimeout(doQueryList,0);
    	} 
    });
      //任务状态选择
    $('#queryTaskStatusDiv').on('click',function(e){
    	var $clicked = $(e.target || e.srcElement);
    	if($clicked.is('input')){
    		setTimeout(taskStatusChange,0);
    	} 
    });
    $('#selectViewTaskKind').treebox({
    	treeLeafOnly: true, name: 'taskKind',width:220,
    	beforeChange:function(data){
    		if(data.nodeType=='f'){
    			return false;
    		}
    		return true;
    	},
    	back:{
    		text:'#selectViewTaskKind',
    		value:'#selectViewTaskKindId'
    	}
    });
    bindEventSelf();
    var isPlanningSpecialist = $('#isPlanningSpecialist').val()
    if(!isPlanningSpecialist||isPlanningSpecialist !=1){
	   $('#toolbar_menuAdd').hide();
    }
	var more=$('#toolbar_menuAdd').contextMenu({
		width:"100px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=more.offset(),height=more.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			{name:"新增目录",icon:'foldernew',handler:function(){
				addTaskFolder();
			}}
		],
		onSelect:function(){
			this._hideMenu();
		}
	});
	
	/*var adjustMore=$('#toolbar_menuAdjust').contextMenu({
		width:"100px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=adjustMore.offset(),height=adjustMore.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			{name:"计划刷版",icon:'getworld',handler:function(){
				applyEditByRefresh();
			}}
		],
		onSelect:function(){
			this._hideMenu();
		}
	});*/
}



//创建目录
function addTaskFolder(){
	var selectTask = project.getSelected();
	owningObjectId =  $('#owningObjectId').val();
	var managerType =  $('#managerType').val();
	if("41"==managerType||"42"==managerType||"61"==managerType||"64"==managerType||"65"==managerType){
		
	}else {
		if(!owningObjectId||"-99"==owningObjectId||"-1"==owningObjectId){
	    	Public.tip('请选择创建目录所属对象节点!');
		    return;
	    }
	}
	
	function doAddTaskFolder(parentTaskUID){
		parentTaskUID=parentTaskUID?parentTaskUID:'';
		 if (!selectFolderDialog) {
		    	selectFolderDialog = UICtrl.showDialog({
		            title: "创建计划目录。",
		            width: 350, 
		             content: ' <div ><lable style="width: 100px;" >目录名称<font color="#FF0000">*</font> :  </lable><input type="text"  class="text" style="width: 150px;" name="folderName"  id="folderName" ><label for="critical1"> &nbsp;关键任务:</label><input type="checkbox" name="critical" id="critical" title="关键任务"><input type="hidden" name="parentTaskUID" id="parentTaskUID" title="父任务"> </div>',
		              ok: function () {
				         var folderName =  $('#folderName').val();
					     var critical =  $('#critical').is(':checked');
					     var parentUID =  $('#parentTaskUID').val();
					     parentTaskUID =  parentUID?parentUID:parentTaskUID;
					     saveTaskFolder(folderName,critical,parentTaskUID);			       	 
				         this.hide();
				     },
		            close: function () {
		                this.hide();
		                return false;
		            }
		        });
		    } else {
			    $('#parentTaskUID').val(parentTaskUID);
		      /*  $('#selectPlanTypetree').commonTree('refresh');*/
		    	selectFolderDialog.show().zindex();
		    }
		
	}
	if(selectTask){
		UICtrl.confirm("您确定在'"+selectTask.Name+"'下新增计划目录吗？", function () {
		    var status=selectTask.Status;
		    var taskkindid=selectTask.TaskKindId;

		    
		    if(taskkindid!=-111){
		    	Public.tip('非目录下不允许创建子目录!');
			    return;
		    }
		    if(status!=0){
		    	Public.tip('目录状态为非可用状态，不能新建子目录!');
			    return;
		    }
		    doAddTaskFolder(selectTask.UID);
		},function(){
//			doAddFun();
		});
	}else{
		doAddTaskFolder();
	}
}


function saveTaskFolder(folderName,critical,parentTaskUID){
	if(!folderName){
        Public.tip("请输入目录名称！");		
	}
	owningObjectId =  $('#owningObjectId').val();
	managerType =  $('#managerType').val();
	var params = {taskName: folderName,critical: critical,owningObjectId: owningObjectId,managerType: managerType,parentTaskId: parentTaskUID};
	var url=web_app.name + "/planTaskManagerAction!saveTaskFolder.ajax";
	Public.ajax(url,params,function(id){
		doQueryList();		
	});
}
//任务状态改变
function taskStatusChange(){
	var taskStatus=$('#taskStatus0').getValue();
	if(taskStatus!='0'){//不是执行中状态需要选择日期范围
		$('#queryDateRangeDiv').show();
	}else{
		$('#queryDateRangeDiv').hide();
	}
	doQueryList();
}
function setReadOnlyGantt(flag){
	project.setReadOnly(flag);
	project.setAllowDragDrop(!flag);//可拖动
	//创建甘特图调度插件
	//new GanttSchedule(project);
	//控制工具栏显示隐藏
	if(flag){
		$('#opToolbar').show();
		$('#miniToolbar').hide();
		project.setContextMenu(viewMenu);
	}else{
		$('#opToolbar').hide();
		$('#miniToolbar').show();
		//project.setContextMenu(editMenu);
	}
}

//申请修改计划
function applyEditByURl(url,task){
    var task = project.getSelected();
    if(!task){
	    Public.tip('请选中任务！');
	    return;
    }
    var status=task.Status;
    if(status==1){
    	Public.tip('任务已完成不能调整!');
	    return;
    }
    if(status!=0){
    	Public.tip('任务非执行中状态不能调整!');
	    return;
    } 
    var taskKindId=task.TaskKindId;
    if("-111" ==taskKindId){
    	Public.tip('目录不能调整!');
	    return;
    }
	parent.addTabItem({ tabid: 'adjustTask', text: '任务计划调整', url:url});
}

function backViewByURL(url){
	 project.clearFilter();
	 LoadJSONProject(project,url,queryParams,function(){
	 	setReadOnlyGantt(true);//设置为不可编辑
	 });
}
	 

function loadByURL(url){
	doQueryList();
//    LoadJSONProject(project,url,queryParams);//默认查询本月数据
}

//导出excel
function exportExcelByURL(url){
	var exportHead=["<tables><table>","<row>"];
	exportHead.push("<col field='taskId' type='text' >ID</col>");
	exportHead.push("<col field='statusTextView' type='text' >状态</col>");
	exportHead.push("<col field='taskName' type='text' >计划名称</col>");
	exportHead.push("<col field='percentComplete' type='text' >进度</col>");
	exportHead.push("<col field='startDate' type='date' >计划开始日期</col>");
	exportHead.push("<col field='finishDate' type='date' >计划结束日期</col>");
	exportHead.push("<col field='actualStart' type='date' >实际开始日期</col>");
	exportHead.push("<col field='actualFinish' type='date' >实际结束日期</col>");
	exportHead.push("<col field='taskLevelTextView' type='text' >级别</col>");
	exportHead.push("<col field='dutyDeptName' type='text' >责任部门</col>");
	exportHead.push("<col field='ownerName' type='text' >责任人</col>");
	exportHead.push("<col field='managerName' type='text' >评价人</col>");
	exportHead.push("<col field='executorName' type='text' >执行人</col>");
	exportHead.push("<col field='fullName' type='text' >全路径</col>");
	exportHead.push('</row>','</table></tables>');
	var param=$.extend({exportHead:encodeURI(exportHead.join('')),exportType:'all'},queryParams||{});
	var fileName='计划任务';
	UICtrl.downFileByAjax(url,param,fileName);
}

function save() {
	saveGantt(project);
}

function addTask(action){
	action=action||'after';
	var selectedTask = project.getSelected();
	if(!selectedTask){
		Public.tip('请选中任务！');
    	return;
	}
    var status=selectedTask.Status;
    if(status==1){
    	Public.tip('任务已完成不能新建子任务!');
	    return;
    }
    if(status!=0){
    	Public.tip('任务非执行中状态不能新建子任务!');
	    return;
    }
	if(selectedTask.isPlan=='1'){//计划任务只能添加加入到选中任务之内第 
		if(action!='add'){
			Public.tip('计划任务只能添加到选中任务之内！');
    		return;
		}
	}
	var url=web_app.name+'/planTaskManagerAction!getTaskIdByNew.ajax';
	Public.ajax(url,{},function(id){
		var newTask = project.newTask();
	    newTask.Name = '<新增任务>';    //初始化任务属性
	    newTask.UID=id;
	    project.addTask(newTask,action, selectedTask);//加入任务
    });
}
//新增计划 新建计划需要流程审批该方法停用
function addPlan(){
	var selectTask = project.getSelected();	
	if(selectTask){
		UICtrl.confirm("您确定在'"+selectTask.Name+"'下新增计划任务吗？", function () {
		    var status=selectTask.Status;
		    if(status==1){
		    	Public.tip('任务已完成不能新建子任务!');
			    return;
		    }		    
		    if(status!=0){
		    	Public.tip('任务非执行中状态不能新建子任务!');
			    return;
		    }
			doAddFun(selectTask.UID);
		},function(){
//			doAddFun(url);
		});
	}else{
		doAddFun();
	}
}

function removeTask() {
    var task = project.getSelected();
    if(!task){
    	Public.tip('请选中任务！');
    	return;
    }
    UICtrl.confirm('您确定删除任务 ' + task.Name + '吗?', function() {
    	deleteTask(task,function(){
    		project.removeTask(task);
    	});
    });
}

function updateTask() {
    ShowTaskWindow(project);
}
//提升为计划任务
function updateToPlan(){
	var task = project.getSelected();
    if(!task){
    	Public.tip('请选中任务！');
    	return;
    }
    UICtrl.confirm("您确定将'"+task.Name+"'提升为计划任务吗？", function() {
 	   var url = web_app.name+'/planTaskManagerAction!updateTaskToPlan.ajax';
   	   Public.ajax(url,{taskId:task.UID});
    });
}

function upgradeTask() {
    var task = project.getSelected();
    if(!task){
    	Public.tip('请选中任务！');
    	return;
    }
    var parentTask=project.getParentTask(task); 
    if(parentTask.isPlan=='1'){
    	Public.tip('不能执行升级！');
    	return;
    }
    project.upgradeTask(task);
}

function downgradeTask() {
    var task = project.getSelected();
    if(!task){
    	Public.tip('请选中任务！');
    	return;
    }
    if(task.isPlan=='1'){
    	Public.tip('计划任务不能降级！');
    	return;
    }
    project.downgradeTask(task);
}

function zoomIn() {
    project.zoomIn();
}
function zoomOut() {
    project.zoomOut();
}

function onLockClick(e) {
    var checked = this.getChecked();
    if (checked) {
        project.frozenColumn(0, 2);
    } else {
        project.unfrozenColumn();
    }
}
//新增计划 新建计划需要流程审批该方法停用


/************计划查询条件***************/
function clearQueryInput(){
	$('#ui-grid-query-input').val('');
	$('#queryDateRange6').setValue(6);
}

function getStartDate (flag){
	if(flag){
		return $("#editStartDate").val();
	}else{
		return $("#endStartDate").val();
	}
}

function getEndDate (flag){
	if(flag){
		return $("#editEndDate").val();
	}else{
		return $("#endEndDate").val();
	}
}

//保存任务查询方案
function saveQueryScheme(obj){
	var dateRange=$('#selectDateRange').val();
	if (dateRange == 10 && (!getStartDate(true) || !getEndDate(true))){
		Public.tip("请选择开始日期和结束日期！");
		return;
	}
	var endDateRange=$('#endDateRange').val();
	if (endDateRange == 10 && (!getStartDate(false) || !getEndDate(false))){
		Public.tip("请选择开始日期和结束日期！");
		return;
	}
	var param = $(obj).formToJSON({encode:false});
	var div=$('#shortcutSearch').find('div.updateTaskQueryScheme');
	var schemeId='',schemeName='';
	if(div.length>0){
		schemeId=div.attr('id');
		schemeName=div.text();
	}
	var html=['<div style="width:240px">','方案名称&nbsp;'];
	html.push('<font color=red>*</font>:&nbsp;');
	html.push('<input type="text" class="text" style="width:170px;" maxlength="30" id="querySchemeName" value="',schemeName,'">');
	html.push('</div>');
	UICtrl.showDialog({
		title:'保存查询方案',width:250,height:60,left:200,top:200,
	    content:html.join(''),
	    ok:function(){
	    	var _self=this;
	    	var name=$('#querySchemeName').val();
	    	if(name==''){
	    		Public.tip("请输入查询方案名称!");
	    		return;
	    	}
	    	var url=web_app.name + '/personOwnAction!saveQueryScheme.ajax';
	    	Public.ajax(url,{schemeId:schemeId,schemeKind:'plan',name:encodeURI(name),param:encodeURI($.toJSON(param))},function(data){
	    		queryQueryScheme();
	    		_self.close();
	    	});
	    }
	});
}

/*获取任务查询方案列表*/
function queryQueryScheme(){
	var url=web_app.name + '/personOwnAction!queryQueryScheme.ajax';
	Public.ajax(url,{schemeKind:'plan'},function(data){
		buildQueryScheme(data);
	});
}

function buildQueryScheme(data){
	var div=$('#shortcutSearch'),length=data.length;
	var updateQueryScheme=div.find('div.updateTaskQueryScheme'),schemeId='';
	if(updateQueryScheme.length>0){
		schemeId=updateQueryScheme.attr('id');
	}
	div[length>0?'show':'hide']();
	shortcutInfoSearchData={};
	var style='',className='',html=[];
	$.each(data,function(i,o){
		style='';
		className='taskCenterSearch';
		if(i==length-1){
			style='style="border: 0px;"';
		}
		if(schemeId==o.schemeId){//选中样式处理
			className+=' updateTaskQueryScheme';
		}
		html.push('<div class="',className,'" id="',o.schemeId,'" ',style, '>');
		html.push('<span class="ui-icon-trash" title="删除"></span>');
		html.push('<span class="ui-icon-edit" title="编辑"></span>');
		html.push(o.name);
		html.push('</div>');
		shortcutInfoSearchData[o.schemeId]=$.evalJSON(o.param);
	});
	div.html(html.join(''));
}

//删除查询方案
function deleteQueryScheme(schemeId, name){
	UICtrl.confirm('您确定删除<font color=red>['+name+']</font>吗?',function(){
		Public.ajax(web_app.name + '/personOwnAction!deleteQueryScheme.ajax', {schemeId:schemeId}, function(){
			queryQueryScheme();
		});
	});
}
/**********汇报任务进度***********/

function  progressReport(url){
	var task = project.getSelected();
    if(!task){
    	Public.tip('请选中任务！');
    	return;
    }
    var status=task.Status;
    if(status==1){
    	Public.tip('任务已完成不能重复汇报完成任务!');
	    return;
    }
    if(status!=0){
    	Public.tip('任务非执行中状态不能汇报任务!');
	    return;
    }
    var taskKindId=task.TaskKindId;
    if("-111" ==taskKindId){
    	Public.tip('目录不能汇报!');
	    return;
    }
	owningObjectId =  $('#owningObjectId').val();

	var planTaskId=task.UID;	
	var url=web_app.name + '/planTaskManagerAction!showTaskReportPage.job?planTaskId='+planTaskId+'&owningObjectId='+owningObjectId;
	parent.addTabItem({ tabid: 'reportPage'+planTaskId, text: '进度汇报', url:url});	

	
	/*Public.ajax(url,{taskId : task.UID},function(){
	    UICtrl.showFrameDialog({
			url :web_app.name + "/planTaskManagerAction!showTaskReportPage.do",
			param : {
				taskId : task.UID,
				owningObjectId : owningObjectId
			},
			title : "进度汇报",
			width :900,
			height:getDefaultDialogHeight(),
			cancelVal: '关闭',
			okVal:'提交',
			ok:function(){
				var submitTaskReport = this.iframe.contentWindow.submitTaskReport;
				var _self=this;
				if($.isFunction(submitTaskReport)){
					submitTaskReport.call(window,function(){
						setTimeout(function(){_self.close();},0);
						//提交完成后需要刷新选中的节点
						reLoadTaskByAjax(task);
					});
				}
				return false;
			},
			cancel:true,
			button:[{
				id : 'doSave',
				name : '保存',
				callback : function(){
					var saveTaskReport = this.iframe.contentWindow.saveTaskReport;
					if($.isFunction(saveTaskReport)){
						saveTaskReport.call(window);
					}
					return false;
				}
			}]
		});
	});*/
}
//根据ID重新载入任务数据
function reLoadTaskByAjax(task){
	var url=web_app.name + "/planTaskManagerAction!reLoadTaskById.ajax";
	Public.ajax(url,{taskId : task.UID},function(data){
		var taskData = mini.decode(data);
		project.updateTask(task, taskData);
	});
}


function reloadGrid(url) {

	doQueryList();
//	var params = $("#queryMainForm").formToJSON();
/*	owningObjectId =  $('#owningObjectId').val();
	params.owningObjectId = owningObjectId;*/
/*	params.queryKindId = 3;*/
//	url = null == url?web_app.name+'/planTaskManagerPlanAction!queryPlanTask.ajax':url;
//	LoadJSONProject(project,url,params);
	/*UICtrl.gridSearch(gridManager, { owningObjectId: owningObjectId });*/
}
//打开进度汇报查看对话框
function showProgressReport(){
	var task = project.getSelected();
    if(!task){
    	Public.tip('请选中任务！');
    	return;
    }
    UICtrl.showFrameDialog({
		url :web_app.name + "/planTaskManagerAction!forwardTaskReportList.do",
		param : {
			planTaskId :  task.UID
		},
		title : "进度情况",
		width :900,
		height:getDefaultDialogHeight(),
		cancelVal: '关闭',
		ok:false,
		cancel:true
	});
}
//查看任务详细
function showViewTask(){
	var task = project.getSelected();
    if(!task){
    	Public.tip('请选中任务！');
    	return;
    }
	owningObjectId =  $('#owningObjectId').val();
    var url=web_app.name + '/planTaskManagerAction!showTaskDetail.do?taskId='+task.UID+"&owningObjectId="+owningObjectId;

	var pageType = $('#pageType').val();
	if(pageType){
		url = url + '&pageType=' + pageType;
	}
    parent.addTabItem({ tabid: 'viewTask'+task.UID, text: '任务详情', url:url});
}
 
//申请刷版计划,列表,和正常计划一样.
function planFilter(url,task){
	//需要最后选中的是一个目录,除此之外,所有选中的计划中,排除目录,进行计划更新,
	var selectTask = project.getSelected();
	owningObjectId =  $('#owningObjectId').val();
	var managerType =  $('#managerType').val();
	if("41"==managerType||"42"==managerType||"61"==managerType||"64"==managerType||"65"==managerType){
		owningObjectId = -99;
	}else {
		if(!owningObjectId||"-99"==owningObjectId||"-1"==owningObjectId){
	    	Public.tip('请选择引用计划所属节点!');
		    return;
	    }
	}
	var url = web_app.name + "/planTaskManagerAction!showPlanFilter.do?owningObjectId="+owningObjectId+"&managerType="+managerType;
	
	var  planTaskId;
	if(selectTask){
		planTaskId = selectTask.UID ;
		url = url+"&planTaskId="+planTaskId
	}  
	parent.addTabItem({ tabid: 'planFilter', text: '任务计划筛选', url:url});
}


function getAdministrativeOrgFullId(org){	
   	if (org) {
   		var hasPermission = org.managerPermissionFlag;
   		if (hasPermission){
   			return org.fullId;
		}
	}	
	return null;
}
window['alert']=function(){}
window.alert = function (e) {}
