/**
 * 流程类别
 */
var FlowKind = FlowKind || {};

FlowKind.APPROVAL = "APPROVAL"; // 审批流程
FlowKind.BUSINESS = "BUSINESS"; // 业务流程
FlowKind.FREE = "FREE" ; // 自由流
FlowKind.FULL_FREE = "FULL_FREE"; // 完全自由流

var TaskScope = TaskScope || {};

TaskScope.PROCESS = "process"; //流程

TaskScope.TASK = "task"; //非流程

var ToDoTaskKind =  ToDoTaskKind || {};

ToDoTaskKind.NEED_TIMING = "needTiming";
ToDoTaskKind.NOT_NEED_TIMING = "notNeedTiming";

var TaskKind = TaskKind || {};

TaskKind.TASK = "task"; //任务

TaskKind.NOTICE = "notice"; //通知

TaskKind.MAKE_A_COPY_FOR = "makeACopyFor"; //抄送

TaskKind.REMIND = "remind"; //催办

TaskKind.MEND = "mend"; //补审

TaskKind.REPLENISH = "replenish"; //补充（打回）

/**
* 是否打回任务
* @param {} taskKindId
* @return {}
*/
TaskKind.isReplenishTask = function (taskKindId) {
    return taskKindId == TaskKind.REPLENISH;
}

/**
* 是否补审任务
* @param {} taskKindId
* @return {}
*/
TaskKind.isMendTask = function (taskKindId) {
    return taskKindId == TaskKind.MEND;
}
/**
* 是否抄送任务
* @param {} taskKindId
* @return {}
*/
TaskKind.isMakeACopyFor = function (taskKindId) {
    return taskKindId == TaskKind.MAKE_A_COPY_FOR;
}
TaskKind.getDisplay = function (id) {
    var result = "";
    switch (id) {
        case TaskKind.TASK:
            result = "任务";
            break;
        case TaskKind.NOTICE:
            result = "通知";
            break;
        case TaskKind.MAKE_A_COPY_FOR:
            result = "抄送";
            break;
        case TaskKind.REMIND:
            result = "催办";
            break;
        case TaskKind.MEND:
            result = "补审";
            break;
        case TaskKind.REPLENISH:
            result = "打回";
            break;
    }
    return result;
}

var TaskStatus = TaskStatus || {};

TaskStatus.READY = "ready"; //尚未处理

TaskStatus.EXECUTING = "executing"; //正在处理

TaskStatus.COMPLETED = "completed"; //已完成

TaskStatus.SLEEPING = "sleeping"; //暂缓处理

TaskStatus.CANCELED = "canceled"; //已取消

TaskStatus.ABORTED = "aborted"; //已终止

TaskStatus.RETURNED = "returned"; //已回退

TaskStatus.WAITED = "waited"; //等待中

TaskStatus.TRANSMITED = "transmited"; //已转交

TaskStatus.SUSPENDED = "suspended"; //已暂停

TaskStatus.DELETED = "deleted"; //已删除

TaskStatus.isReayStatus = function (statusId) {
    return statusId == TaskStatus.READY;
}

TaskStatus.isCompletedStatus = function (statusId) {
    return statusId == TaskStatus.COMPLETED;
}

TaskStatus.isSleepingStatus = function (statusId) {
    return statusId == TaskStatus.SLEEPING;
}

TaskStatus.isToDoStatus = function (statusId) {
    return TaskStatus.isReayStatus(statusId) || TaskStatus.isSleepingStatus (statusId);
}


TaskStatus.getDisplay = function (id) {
    var result = "";
    switch (id) {
        case TaskStatus.READY:
            result = "尚未处理";
            break;
        case TaskStatus.EXECUTING:
            result = "正在处理";
            break;
        case TaskStatus.COMPLETED:
            result = "已完成";
            break;
        case TaskStatus.SLEEPING:
            result = "暂缓处理";
            break;
        case TaskStatus.CANCELED:
            result = "已取消";
            break;
        case TaskStatus.ABORTED:
            result = "已终止";
            break;
        case TaskStatus.RETURNED:
            result = "已回退";
            break;
        case TaskStatus.WAITED:
            result = "等待中";
            break;
        case TaskStatus.TRANSMITED:
            result = "已转交";
            break;
        case TaskStatus.SUSPENDED:
            result = "已暂停";
            break;
        case TaskStatus.DELETED:
            result = "已删除";
            break;
    }
    return result;
}

