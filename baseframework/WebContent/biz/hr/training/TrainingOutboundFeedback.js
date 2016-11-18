var gridManager = null, refreshFlag = false;
$(document).ready(function () {
    UICtrl.autoSetWrapperDivHeight();
    initializeGrid();
});
//初始化表格
function initializeGrid() {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
        addHandler: addHandler,
        updateHandler: function () {
            updateHandler();
        },
        deleteHandler: deleteHandler,
        assessmentHandler:{
            id:'assessmentHandler',
            text:'效果评估',
            click:function(){
                var row = gridManager.getSelectedRow();
                if (!row) {
                    Public.tip('请选择数据！');
                    return;
                }
              var evaluateId=row.assessmentId;
              parent.addTabItem({
		       tabid: 'trainingEffectEvaList'+evaluateId,
		       text: '学员培训效果评估明细表',
		       url: web_app.name + '/trainingEffectEvaAction!showUpdateTrainingEffectEvaluate.do?bizId=' + evaluateId
	           });
              }
            },
            copy:{  id:'assessmentHandler',
            text:'调度',click:function(){
            	copy();
            }
            }
    });
    gridManager = UICtrl.grid('#maingrid', {
        columns: [
            {display: "所属一级中心名称", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left"},
            {display: "单位名称", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left"},
            {display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left"},
            {display: "员工姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center"},
            {display: "培训讲师", name: "teacherName", width: 100, minWidth: 60, type: "string", align: "center"},
            {display: "培训机构", name: "orgName", width: 100, minWidth: 60, type: "string", align: "left"},
            {display: "课程内容得分", name: "courseScore", width: 100, minWidth: 60, type: "string", align: "left"},
		    {display: "培训师得分", name: "teacherScore", width: 100, minWidth: 60, type: "string", align: "left"},
		    {display: "总分", name: "totalScore", width: 100, minWidth: 60, type: "string", align: "left"},
            {display: "联系人", name: "orgContact", width: 100, minWidth: 60, type: "string", align: "center"},
            {display: "联系电话", name: "orgTel", width: 100, minWidth: 60, type: "string", align: "center"},
            {display: "开始时间", name: "startTime", width: 100, minWidth: 60, type: "string", align: "center"},
            {display: "结束时间", name: "endTime", width: 100, minWidth: 60, type: "string", align: "center"},
            {display: "是否发送培训评估表", name: "isSchedule", width: 100, minWidth: 60, type: "string", align: "center",
            render:function(item){
            	if(item.isSchedule==1){
            		return "是"
            	}else{
            		return "否"
            	}
            } },
            {display: "培训地点", name: "place", width: 100, minWidth: 60, type: "string", align: "left"},
            {display: "培训方式", name: "trainingType", width: 100, minWidth: 60, type: "string", align: "center"},
            {display: "培训实际费用", name: "trainingFee", width: 100, minWidth: 60, type: "string", align: "center"},
            {display: "差旅费", name: "travelExpenses", width: 100, minWidth: 60, type: "string", align: "center"},
            {display: "培训课程", name: "course", width: 100, minWidth: 60, type: "string", align: "left"},
            {display: "培训内容", name: "trainingContent", minWidth: 60, type: "string", align: "left"}
        ],
        dataAction: 'server',
        url: web_app.name + '/trainingOutboundFeedbackAction!slicedQuery.ajax',
        manageType:'hrArchivesManage',
        pageSize: 20,
        width: '100%',
        height: '100%',
        heightDiff: -5,
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'trainingOutboundFeedbackId',
        sortOrder: 'asc',
        toolbar: toolbarOptions,
        fixedCellHeight: true,
        selectRowButtonOnly: true
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
}

function copy(){
	   Public.ajax(web_app.name + '/trainingOutboundApplyAction!createOutboundFeedbackTask.ajax', function () {
            reloadGrid();
        });
}
function initStaffInput(){
    $('#staffName').searchbox({
        type: "hr", name: "queryAllArchiveSelect", manageType: 'hrBaseAttManage',
        back: {
            staffName: "#staffName",
            archivesId: "#archivesId",
            ognId: '#ognId',
            ognName: "#ognName",
            centreId: "#centreId",
            centreName: "#centreName",
            dptId: "#dptId",
            dptName: "#dptName"
        }
    });
}
//添加按钮 
function addHandler() {
    UICtrl.showAjaxDialog({
        url: web_app.name + '/trainingOutboundFeedbackAction!showInsert.load', ok: insert, close: dialogClose, width:500, title: "添加培训反馈", init: initStaffInput});
}

//编辑按钮
function updateHandler(id) {
    if (!id) {
        var row = gridManager.getSelectedRow();
        if (!row) {
            Public.tip('请选择数据！');
            return;
        }
        id = row.trainingOutboundFeedbackId;
    }
    //所需参数需要自己提取 {id:row.id}
    UICtrl.showAjaxDialog({url: web_app.name + '/trainingOutboundFeedbackAction!showUpdate.load', param: {trainingOutboundFeedbackId:id}, ok: update, close: dialogClose, width:500, title: "添加培训反馈",init:initStaffInput});
}

//删除按钮
function deleteHandler() {
    var row = gridManager.getSelectedRow();
    if (!row) {
        Public.tip('请选择数据！');
        return;
    }
    UICtrl.confirm('确定删除吗?', function () {
        //所需参数需要自己提取 {id:row.id}
        Public.ajax(web_app.name + '/trainingOutboundFeedbackAction!delete.ajax', {trainingOutboundFeedbackId:row.trainingOutboundFeedbackId}, function () {
            reloadGrid();
        });
    });
}
//新增保存
function insert() {
     var id=$('#trainingOutboundFeedbackId').val();
     if(id!='') return update();
     $('#submitForm').ajaxSubmit({
        url: web_app.name + '/trainingOutboundFeedbackAction!insert.ajax',
        success: function (data) {
            $('#trainingOutboundFeedbackId').val(data);
            refreshFlag = true;
        }
    });
}

//编辑保存
function update() {
    $('#submitForm').ajaxSubmit({
        url: web_app.name + '/trainingOutboundFeedbackAction!update.ajax',
        success: function () {
            refreshFlag = true;
        }
    });
}
//关闭对话框
function dialogClose() {
    if (refreshFlag) {
        reloadGrid();
        refreshFlag = false;
    }
}
