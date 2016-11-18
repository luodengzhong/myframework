$(function () {
    $.dragDesk();
    bindTaskEvent();
    bindRemindEvent();
    bindTrackingTaskEvent();
    bindInfoPromulgatesEvent();
   // bindOtherSystemToDoEvent();
    bindTaskPlanEvent();
    //loadOtherSystemTasks();
    //异步加载信息中心数据
    loadInfoPromulgates();
   // bindProcessStatToDoEvent();
});

function stopPropagation(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

function getCurrentTask(el){
	var currentTask = {};
	currentTask.processDefinitionKey = el.attr('processDefinitionKey');
    currentTask.taskDefKey = el.attr('procUnitId');
    currentTask.catalogId = el.attr('catalogId');
    currentTask.kindId = el.attr('taskKindId');
    currentTask.procUnitHandlerId = el.attr('procUnitHandlerId');
    currentTask.procInstId = el.attr('procInstId');
    currentTask.bizId = el.attr('bizId');
    currentTask.bizCode = el.attr('bizCode');
    currentTask.id = el.attr('taskId');
    currentTask.name = el.attr('name');
    currentTask.executorUrl = el.attr('url');
    currentTask.statusId = el.attr('statusId');
    return currentTask;
}

/**
 * 待办任务事件
 */
function bindTaskEvent() {
    $("#needTimingWaitingTasksComponent,#notNeedTimingWaitingTasksComponent").on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a.tLink')) {
        	var currentTask = getCurrentTask($clicked) ;
            processTask(currentTask);
            return stopPropagation(e);
        }
    });
    $('#needTimingWaitingTasksTitle,#notNeedTimingWaitingTasksTitle').on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a[id="more"]')) {
            openWaitingTasksTab();
            return stopPropagation(e);
        } else if ($clicked.is('a[id="refresh"]')) {
        	var taskScope = this.id == "needTimingWaitingTasksTitle" ? ToDoTaskKind.NEED_TIMING : ToDoTaskKind.NOT_NEED_TIMING;
        	var container =  this.id == "needTimingWaitingTasksTitle" ? "#needTimingWaitingTasksComponent" : "#notNeedTimingWaitingTasksComponent" 
        	loadWaitingTasks(container, taskScope);
            return stopPropagation(e);
        }
    });
}

function bindOtherSystemToDoEvent() {
    $("#otherSystemTasksComponent").on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a.tLink')) {
        	var currentTask = getCurrentTask($clicked) ;
            processTask(currentTask);
            return stopPropagation(e);
        }
    });
    $('#otherSystemTasks').on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a[id="more"]')) {
            openWaitingTasksTab();
            return stopPropagation(e);
        } else if ($clicked.is('a[id="refresh"]')) {
            loadOtherSystemTasks();
            return stopPropagation(e);
        }
    });
}

function openWaitingTasksTab() {
    var url = web_app.name + '/workflowAction!forwardTaskCenter.do?viewTaskKind=1';
    parent.addTabItem({tabid: 'TaskCenter', text: '任务中心 ', url: url});
}

function loadOtherSystemTasks() {
    Public.ajax(web_app.name + "/homePageAction!queryOtherSystemTasks.ajax", {}, function (data) {
    	if(!data){return;}
        var html = [];
        $.each(data.Rows, function (i, o) {
            html.push('<div class="container_list">');
            html.push('<span class="message">');
            html.push('<a href="' + o.url + '" target="_blank" class="tLink">');
            html.push(o.title || o.titile, '</a>');
            html.push('</span>');
            html.push('<span class="person">');
            html.push(o.name, '&nbsp;', o.dayTime);
            html.push('</span>');
            html.push('</div>');
        });
        if (data.length > 14) {
            html.push('<div class="container_list"><span class="person">');
            html.push('<a href="javascript:loadOtherSystemTasks();" class="moreBtn" title="更多...">&nbsp;</a>');
            html.push('</span></div>');
        }
        $("#otherSystemTasksComponent").html(html.join(""));
    });
}