/**
* 流程控制命令
* @type 
*/
var FlowControlCmd = FlowControlCmd || {};
FlowControlCmd.SAVE = "save"; // 保存
FlowControlCmd.ADVANCE = "advance"; //流转
FlowControlCmd.DELETE = "delete"; //删除
FlowControlCmd.BACK = "back"; // 回退
FlowControlCmd.REPLENISH = "replenish"; // 打回
FlowControlCmd.QUERY_HANDLERS = "queryHandlers"; //查询处理人
FlowControlCmd.QUERY_ADVANCE = "queryAdvance"; //询问流转
FlowControlCmd.TRANSMIT = "transmit";//转交
FlowControlCmd. ASSIST = "assist";// 协审
FlowControlCmd.MAKE_A_COPYFOR = "makeACopyFor";//抄送
FlowControlCmd.WITHDRAW = "withdraw"; //撤回
FlowControlCmd.RECALL_PROCESS_INSTANCE = "recallProcessInstance";//撤销流程
FlowControlCmd.DELETE_PROCESS_INSTANCE = "deleteProcessInstance";//删除流程实例
FlowControlCmd.ABORT = "abort"; //终止流程
FlowControlCmd.SLEEP = "sleep"; //暂缓

/**
* 处理结果
* @type 
*/
var HandleResult = HandleResult || {};

HandleResult.AGREE = 1;  //同意

HandleResult.DISAGREE = 2; //不同意

HandleResult.HAVEPASSED = 3; //已阅

HandleResult.REPLENISH = 4; //打回

HandleResult.getDisplayName = function(id){
	var result = "";
    switch (id) {
    	 case HandleResult.AGREE:
            result = "同意";
            break;
    	 case HandleResult.DISAGREE:
            result = "不同意";
            break;
    	 case HandleResult.HAVEPASSED:
            result = "已阅";
            break;
          default:
          result = "";            
    }
    return result;
 }

var ViewTaskKind = ViewTaskKind || {};

ViewTaskKind.WAITING = 1; //待办任务
ViewTaskKind.COMPLETED = 2;//已办任务
ViewTaskKind.SUBMITED = 3;//提交任务
ViewTaskKind.DRAFT = 4;//待发任务
ViewTaskKind.INITIATE = 5;//本人发起
ViewTaskKind.COLLECT = 6;//收藏任务
 
var ProcNodeKind = {
    FOLDER: 'folder', //文件夹
    PROC: 'proc', //流程
    PROC_UNIT: 'procUnit'  // 流程环节
};

function processTask(task) {
    if (!task.executorUrl) {
        throw new Error("任务: " + task.name + "的executorUrl为空!");
    }

    var params = (task.executorUrl.indexOf("?") >= 0) ? "&" : "?";

    if (task.kindId == TaskKind.NOTICE) {
        // 通知
        if (task.executorUrl == 'workflowAction!showTaskDetail.do') {
            showTaskDetail("do", "RuntimeTask", task.executorUrl, task.id);
        } else {
            //其他任务点开后直接自动完成
           params += "isReadOnly=false&taskKindId=" + task.kindId + "&bizId="
				+ task.bizId + "&taskId=" + task.id;
            completeTask(task.id, function () {
                parent.addTabItem({
                    tabid: task.id,
                    text: task.name,
                    url: task.executorUrl + params
                });
            });
        }
        return;
    } else if (task.kindId == TaskKind.MAKE_A_COPY_FOR
			|| (task.catalogId == "task" && task.kindId == TaskKind.TASK)) {
        // 抄送 协同任务
        params += "isReadOnly=false&taskKindId=" + task.kindId +"&procInstId="
				+ task.procInstId +"&bizId=" 	+ task.bizId + "&taskId=" + task.id + "&procUnitId=" + task.taskDefKey;
    } else {
        params += "isReadOnly=false&taskKindId=" + task.kindId + "&procInstId="
				+ task.procInstId + "&bizId=" + task.bizId + "&bizCode=" + task.bizCode + "&processDefinitionKey="
				+ task.processDefinitionKey + "&procUnitId=" + task.taskDefKey
				+ "&taskId=" + task.id + "&procUnitHandlerId="
				+ task.procUnitHandlerId + "&procInstEndTime=" + task.procInstEndTime + "&taskStatusId=" + task.statusId;
    }
    if (task.kindId == TaskKind.MAKE_A_COPY_FOR){
    	completeTask(task.id, function(){
    		parent.addTabItem({
		        tabid: task.id,
		        text: task.name,
		        url: task.executorUrl + params
    		})});
    }else{
    	parent.addTabItem({
	        tabid: task.id,
	        text: task.name,
	        url: task.executorUrl + params
    });    	
    }
}

