var bizId, procInstId, procUnitId, isDoModel;

$(function () {
    getQueryParameters();
    initUI();
 
    function getQueryParameters() {
	    bizId = Public.getQueryStringByName("bizId");
	    procInstId = Public.getQueryStringByName("procInstId");
	    procUnitId = Public.getQueryStringByName("procUnitId");
	    isDoModel = Public.getQueryStringByName("isDoModel");
   }
   
	function initUI(){		
		if (!(procUnitId == "Apply" && isDoModel == "true")){
			$("#description").hide();
			$(".fullflash").css("top", "40px");
		}
		initToolBar();
		refreshBtnStatus();
		initFlash();
	}
	
    function initFlash() {
	    var flashVars = { fontswf: web_app.name + '/system/freeFlowDesigner/brcproc.swf' };
	    var params = { wmode: "opaque" };
	    swfobject.embedSWF(web_app.name + "/system/freeFlowDesigner/brcproc.swf", 'mainflash', "100%", "100%",
				"9.0.0", "expressInstall.swf", flashVars, params);
	}	
	
	function initToolBar() {
	    $('#toolBar').toolBar([
			{ id: "parallel", name: '添加并发', icon:"parallel", event:  addParallel },
	        { id: "series", name: '添加串发', icon: "series", event:  addSeries },
	        { id: "save", name: '保存', icon: 'save',  event: save },
	        { id: "delete", name: '删除', icon: 'delete',   event: deleteProcActivity },
	        { id: "close", name: '关闭', icon: 'close', event: function () {
	             parent.freeFlowDesiger.close();
	        }}
	        ]);
	}
	
	function canSave(){
		return isDoModel == "true";
	}
	
	function canAdd(){
		return isDoModel == "true";
	}
	
	function canDelete(){
		return isDoModel == "true";
 	}
	
	function refreshBtnStatus(){
		if (canSave()){
			$("#toolBar").toolBar("enable", "save");
		}else{
			$("#toolBar").toolBar("disable", "save");
		}
		if (canAdd()){
			$("#toolBar").toolBar("enable", "parallel");
			$("#toolBar").toolBar("enable", "series");
		}else{
			$("#toolBar").toolBar("disable", "parallel");
			$("#toolBar").toolBar("disable", "series");
		}
		if (canDelete()){
			$("#toolBar").toolBar("enable", "delete");
		}else{
			$("#toolBar").toolBar("disable", "delete");
		}
	}
	
	function addParallel(){
		if (getFlash().getSelected().type){
			showSelectPsmDialog("parallel");
		}
	}
	
	function addSeries() {
		if (getFlash().getSelected().type){
			showSelectPsmDialog("series");
		}
	}
	
});

function initializeOperateCfg() {

}

function initContextMenu() {

}

function showSelectPsmDialog(kindId) {
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    selectOrgParams = $.extend({}, selectOrgParams, { multiSelect: true, showPosition: false });
    var options = { params: selectOrgParams, confirmHandler: function () {
        doSelectPsm.call(this, kindId);
    }, closeHandler: onDialogCloseHandler, title: "选择人员"
    };
    OpmUtil.showSelectOrgDialog(options);
}

function doSelectPsm(kindId) {
    var data = this.iframe.contentWindow.selectedData;
    if (data.length == 0) {
        Public.errorTip("请选择交办人员。");
        return;
    }

    var _self = this;

    var arr = [];
    var org, newId;
    for (var i = 0; i < data.length; i++) {
        org = data[i];
        newId = getNextId();
        arr.push({
            id: '' + newId, //ID
            text: org.name + "（审批）", //环节显示名称
            activityKind: "1", 
            type: "activity",
            description: org.positionName + "审批",
            personMemberId: org.id, //人员成员ID
            personMemberName: org.name, //人员成员名称
            fullId: org.fullId, //ID全路径
            fullName: org.fullName, //名称全路径
            status: 0     //处理状态       
        });
    }
    if (kindId == "parallel") {
        getFlash().addParallel(arr);
    } else {
        getFlash().addSeries(arr);
    }
    _self.close();
}