function loadWaitingTasks(container, toDoTaskKind) {
    Public.ajax(web_app.name + "/homePageAction!queryTasks.ajax", {toDoTaskKind: toDoTaskKind}, function (data) {
        var html = [];
        $.each(data.Rows, function (i, o) {
            html.push('<div class="container_list">');
            html.push('<span class="message">');
            html.push('<a href="javascript:void(null);" class="tLink" ');
            html.push('processDefinitionKey="', o.processDefinitionKey, '" ');
            html.push('procUnitId="', o.taskDefKey, '" ');
            html.push('catalogId="', o.catalogId, '" ');
            html.push('taskKindId="', o.kindId, '" ');
            html.push('procInstId="', o.procInstId, '" ');
            html.push('procUnitHandlerId="', o.procUnitHandlerId, '" ');
            html.push('bizId="', o.bizId, '" ');
            html.push('bizCode="', o.bizCode, '" ');
            html.push('taskId="', o.id, '" ');
            html.push('statusId="', o.statusId, '" ');
            html.push('name="', o.name, '" ');
            html.push('url="', o.executorUrl, '">');
            if (TaskStatus.isSleepingStatus(o.statusId)){
            	html.push(o.description + "(已暂缓)", '</a>');
            }else{
            	html.push(o.description, '</a>');
            }
            html.push('</span>');
            html.push('<span class="person">');
            html.push(o.creatorPersonMemberName, '&nbsp;', o.startTime);
            html.push('</span>');
            html.push('</div>');
        });
        if (data.Total > 14) {
            html.push('<div class="container_list"><span class="person">');
            html.push('<a href="javascript:openWaitingTasksTab();" class="moreBtn" title="更多...">&nbsp;</a>');
            html.push('</span></div>');
        }
        $(container).html(html.join(""));
    });
}

/***************消息提醒********************/
function bindRemindEvent() {
    $("#messageRemindContent").on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a.tLink')) {
            showRemindTab($clicked.attr('code'), $clicked.attr('name'), $clicked.attr('openKind'), $clicked.attr('url'));
            return stopPropagation(e);
        }
    });
    $('#messageRemindTitle').on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a[id="refresh"]')) {
            loadRemindByPsmId();
            return stopPropagation(e);
        }
    });
}

function loadRemindByPsmId() {
    Public.ajax(web_app.name + "/homePageAction!queryRemindByPersonId.ajax", {}, function (data) {
        var html = [];
        $.each(data, function (i, o) {
            html.push('<div class="container_list container_line">');
            html.push('<span class="message">');
            html.push('<a href="javascript:void(null);" class="tLink" ');
            html.push('code="', o.code, '" ');
            html.push('openKind="', o.openKind, '" ');
            html.push('name="', o.name, '" ');
            html.push('url="', o.remindUrl, '">');
            html.push(o.remindTitle, '</a>');
            html.push('</span>');
            html.push('</div>');
        });
        $("#messageRemindContent").html(html.join(""));
    });
}

function showRemindTab(code, name, openKind, action) {
    if (Public.isBlank(action)) return;
    if(action.startsWith('http')){
    	window.open(action);
    	return;
    }
    var url = web_app.name + '/' + action;
    var kind = parseInt(openKind, 10);
    if (kind == 0) {
        parent.addTabItem({tabid: '', text: name, url: url});
    } else {
        UICtrl.showFrameDialog({
            title: name,
            url: url,
            resize: true,
            ok: false,
            cancelVal: '关闭',
            cancel: true
        });
    }
}
/************任务提交后通过该方法控制页面刷新**********************/
function reloadGrid() {
    loadWaitingTasks("#needTimingWaitingTasksComponent", ToDoTaskKind.NEED_TIMING);
    loadWaitingTasks("#notNeedTimingWaitingTasksComponent", ToDoTaskKind.NOT_NEED_TIMING);
    loadTrackingTasks();
}
/************************跟踪任务******************************/
function bindTrackingTaskEvent() {
    $("#trackingTasksComponent").on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a.tLink')) {
            showTrackingTask($clicked.attr('procInstId'),
            	$clicked.attr('procUnitId'),
            	$clicked.attr('taskKindId'),
                $clicked.attr('taskId'),
                $clicked.attr('bizId'),
                $clicked.attr('bizCode'),
                $clicked.attr('name'),
                $clicked.attr('url'));
            return stopPropagation(e);
        }
    });
    $('#trackingTasksTitle').on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a[id="more"]')) {
            openTrackingTasksTab();
            return stopPropagation(e);
        } else if ($clicked.is('a[id="refresh"]')) {
            loadTrackingTasks();
            return stopPropagation(e);
        }
    });
}
function openTrackingTasksTab() {
    var url = web_app.name + '/workflowAction!forwardTaskCenter.do?viewTaskKind=5';
    parent.addTabItem({tabid: 'TaskCenter', text: '任务中心 ', url: url});
}
function loadTrackingTasks() {
    Public.ajax(web_app.name + "/homePageAction!queryTrackingTasks.ajax", {}, function (data) {
        var html = [];
        $.each(data, function (i, o) {
            html.push('<div class="container_list">');
            html.push('<span class="message">');
            html.push('<a href="javascript:void(null);" class="tLink" ');
            html.push('procInstId="', o.procInstId, '" ');
            html.push('procUnitId="', o.taskDefKey, '" ');
            html.push('catalogId="', o.catalogId, '" ');
            html.push('taskKindId="', o.kindId, '" ');
            html.push('taskId="', o.id, '" ');
            html.push('bizId="', o.bizId, '" ');
            html.push('bizCode="', o.bizCode, '" ');
            html.push('name="', o.name, '" ');
            html.push('statusId="', o.statusId, '" ');
            html.push('url="', o.executorUrl, '">');
            html.push(o.description, '</a>');
            html.push('</span>');
            html.push('<span class="person">');
            html.push(o.creatorPersonMemberName, '&nbsp;', o.startTime);
            html.push('</span>');
            html.push('</div>');
        });
        if (data.length > 14) {
            html.push('<div class="container_list"><span class="person">');
            html.push('<a href="javascript:openTrackingTasksTab();" class="moreBtn" title="更多...">&nbsp;</a>');
            html.push('</span></div>');
        }
        $("#trackingTasksComponent").html(html.join(""));
    });
}
/**
 * 处理任务
 */