/**
* 查看任务
*/
function browseTask(currentTask) {
    if (currentTask) {
        var params = (currentTask.executorUrl.indexOf("?") >= 0) ? "&" : "?";
        if (currentTask.kindId == TaskKind.NOTICE) {
            var url = currentTask.executorUrl;
            var kindId = "HistoricTask";
            if (window['isWaitingStatus'] && isWaitingStatus()) {
                kindId = "RuntimeTask";
            }
            if (url == 'workflowAction!showTaskDetail.do') {
                showTaskDetail("view", kindId, url, currentTask.id);
            } else {
            	params += "isReadOnly=true&taskKindId=" + currentTask.kindId + "&bizId="
				+ currentTask.bizId + "&taskId=" + currentTask.id;
				
                parent.addTabItem({ tabid: currentTask.id,
                    text: currentTask.name,
                    url: url + params
                });
            }
        } else {
            params += "isReadOnly=true&procInstId=" + currentTask.procInstId + "&bizId=" + currentTask.bizId + "&bizCode=" + currentTask.bizCode + "&processDefinitionKey=" + currentTask.processDefinitionKey + "&procUnitId=" + currentTask.taskDefKey + "&taskId=" + currentTask.id;
            params += "&procUnitHandlerId=" + currentTask.procUnitHandlerId;
            params += "&procInstEndTime=" + currentTask.procInstEndTime;

            parent.addTabItem({ tabid: currentTask.id, text: currentTask.name, url: currentTask.executorUrl + params });
        }
    }
}

function showTaskDetail(action, kindId, url, taskId) {
    UICtrl.showFrameDialog({
        title: '任务明细',
        width: 400,
        height: 360,
        url: web_app.name + "/" + url,
        param: {
            kindId: kindId,
            taskId: taskId
        },
        ok: action == "do" ? function () {
            completeTask.call(this, taskId);
            return true;
        } : false,
        okVal: '完成',
        cancelVal: '关闭',
        cancel: true,
        close: onDialogCloseHandler
    });
}

function completeTask(taskId, fn) {
    Public.ajax(web_app.name + '/workflowAction!completeTask.ajax', {
        taskId: taskId
    }, function () {
        reloadGrid();
        if ($.isFunction(fn)) {
            fn.call(window);
        } 
    });
}

/**
 * TODO 移除
 */
function onDialogCloseHandler() {

}

var HandlerKind = HandlerKind || {};

HandlerKind.MANAGE_AUTHORITY = "ManageAuthority";
HandlerKind.POS = "Pos";
HandlerKind.PSM = "Psm";
HandlerKind.DEPT = "Dept";
HandlerKind.MANAGER_FUN = "ManagerFun";
HandlerKind.SEGMENTATION = "Segmentation";
HandlerKind.MANUAL_SELECTION = "ManualSelection";
HandlerKind.SCOPE_SELECTION = "ScopeSelection";

/**
 * 选择类别处理人
 */
HandlerKind.isSelection = function(handerKindCode){
	return handerKindCode == HandlerKind.MANUAL_SELECTION || handerKindCode == HandlerKind.SCOPE_SELECTION;
}

var CounterSignKind = CounterSignKind || {};
CounterSignKind.CHIEF = "chief";
CounterSignKind.MEND = "mend";
CounterSignKind.MANUAL_SELECTION = "manualSelection";

CounterSignKind.isManualSelection = function(value){
	return value == CounterSignKind.MANUAL_SELECTION
}