function onDialogCloseHandler() {

}

function getProcDescription(){
	return $("#procDescription").val();
}

function setProcDescripiton(value){
	$("#procDescription").val(value);
}


/**
* 保存
*/
function save() {
    var activities = getFlash().getImg();
    var activitiesWithPriorAndNext =  getFlash().getImgWithPriorAndNext();
    
    var params = {
        bizId: bizId,
        procInstId: procInstId,
        description: getProcDescription(),
        activities: $.toJSON(activities),
        activities2: $.toJSON(activitiesWithPriorAndNext)
    };

    if (!params.description) {
        Public.errorTip("请设置流程标题。");
    }

    var url = web_app.name + '/freeFlowAction!saveProcActivity.ajax';
    Public.ajax(url, params, function (data) {
        Public.tip('保存成功。');
    });
}

function getNextId() {
    var result = "";
    var url = web_app.name + '/freeFlowAction!getNextId.ajax';
    Public.syncAjax(url, {}, function (data) {
        result = data;
    });
    return result;
}

function showProcActivityPropertyDialog(data) {
    var params = {};
    
    params.personMemberId = data.personMemberId
    params.personMemberName = encodeURI(data.personMemberName);
    params.fullId = data.fullId;
    params.fullName = encodeURI(data.fullName);
    params.activityKind = encodeURI(data.activityKind || "1");
    params.status = data.status;

    UICtrl.showFrameDialog({
        title: "流程环节属性",
        url: web_app.name + "/freeFlowAction!showProcActivityPropertyDialog.do",
        param: params,
        width: 320,
        height: 300,
        ok: data.status != "-1" ? false: function(){
           doSetProcActivityProperties.call(this, data);
        },
        close: onDialogCloseHandler,
        cancel: true
    });
}

function doSetProcActivityProperties(data) {
    var properties = this.iframe.contentWindow.getProperties();
 
    data.description = properties.description;
    data.personMemberId = properties.personMemberId;
    data.personMemberName = properties.personMemberName;
    data.fullId = properties.fullId;
    data.fullName = properties.fullName;
    data.activityKind = properties.activityKind;
    if (data.activityKind == "1"){
       data.text = properties.personMemberName + "（审批）";
    }else{
       data.text = properties.personMemberName + "（知会）";
    }
    getFlash().updateImg(data);

    this.close();
}

function flash_callback_func(event, data) {
	 console.info(event);
    if (event == 'initFlash') {
        var url = web_app.name + '/freeFlowAction!loadProcActivity.ajax';
        var params = {};
        params.bizId = bizId;
        Public.ajax(url, params, function (data) {
            var activities = [];
            var startId, endId;
            if (data.bizId) {
            	activities = $.parseJSON(data.activities);
            	setProcDescripiton(data.description);
            } else {
                data.description = "";
                startId = getNextId();
                endId = getNextId();
                activities = {type:'series',elements:[{type:'start', id: startId},{type: 'end', id: endId }]};
            }
            $('#mainflash')[0].initImg(activities);
        });
    } else if (event == 'doubleclick') {
    	if (data.type){
	        if (data.type === "start") {
	            showProcPropertyDialog(data);
	        } else {
	            showProcActivityPropertyDialog(data);
	        }
    	}
        // console.info(event + ':' + data.uuid);
    } else if (event == 'rightclick') {
       // console.info(event + ':' + data.uuid + ',x:' + data.stageX + ',y:' + data.stageY);
    }
}

function getFlash() {
    return $('#mainflash')[0];
}

/**
* 删除流程环节
*/
function deleteProcActivity() {
	var activity = getFlash().getSelected();
	if (activity && activity.type == "texttag" && activity.status == "-1") {
		getFlash().removeImg();
	}
}


function getImg() {
    console.info(getFlash().getImg());
}

function getImageSize() {
    var size = getFlash().getImageSize();
    alert(size.width + ',' + size.height);
}