function showTrackingTask(procInstId, procUnitId, taskKindId, taskId, bizId, bizCode, name, url) {
    var params = (url.indexOf("?") >= 0) ? "&" : "?";
    
    params += "isReadOnly=true&taskKindId=" + taskKindId + "&procInstId=" + procInstId + "&taskId=" + taskId 
           + "&bizId=" + bizId + "&bizCode=" + bizCode + "&procUnitId=" + procUnitId;
    
    parent.addTabItem({tabid: bizId, text: name, url: web_app.name + '/' + url + params});
}
/*********信息处理***********/
function bindInfoPromulgatesEvent() {
    $("#infoPromulgateComponent").on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        var parent=$clicked.parents('div.infoWrapper');
        if (parent.length>0) {
            showInfoPromulgate(parent.attr('id'));
            return stopPropagation(e);
        }
    });
    $('#infoPromulgateTitle').on('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        if ($clicked.is('a[id="more"]')) {
            openInfoPromulgateTab();
            return stopPropagation(e);
        } else if ($clicked.is('a[id="refresh"]')) {
            loadInfoPromulgates();
            return stopPropagation(e);
        }
    });
}
function openInfoPromulgateTab() {
    var url = web_app.name + '/oaInfoAction!forwardInfoCenter.do';
    parent.addTabItem({tabid: 'InfoCenter', text: '信息中心 ', url: url});
}
function loadInfoPromulgates() {
	$("#infoPromulgateComponent").html('<div style="margin:10px;color: #555555;"><img src="'+web_app.name+'/themes/default/ui/load.gif" border="0"/>&nbsp;数据加载中......</div>');
	var url=web_app.name + "/homePageAction!queryInfoPromulgate.ajax";
	$.ajax({type: "POST",url : url,cache : false, async : true,dataType : "json",data :{},
		success : function(obj) {
			Public.ajaxCallback(obj,function(data){
				var html = [], finishTime;
		        $.each(data, function (i, o) {
		            finishTime = o.finishTime;
		            if (!Public.isBlank(finishTime) && finishTime.length > 16) {
		                finishTime = finishTime.substring(0, 16);
		            }
		            html.push('<div class="infoWrapper" id="',o.infoPromulgateId,'">');
		            html.push('<div class="leftImg"><img width="32" height="32" src="',web_app.name,o.imgPath,'" /></div>');
		            html.push('<div class="rightContent">');
		            html.push('<div class="infoTitle">',o.subject,'</div>');
		            html.push('<div class="infoAlt">');
		            html.push(o.personMemberName,'&nbsp;',finishTime);
		            html.push('</div>');
		            html.push('</div>');
		            html.push('</div>');
		        });
		        if (data.length > 5) {
		            html.push('<div class="container_list"><span class="person">');
		            html.push('<a href="javascript:openInfoPromulgateTab();" class="moreBtn" title="更多...">&nbsp;</a>');
		            html.push('</span></div>');
		        }
		        $("#infoPromulgateComponent").html(html.join(""));
			});
	}});
}
function showInfoPromulgate(id) {
    var url = web_app.name + '/oaInfoAction!toHandleInfoPromulgate.job?useDefaultHandler=0&infoPromulgateId=' + id;
    parent.addTabItem({tabid: 'openByMainTabInfoPromulgateHandle' + id, text: '信息处理', url: url});
}
/***********任务计划相关***************/
function bindTaskPlanEvent(){
	$('#radioTaskPlanTypeSpan').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('input')){
			setTimeout(function(){queryOATaskPlanByOperator();},0);  	
	    }
	    if($clicked.hasClass('moreBtn')){
	    	openTaskCenterPage();
	    }
	});
	$('#radioDateRangeTypeSpan').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('input')){
			setTimeout(function(){queryOATaskPlanByOperator();},0);  	
	    }
	    if($clicked.hasClass('moreBtn')){
	    	openTaskCenterPage();
	    }
	});
	$("#OATaskPlanTbody").on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			var id=$clicked.attr('id');
			openViewTaskPlanPage(id);
			return false;
		}
	});
}
function queryOATaskPlanByOperator() {
	var reportingWork=$('#reportingWorkAll').getValue();
	var dateRange=$('#reportingDateRangeWeek').getValue();
    Public.ajax(web_app.name + "/homePageAction!queryOATaskPlanByOperator.ajax", {reportingWork:reportingWork,dateRange:dateRange}, function (data) {
    	var count=data['count'],datas=data['datas'];
    	$('#oaTaskPlanCount').text(count);
        var html = [], finishDate,startDate;
        $.each(datas, function (i, o) {
            finishDate = o.finishDate,startDate=o.startDate;
            if (!Public.isBlank(finishDate) && finishDate.length > 10) {
                finishDate = finishDate.substring(0, 10);
            }
             if (!Public.isBlank(startDate) && startDate.length > 10) {
                startDate = startDate.substring(0, 10);
            }
            html.push('<tr style="min-height: 25px;" class="listColor listColor',i%2,'">');
            html.push('<td title="',o.reportingWorkViewText,'">',o.reportingWorkViewText,'</td>');
            html.push('<td title="',o.taskName,'">',o.taskName,'</td>');
            html.push('<td title="',o.finishStandard,'">',o.finishStandard,'</td>');
            html.push('<td>',startDate,'</td>');
            html.push('<td>',finishDate,'</td>');
            html.push('<td title="',o.ownerName,'">',o.ownerName,'</td>');
            html.push('<td title="',o.planPrivateKindTextView,'">',o.planPrivateKindTextView,'</td>');
             html.push('<td><a href="##" class="GridStyle" id="',o.taskId,'">查看</a></td>');
            html.push('</tr>');
        });
        $("#OATaskPlanTbody").html(html.join(""));
    });
}
//打开计划中心
function openTaskCenterPage(){
	 var url = web_app.name + '/planTaskManagerAction!showInsertPlan.do ';
	 parent.addTabItem({ tabid: 'openByMainTabOAPlanManger', text: '我的计划 ', url: url});
}
//打开计划任务台账
function openViewTaskPlanPage(id){
	 var url=web_app.name + '/planTaskManagerAction!showTaskDetail.do?taskId='+id;
	 parent.addTabItem({ tabid: 'openByMainTabViewTask'+id, text: '任务详情', url:url});
}
/*************加载流程时效统计图****************/
var processStatChar=null;
function bindProcessStatToDoEvent(){
	$('#processStatCharTabLinks').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
        if($clicked.is('a.more')){
        	var url=web_app.name + '/processMonitorAction!forwardProcessStat.do';
	 		parent.addTabItem({ tabid: 'approveStatistics', text: '流程时效统计', url:url});
        }else if($clicked.is('span.page')){
        	var id=$clicked.attr('id');
        	$('#processStatCharTabLinks').find('span.active').removeClass('active');
        	loadProcessStatChar(id);//重新加载图表
        	$clicked.addClass('active');
        	$('#processStatCharName').text($clicked.attr('title'));
        }
	});
	$('#processStatCharView').show().height(170);
	$('#processStatCharComponent').height(190);
	processStatChar = echarts.init(document.getElementById('processStatCharView'));
	loadProcessStatChar('person_done_avg');
}
 var colorList = ['#C1232B','#B5C334','#FCCE10','#E87C25','#27727B', '#FE8463','#9BCA63'];
function loadProcessStatChar(processStatKind){
	var option = {
		title:{show : false},
	    tooltip : {trigger: 'axis',axisPointer : {type : 'shadow'}},
	    toolbox: {show : false},
	    grid:{x:30,y:20,x2:10,y2:30},
	    yAxis : [{type : 'value'}], xAxis : [], series : []
	};
	Public.ajax(web_app.name + "/processMonitorAction!queryProcessStatByKind.ajax", {processStatKind:processStatKind,pageSize:7}, function (data) {
	 	var names=new Array(),values=new  Array();
	 	if(data&&data.length>0){
	 		$.each(data,function(i,o){
	 			name=o['orgUnitName'];
	 			names.push({
	 				value:name,
	 				formatter:function(v){
	 					if(v.length>4){
	 						return v.substr(0,4);
	 					}else{
	 						return v;
	 					}
	 				}
	 			});
	 			values.push(o['queryData']);
	 		});
	 		option['xAxis'].push({type : 'category', data :names });
	 		option['series'].push({
	 			type : 'bar',
	 			itemStyle : { 
	 				normal: {
	 					label : {show: true, position: 'insideTop'},
	 					color:function(params){
		 					var dataIndex=params.dataIndex;
		 					return colorList[params.dataIndex]
		 				}
	 				}
	 			},
	 			data:values
	 		});
	 		try{processStatChar.clear();}catch(e){}
	        processStatChar.setOption(option);
	 	}
	 });
}