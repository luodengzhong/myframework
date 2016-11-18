var queryParams = {queryKind: 99},nodeData = {}, owningObjectId = -1,isHidden = true,owningObjectIdorg = -99, owningObjectIdcol = -99;//默认查询本月数据
// 默认查询本月数据
function loadOrgTreeView() {
    loadProTreeView();
  //高管个人  重要方案
	$('#orgImportTree').commonTree(
			{
				loadTreesAction : operateCfg.queryOrgAction,
				parentId : 'orgRoot',
				isLeaf : function(data) {
					data.children = [];
					data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId,
							data.status, false);
					return parseInt(data.hasChildren) == 0;
				},
				getParam : function(record) {
					if (record) {
						return {
							showDisabledOrg : 0,
							displayableOrgKinds : "ogn,dpt"
						};
					}
					return {
						showDisabledOrg : 0
					};
				},
				onClick : function(data) {
					if (data && owningObjectIdorg != data.id) {
						materialImportTreeClickHandler(data,3);
					}
				},
				IsShowMenu : false
			});
    
    

	//职能牵头
		$('#FunLeadOrgTree').commonTree(
				{
					loadTreesAction : operateCfg.queryOrgAction,
					manageType : 'planFunLeadOrgManager',
					parentId : 'orgRoot',
					isLeaf : function(data) {
						data.children = [];
						data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId,
								data.status, false);
						return parseInt(data.hasChildren) == 0;
					},
					getParam : function(record) {
						if (record) {
							return {
								showDisabledOrg : 0,
								displayableOrgKinds : "ogn,dpt"
							};
						}
						return {
							showDisabledOrg : 0
						};
					},
					onClick : function(data) {
						if (data && owningObjectIdorg != data.id) {
							FunLeadOrgTreeClickHandler(data,3);
						}
					},
					IsShowMenu : false
				});
 
//		月度重点
	    $('#orgTree').commonTree({
	        loadTreesAction: operateCfg.queryOrgAction,
	        manageType: 'planOrgManage',
	        parentId: 'orgRoot',
	        isLeaf: function (data) {
	            data.children = [];
	            data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId, data.status, false);
	            return parseInt(data.hasChildren) == 0;
	        },
	        getParam: function (record) {
	            if (record) {
	                return {showDisabledOrg: 0, displayableOrgKinds: "ogn,dpt"};
	            }
	            return {showDisabledOrg: 0};
	        },
	        onClick: function (data) {
	            if (data && owningObjectId != data.id) {
	                materialTreeClickHandler(data,0);
	            }
	        },
	        IsShowMenu: false
	    });
	    
	  //高管个人  重要方案
		$('#ExecIndivTaskTree').commonTree(
				{
					loadTreesAction : operateCfg.queryOrgAction,
					parentId : 'orgRoot',
					isLeaf : function(data) {
						data.children = [];
						data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId,
								data.status, false);
						return parseInt(data.hasChildren) == 0;
					},
					getParam : function(record) {
						if (record) {
							return {
								showDisabledOrg : 0,
								displayableOrgKinds : "ogn,dpt"
							};
						}
						return {
							showDisabledOrg : 0
						};
					},
					onClick : function(data) {
						if (data && owningObjectIdorg != data.id) {
							materialImportTreeClickHandler(data,5);
						}
					},
					IsShowMenu : false
				});
	    
}

//点击树节点时加载表格 //高管个人  重要方案
function materialImportTreeClickHandler(data,managerType) { 
	owningObjectId = data.id;
	owningObjectIdorg = data.id;
	var params = $("#queryMainForm").formToJSON();
	params['queryKind'] = 99;
	params.owningObjectId = data.id;
	params.managerType = managerType;
	$('#queryKind').val(99);
	$('#managerType').val(managerType);
	$('#owningObjectId').val(owningObjectId); 
	var url = web_app.name + '/planTaskManagerPlanAction!queryPlanTask.ajax';
	LoadJSONProject(project, url, params);
}

//点击树节点时加载表格/职能牵头
function FunLeadOrgTreeClickHandler(data,managerType) {
	var fullId = getAdministrativeOrgFullId(data);
	if (fullId) {
		owningObjectId = data.id;
		owningObjectIdorg = data.id;
	} else {
		return;
	}
	var params = $("#queryMainForm").formToJSON();
	params['queryKind'] = 99;
	params.owningObjectId = data.id;
	params.managerType = managerType;
	$('#managerType').val(managerType);
	$('#queryKind').val(99);
	$('#owningObjectId').val(owningObjectId);
	/* params.queryKindId = 3; */
	var url = web_app.name + '/planTaskManagerPlanAction!queryPlanTask.ajax';
	LoadJSONProject(project, url, params);
}


//点击树节点时加载表格  月度重点
function materialTreeClickHandler(data,managerType) {
    /*$('.l-layout-center .l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + name+ "]</font>计划类型");
     */
    var fullId = getAdministrativeOrgFullId(data);
    if (fullId) {
        owningObjectId = data.id;
        $('#owningObjectId').val(data.id);
    } else {
        return;
    }
    var params = $("#queryMainForm").formToJSON();
    params.owningObjectId = data.id;
	params.managerType = managerType;
	$('#managerType').val(managerType);
    params['queryKind'] = 99;
    var url = web_app.name + '/planTaskManagerGroupAction!queryPlanTask.ajax';
    LoadJSONProject(project, url, params);
}

function bindEventSelf() {
    bindProEventSelf();
    UICtrl.autoSetWrapperDivHeight(function (_size) {
        if (_size.h > 100) {
            project.setHeight(_size.h - 45);
        }
    });
    //初始隐藏div 更改title的图标，以及响应时间
    $("#orgImportTreeSearch").hide();
    $('#orgImporttitle a').addClass('togglebtn-down');    

    $("#FunLeadOrgTreeSearch").hide();
    $('#funLeadOrgtitle a').addClass('togglebtn-down');    

    $("#myOrgSearch").hide();
    $('#myOrgtitle a').addClass('togglebtn-down');

    $("#ExecIndivTaskTreeSearch").hide();
    $('#execIndivTasktitle a').addClass('togglebtn-down');

    $("#myProSearch").hide();
    $('#myProtitle a').addClass('togglebtn-down');

    $("#myBusiProSearch").hide();
    $('#myBusiProtitle a').addClass('togglebtn-down');

    $('#orgImporttitle a').click(function () { 
        $("#FunLeadOrgTreeSearch").hide();
        $('#funLeadOrgtitle a').addClass('togglebtn-down');    
        $("#myOrgSearch").hide();
        $('#myOrgtitle a').addClass('togglebtn-down');
        $("#ExecIndivTaskTreeSearch").hide();
        $('#execIndivTasktitle a').addClass('togglebtn-down');
        $("#myProSearch").hide();
        $('#myProtitle a').addClass('togglebtn-down');
        $("#myBusiProSearch").hide();
        $('#myBusiProtitle a').addClass('togglebtn-down');
    });

    $('#funLeadOrgtitle a').click(function () {
        $("#orgImportTreeSearch").hide();
        $('#orgImporttitle a').addClass('togglebtn-down');   
        $("#myOrgSearch").hide();
        $('#myOrgtitle a').addClass('togglebtn-down');
        $("#ExecIndivTaskTreeSearch").hide();
        $('#execIndivTasktitle a').addClass('togglebtn-down');
        $("#myProSearch").hide();
        $('#myProtitle a').addClass('togglebtn-down');
        $("#myBusiProSearch").hide();
        $('#myBusiProtitle a').addClass('togglebtn-down');
    });

    $('#myOrgtitle a').click(function () {
        $("#orgImportTreeSearch").hide();
        $('#orgImporttitle a').addClass('togglebtn-down');    
        $("#FunLeadOrgTreeSearch").hide();
        $('#funLeadOrgtitle a').addClass('togglebtn-down');   
        $("#ExecIndivTaskTreeSearch").hide();
        $('#execIndivTasktitle a').addClass('togglebtn-down');
        $("#myProSearch").hide();
        $('#myProtitle a').addClass('togglebtn-down');
        $("#myBusiProSearch").hide();
        $('#myBusiProtitle a').addClass('togglebtn-down');
    });
    
    $('#execIndivTasktitle a').click(function () {
        $("#orgImportTreeSearch").hide();
        $('#orgImporttitle a').addClass('togglebtn-down');    
        $("#FunLeadOrgTreeSearch").hide();
        $('#funLeadOrgtitle a').addClass('togglebtn-down');    
        $("#myOrgSearch").hide();
        $('#myOrgtitle a').addClass('togglebtn-down'); 
        $("#myProSearch").hide();
        $('#myProtitle a').addClass('togglebtn-down');
        $("#myBusiProSearch").hide();
        $('#myBusiProtitle a').addClass('togglebtn-down');
    });

    $('#myProtitle a').click(function () {
        $("#orgImportTreeSearch").hide();
        $('#orgImporttitle a').addClass('togglebtn-down');    
        $("#FunLeadOrgTreeSearch").hide();
        $('#funLeadOrgtitle a').addClass('togglebtn-down');    
        $("#myOrgSearch").hide();
        $('#myOrgtitle a').addClass('togglebtn-down');
        $("#ExecIndivTaskTreeSearch").hide();
        $('#execIndivTasktitle a').addClass('togglebtn-down'); 
        $("#myBusiProSearch").hide();
        $('#myBusiProtitle a').addClass('togglebtn-down');
    });

    $('#myBusiProSearch a').click(function () {
        $("#orgImportTreeSearch").hide();
        $('#orgImporttitle a').addClass('togglebtn-down');    
        $("#FunLeadOrgTreeSearch").hide();
        $('#funLeadOrgtitle a').addClass('togglebtn-down');    
        $("#myOrgSearch").hide();
        $('#myOrgtitle a').addClass('togglebtn-down');
        $("#ExecIndivTaskTreeSearch").hide();
        $('#execIndivTasktitle a').addClass('togglebtn-down');
        $("#myProSearch").hide();
        $('#myProtitle a').addClass('togglebtn-down'); 
    });
    //初始隐藏div 更改title的图标，以及响应时间
    $("#queryDiv").hide();
    $('#queryDivtitle a').addClass('togglebtn-down');
    $('#queryDivtitle a').click(function () {
    	isHidden = isHidden == true?false:true;
        UICtrl.autoSetWrapperDivHeight(function (_size) {
        	if(!isHidden){
                if (_size.h > 200) {
                    project.setHeight(_size.h - 141);
                }
        	}else{
                if (_size.h > 200) {
                    project.setHeight(_size.h - 45);
                }
        	}
        });    	
    });

    //我的任务事件绑定
    $('#myselfTaskSearch').bind('click', function (e) {
        var $clicked = $(e.target || e.srcElement);
        $('div.taskCenterChoose').removeClass('taskCenterChoose');
        if ($clicked.hasClass('taskCenterSearch')) {
            var schemeId = $clicked.attr('id');
            var queryKind = $clicked.attr('queryKind');
            var managerType = $clicked.attr('managerType');
            if (managerType && managerType != '-99') {
                $('#managerType').val(managerType);
            }
            if (schemeId && Public.isBlank(queryKind)) {//自己定义的快捷查询
                var param = shortcutInfoSearchData[schemeId];
                if (param) {
                    clearQueryInput();
                    var tempParams = {};//这里需要对中文编码
                    $.each(param, function (p, o) {
                        tempParams[p] = encodeURI(o);
                    });
                    var url = web_app.name + '/planTaskManagerPlanAction!queryPlanTask.ajax';
                    LoadJSONProject(project, url, tempParams);
                }
            } else {//系统级查询
                $clicked.addClass('taskCenterChoose');
                queryParams['queryKind'] = queryKind;
                if (managerType) {
                    if (managerType == '-99') {
                        owningObjectId = '';
                        $('#owningObjectId').val('-100');
                        managerType = $('#managerType').val();
                        queryParams['managerType'] = managerType;
                    } else {
                        queryParams['managerType'] = managerType;
                    }
                } else {
                    owningObjectId = '';
                    $('#owningObjectId').val('');
                    queryParams['managerType'] = '';
                }
                doQueryList();
            }
        } else if ($clicked.hasClass('ui-icon-trash')) {//删除
            deleteQueryScheme($clicked.parent().attr('id'), $clicked.parent().text());
        } else if ($clicked.hasClass('ui-icon-edit')) {//编辑
            var schemeId = $clicked.parent().attr('id');
            var param = shortcutInfoSearchData[schemeId];
            $('#queryMainForm').formSet(param);
            if ($('#divConditionArea').is(':hidden')) {
                $('#titleConditionArea').find('a.togglebtn').trigger('click');
            }
            $('div.updateTaskQueryScheme').removeClass('updateTaskQueryScheme');
            $("#customDataRange")[(param.dateRange == 10) ? 'show' : 'hide']();
            $clicked.parent().addClass('updateTaskQueryScheme');
        }
    });


    hideNoAccessDiv();

}

//申请修改计划
function applyEdit() {
    var task = project.getSelected();
    applyEditByURl(web_app.name + '/planAuditAction!showInsertAdjustTask.job?planTaskId=' + task.UID, task);
}

function backView() {
    backViewByURL(web_app.name + '/planTaskManagerGroupAction!queryPlanTask.ajax');
}


//加载数据	 
function load() {
    reloadGrid(web_app.name + '/planTaskManagerGroupAction!queryPlanTask.ajax');
    /*loadByURL(web_app.name+'/planTaskManagerGroupAction!queryPlanTask.ajax');*/
}

function exportExcel() {
    exportExcelByURL(web_app.name + '/planTaskManagerGroupAction!queryPlanTask.ajax');
}

function doAddFun(parentTaskUID) {
    parentTaskUID = parentTaskUID ? parentTaskUID : '';
    owningObjectId = $('#owningObjectId').val();
    if (!owningObjectId || "-1" == owningObjectId) {
        Public.tip("请选择新建计划所属的节点！");
        return;
    }
    owningObjectId = owningObjectId ? owningObjectId : '';
    var managerType = $('#managerType').val();
    var critical = "1";
    //计划任务新增，不存在父节点，也不存在所属模块的，设置为管理计划，所属模块设置为责任部门
    var url = web_app.name + '/planAuditAction!showInsertPlanAudit.job?relevanceTaskId=' + parentTaskUID + '&owningObjectId=' + owningObjectId + '&critical=' + critical + '&managerType=' + managerType;
    //计划任务新增，不存在父节点，也不存在所属模块的，设置为管理计划，所属模块设置为责任部门
    parent.addTabItem({tabid: 'addPlanTask', text: '新增任务计划', url: url});
}
/*************计划设置按钮**************/
//计划设置按钮 打开新页面设置成果以及指引文档
function showPlanPreviousSetHandler() {
    var task = project.getSelected();
    if (!task) {
        Public.tip('请选择数据！');
        return;
    }
    var status = task.Status;
    if (status != 0) {
        Public.tip('任务不是\'执行中\'状态，不能变更计划!');
        return;
    }
    var taskId = task.UID;
    var sequence = task.ID;
    var url = web_app.name + '/planAuditAction!showPlanPreviousSet.do?taskId=' + taskId;
    parent.addTabItem({tabid: 'taskPlanSet', text: '任务设置', url: url});
}
/*************上移 下移**************/
//上移flag=true 下移 flag=false
function updateSequenceTask(flag) {
    var task = project.getSelected();
    if (!task) {
        Public.tip('请选择数据！');
        return;
    }
    var status = task.Status;
    if (status != 0) {
        Public.tip('任务不是\'执行中\'状态，不能变更层级!');
        return;
    }
    var taskId = task.UID;
    var sequence = task.ID;
    var parentTaskId = task.ParentTaskUID;
    Public.ajax(web_app.name + '/planAuditAction!updateSequenceTask.ajax',
        {taskId: taskId, flag: flag, sequence: sequence, parentTaskId: parentTaskId, auditId: $('#planAuditId').val()},
        function () {
            reloadGrid();
        }
    );
}
/*************升级\降级**************/

//升级flag=true 降级 flag=false
function updateGradeTask(flag) {
    var task = project.getSelected();
    if (!task) {
        Public.tip('请选择数据！');
        return;
    }
    var status = task.Status;
    if (status != 0) {
        Public.tip('任务不是\'执行中\'状态，不能变更层级!');
        return;
    }
    var taskId = task.UID;
    var sequence = task.ID;
    var parentTaskId = task.ParentTaskUID;
    if (flag && Public.isBlank(parentTaskId)) {//升级时判断是否存在父亲ID
        Public.tip('已是顶级任务不能升级！');
        return;
    }
    UICtrl.confirm('确定要执行' + (flag ? '升级' : '降级') + '操作吗?', function () {
        Public.ajax(web_app.name + '/planAuditAction!updateGradeTask.ajax',
            {taskId: taskId, flag: flag, sequence: sequence, parentTaskId: parentTaskId},
            function () {
                reloadGrid();
            }
        );
    });
}
/************计划查询条件***************/
//执行查询
function doQueryList(keywords, flag) {
    if (typeof keywords == 'string') {
        queryParams['keywords'] = encodeURI(keywords);
    }
    if ($('#queryDateRangeDiv').is(':visible')) {
        var dateRange = $('#queryDateRange6').getValue();
        queryParams['dateRange'] = dateRange;
    } else {
        queryParams['dateRange'] = '';
    }

    var taskStatus = $('#taskStatus').val();
    queryParams['taskStatus'] = taskStatus;
    owningObjectId = $('#owningObjectId').val();
    queryParams['owningObjectId'] = owningObjectId;
    if (flag) {//是页面点击按钮
        dateRange = $('#selectDateRange').val();
        if (dateRange == 10 && (!getStartDate(true) || !getEndDate(true))) {
            Public.tip("请选择开始日期和结束日期！");
            return;
        }
        var endDateRange = $('#endDateRange').val();
        if (endDateRange == 10 && (!getStartDate(false) || !getEndDate(false))) {
            Public.tip("请选择开始日期和结束日期！");
            return;
        }
        clearQueryInput();
    }
    var params = $("#queryMainForm").formToJSON();
//	var param = $(keywords).formToJSON();
    queryParams = $.extend(queryParams, params);
    var url = web_app.name + '/planTaskManagerGroupAction!queryPlanTask.ajax';
    LoadJSONProject(project, url, queryParams);
}

//查询
function query(obj) {
    doQueryList(obj, true)
}

//刷新表格
/*function reloadGrid() {
 gridManager.loadData();
 }
 */
//重置表单
function resetForm(obj) {
    $(obj).formClean();
    owningObjectId = '';
    $('#owningObjectId').val('');
    $('#queryKind').val('99');
}

function dofinishtask() {
    UICtrl.confirm('确定发布到期任务的待办任务吗?', function () {
        //所需参数需要自己提取 {id:row.id}?planTaskId='+task.UID,task);
        Public.ajax(web_app.name + '/planTaskManagerAction!showTaskChooseReport.ajax', {}, function () {

        });
    });

}

function donofinishtask() {
    UICtrl.confirm('确定发布置为未完任务的待办任务吗?', function () {
        //所需参数需要自己提取 {id:row.id}?planTaskId='+task.UID,task);
        Public.ajax(web_app.name + '/planTaskManagerAction!showNoReportNoFinishTask.ajax', {}, function () {
alert();
        });
    });

}


/**********汇报任务进度***********/
function progressReporting() {
    progressReport(web_app.name + "/planTaskManagerGroupAction!checkTaskReport.ajax");
}
/**********删除计划***********/
//申请修改计划
function applyDelete() {
    var task = project.getSelected();
    if (!task) {
        Public.tip('请选中任务！');
        return;
    }
    var status = task.Status;
    if (status != 0) {
        Public.tip('任务不是\'执行中\'状态，不能删除!');
        return;
    }
    var planTaskId = task.UID;
    UICtrl.confirm('确定删除吗?', function () {
        //所需参数需要自己提取 {id:row.id}?planTaskId='+task.UID,task);
        Public.ajax(web_app.name + '/planTaskManagerGroupAction!deleteTask.ajax?taskId=' + task.UID, {}, function () {
            reloadGrid(web_app.name + '/planTaskManagerGroupAction!queryPlanTask.ajax');
        });
    });

}
/**********计划未完设置true取消未完设置、false设置为未完type朝珠类型***********/
function applyUpdateStatues(type, index) {
	var idsInfo ;
    var tasks = project.getSelecteds();
    if (!tasks||tasks.length<=0) {
        Public.tip('请选择计划！');
        return;
    }
	var ids = new Array();
    var changeStatus = null == index ? 0 : index;
    var title = '';
    var taskOperationTypeId;
	for (var i = 0; i < tasks.length; i++) {
		var task = tasks[i]
	    var status = task.Status;
	    if ('3' == index) {
	        //设置为未完，校验当前状态
	        if (status == 1) {
	            Public.tip('任务是\'已完成\'状态，不能执行置为未完!');
	            return;
	        }
	        //其他都可设置为置为未完，UNNING("执行中", "0"), COMPLETED("已完成", "1"), ABORTED("已中止", "2"), UNFINISH("未完", "3"), UNFINISHADD("未完新增", "4")
	    }
	    if ('1' == type && '0' == index) {
	        //设置为取消未完，校验当前状态
	        if (status != 3) {
	            Public.tip('任务不是\'未完\'状态，不需取消未完操作!');
	            return;
	        }
	    }
		ids[i] = tasks[i].UID;
	}
	if(!ids) return;
	idsInfo = $.toJSON(ids);		
    if ('3' == index) {
        //设置为未完，校验当前状态
        changeStatus = 3;
        title = '确定设置计划为置为未完状态吗?'
	        taskOperationTypeId = 2
        //其他都可设置为置为未完，UNNING("执行中", "0"), COMPLETED("已完成", "1"), ABORTED("已中止", "2"), UNFINISH("未完", "3"), UNFINISHADD("未完新增", "4")
    }
    if ('1' == type && '0' == index) {
        //设置为取消未完，校验当前状态
        changeStatus = 0;
        title = '确定设置计划为执行中状态吗?'
	    taskOperationTypeId = 5
    }
    if ('3' != index && !('1' == type && '0' == index)) {
        //设置为取消未完，校验当前状态
        title = '确定更改计划状态吗?'
        taskOperationTypeId = 1==index?4:0==index?1:2==index?3:3==index?2:12;
    }
    UICtrl.confirm(title, function () {
        //所需参数需要自己提取 {id:row.id}?planTaskId='+task.UID,task);
        var param = {taskIds: idsInfo, status: changeStatus, oldStatus: status,taskOperationTypeId:taskOperationTypeId};
        if (!param) return false;
        var url = web_app.name + "/planTaskManagerPlanAction!applyUpdateStatues.ajax";
        Public.ajax(url, param, function () {
            reloadGrid(web_app.name + '/planTaskManagerPlanAction!queryPlanTask.ajax');
        });
    });

}


/**********计划未完类型和目录***********/
function applyUpdateObject(changetype, ischangepath) {
    var task = project.getSelected();
//    var tasks = project.getSelecteds();
    //设置只允许选择计划或者目录,不允许交叉选择
    if (!task) {
        Public.tip('请选择计划或者目录！');
        return;
    }
    var planTaskId = task.UID;
	var planTaskIds = null;	
	var tasks = project.getSelecteds();
	if (!tasks||tasks.length<=0) {
	    Public.tip('请选择计划或者目录！');
	    return;
	}
	var ids = new Array();
	var folderType = false,taskType = false;
	for (var i = 0; i < tasks.length; i++) {
		if('-111' ==tasks[i].TaskKindId ){
			folderType = true;
		}else{
			taskType = true;
		}
		if(folderType &&taskType){
			 Public.tip('目录和计划数据只允许选择一种类型,不能均选！');	
			 return;
		}
		ids[i] = tasks[i].UID;
	}
	if(!ids) return;
	idsInfo = $.toJSON(ids);
    var params = {
        "planId": planTaskId,
        "taskId": planTaskId
    };
    UICtrl.showFrameDialog({
        title: "选择移动到的计划模块和节点或者目录",
        url: web_app.name + "/planTaskManagerPlanAction!showSelectMovePlanDialog.do",
        param: params,
        width: 700,
        height: 400,
        ok: function () {
//    			var _self=this,data = _self.iframe.contentWindow.allData;
            //1，7选择项目，其余下选择组织，6X，4X则不做校验 
           var _self = this;
           var managerType = _self.iframe.contentWindow.$('#managerType').val();
           var  contentWindow = _self.iframe.contentWindow
           var  owningObjectId = contentWindow.owningObjectId;
	       var dataRows = contentWindow.taskfoldListgridManager.getSelectedRow();
	       var folderId;
	       if(dataRows){
	    	   folderId = dataRows.taskId;
	       }            
            saveApplyUpdateObject(owningObjectId, managerType, planTaskId,idsInfo,folderId);
            _self.close();
        }
    }); 

}
function saveApplyUpdateObject(owningObjectId, managerType,planTaskId,taskIds,folderId) {
    var params = {};
    params.owningObjectId = owningObjectId;
    params.managerType = managerType;
    params.planTaskId = planTaskId;
    params.taskIds = taskIds;
    params.folderId = folderId;

    var url = web_app.name + "/planTaskManagerPlanAction!saveApplyUpdateObject.ajax";
    Public.ajax(url, params, function () {
        reloadGrid(web_app.name + '/planTaskManagerPlanAction!queryPlanTask.ajax');
    });
   /* Public.ajax("/planTaskManagerPlanAction!saveApplyUpdateObject.ajax", params, function (data) {
        //重新加载成果信息
        reloadDocumentGrid();
    });*/
}
/**********计划更改人员。1，人员替换（所有计划）2选择计划替换对应类型人员（批量修改）。，***********/
function applyUpdatePerson(changeType) {
	var idsInfo ;
    var taskOperationTypeId = 8;
	if(2==changeType){
	    var tasks = project.getSelecteds();
	    if (!tasks||tasks.length<=0) {
	        Public.tip('请选择计划或者目录！');
	        return;
	    }
		var ids = new Array();
		for (var i = 0; i < tasks.length; i++) {
			ids[i] = tasks[i].UID;
		}
		if(!ids) return;
		idsInfo = $.toJSON(ids);
		taskOperationTypeId = 7;
	}
	UICtrl.showAjaxDialog({title: "编辑人员信息",width: 800,
		url: web_app.name + '/planTaskManagerPlanAction!showApplyUpdatePerson.load', 
		param:{"planIds": idsInfo,"taskIds": idsInfo,"changeType":changeType}, 
		init:function(doc){
			psmSelect();
		},		
		ok: function(doc){
			saveApplyUpdatePerson(taskOperationTypeId);
		}, close: dialogClose});
	
}

function psmSelect(){
	$('#oldOwnerName').searchbox({
		type:'sys',name:'psmSelect',
		back:{id:'#oldOwnerId',name:'#oldOwnerName'}
	});

	$('#ownerName').searchbox({
		type:'sys',name:'psmSelect',
		back:{id:'#ownerId',name:'#ownerName'}
	});
}
function saveApplyUpdatePerson(taskOperationTypeId) {
	if(!taskOperationTypeId){
		taskOperationTypeId = 7
	}
    taskDepts = getDeptArray();// 调用taskPersonChooseUtil.js中方法
    taskOwners = getOwnerArray(1);// 调用taskPersonChooseUtil.js中方法
    taskExecutors = getExecutorArray();// 调用taskPersonChooseUtil.js中方法
    taskManager = getManagerArray(0);// 调用taskPersonChooseUtil.js中方法    
	$('#submitForm').ajaxSubmit({url: web_app.name + '/planTaskManagerPlanAction!updateApplyUpdatePerson.ajax',
		param:{"taskDepts": taskDepts,"taskOwners": taskOwners,"taskExecutors": taskExecutors,"taskManager": taskManager,"taskOperationTypeId":taskOperationTypeId}, 
		success : function() {
		}
	});
}

//维护计划类型的成果信息
function addHandler() {
    var taskId = $('#taskId').val();
    var owningObjectId = $('#owningObjectId').val();
    if (taskId == '') {
        Public.tip("请选择需要修改前置任务的计划!");
        return;
    }
    var params = {
        "parentId": 0,
        "taskId": taskId,
        "owningObjectId": owningObjectId
    };

    UICtrl.showFrameDialog({
        title: "选择前置计划",
        url: web_app.name + "/planSetAction!showSelectPlanPreviousDialog.do",
        param: params,
        width: 700,
        height: 400,
        ok: function () {
//			var _self=this,data = _self.iframe.contentWindow.allData;
            var _self = this, data = _self.iframe.contentWindow.gridManager.rows;
            if (!data)
                return;
            selectPrevious(taskId, owningObjectId, data);
            _self.close();
        }
    });
}

function selectPrevious(taskId, owningObjectId, nodes) {
    var previousTypeIds = [];
    var previousTypeNames = [];
    var previousPlanIds = [];
    var previousPlanNames = [];
    var delayDayss = [];
    var sequences = [];

    $.each(nodes, function (index, data) {
        previousTypeIds.splice(0, 0, data.previousTypeId);
        previousTypeNames.splice(0, 0, data.previousTypeName);
        previousPlanIds.splice(0, 0, data.previousPlanId);
        previousPlanNames.splice(0, 0, data.previousPlanName);
        delayDayss.splice(0, 0, data.delayDays);
        sequences.splice(0, 0, data.sequence);
    });

    var params = {};
    params.owningObjectId = owningObjectId;
    params.taskId = taskId;
    params.modifyDocument = true;
    params.previousTypeIds = $.toJSON(previousTypeIds);
    params.previousTypeNames = $.toJSON(previousTypeNames);
    params.previousPlanIds = $.toJSON(previousPlanIds);
    params.previousPlanNames = $.toJSON(previousPlanNames);
    params.delayDayss = $.toJSON(delayDayss);
    params.sequences = $.toJSON(sequences);

    Public.ajax("planSetAction!insertPlanPreviousList.ajax", params, function (data) {
        //重新加载成果信息
        reloadGrid();
    });
}


//申请刷版计划,列表,和正常计划一样.
function applyEditByRefresh(url,task){
	//需要最后选中的是一个目录,除此之外,所有选中的计划中,排除目录,进行计划更新,

	var idsInfo ;
    var tasks = project.getSelecteds();
    if (!tasks||tasks.length<=0) {
        Public.tip('请选择计划！');
        return;
    }
	var ids = new Array();
    var  planTaskId ;
	for (var i = 0; i < tasks.length; i++) {
		var task = tasks[i]
	    var status = task.Status;
	        //设置为未完，校验当前状态
        if (status != 0) {
            Public.tip('任务不是\'执行中\'状态，不能执行刷版操作!');
            return;
        }
        if('-111' == task.TaskKindId){
        	planTaskId = task.UID;//parentTaskId
        }
	    //其他都可设置为置为未完，UNNING("执行中", "0"), COMPLETED("已完成", "1"), ABORTED("已中止", "2"), UNFINISH("未完", "3"), UNFINISHADD("未完新增", "4")
	
		ids[i] = tasks[i].UID;
	}
	if(!ids) return;
	if(!planTaskId) { Public.tip('没有刷版对应的目录,不能进行刷版操作!');return;}
	idsInfo = $.toJSON(ids);	
	var url = web_app.name + "/planTaskManagerPlanAction!showInsertAdjustAllTask.job?planTaskId="+planTaskId+"&ids="+idsInfo;
    parent.addTabItem({ tabid: 'adjustAllTask', text: '任务计划刷版', url:url});
}


function initPlanAudit() {
	var idsInfo ;
	    var tasks = project.getSelecteds();
	    if (!tasks||tasks.length<=0) {
	        Public.tip('请选择计划或者目录！');
	        return;
	    }
		var ids = new Array();
		for (var i = 0; i < tasks.length; i++) {
			ids[i] = tasks[i].UID;
		}
		if(!ids) return;
		idsInfo = $.toJSON(ids);
	UICtrl.showAjaxDialog({title: "编辑人员信息",width: 800,
		url: web_app.name + '/planTaskManagerPlanAction!showApplyUpdatePerson.load', 
		param:{"planIds": idsInfo,"taskIds": idsInfo,"changeType":3}, 
		init:function(doc){
			psmSelect();
		},		
		ok: saveInitPlanAudit, close: dialogClose});
}

function saveInitPlanAudit() {
    taskOwners = getOwnerArray(1);// 调用taskPersonChooseUtil.js中方法
	$('#submitForm').ajaxSubmit({url: web_app.name + '/planTaskManagerPlanAction!saveInitPlanAudit.ajax',
		param:{"taskOwners": taskOwners}, 
		success : function() {
		}
	});
}

//隐藏没有权限的按钮
function hideNoAccessDiv() {
    var noAccessList = UICtrl.getPermissionField('noaccess', '2');
    $.each(noAccessList, function (i, o) {
//		var divbt =document.getElementById("o").style.display;  
//		$("#hidediv").show();//显示div    
        $("#" + o).hide();//隐藏div
//		divbt.hide();
    });
}



//关闭对话框
function dialogClose(){
    reloadGrid(web_app.name + '/planTaskManagerPlanAction!queryPlanTask.ajax');
}


function loadProTreeView(nodeData) {
	loadProjectTreeView(nodeData);
	loadProjectBusiTreeView(nodeData);
}
function loadProjectTreeView(nodeData) {
	nodeData = nodeData || {};
	// 显示资源业态树形
	$('#proTree')
			.commonTree(
					{
						loadTreesAction : "/projectOrganAction!queryProjectTree.ajax",
						idFieldName : 'id',
						parentIDFieldName : 'parentId',
						 manageType : 'planProjectManager',
						parentId :'C232482A7AEA42C0B53A7AE628A9B7E2',
						textFieldName : "name",
						iconFieldName : "nodeIcon",
						sortName : 'orgId',// 排序列名
						sortOrder : 'asc',// 排序方向
						checkbox:false,
						isLeaf : function(data) {
							return data.hasChildren==0;
						},
						getParam : function(e){
							var param = {};
							param.showDisabledOrg = 0;
							param.displayableOrgKinds='ogn,prj';
							param["projectId"] = nodeData.projectId;
							if(e){
								param.rootCode=e.code;
							}
							return param;
						},
						onClick : function(data) {
							if (data && data.resourceKindId && owningObjectId != data.id) {
								if (data.resourceKindId == 'project'||data.resourceKindId == 'stage') {
									projectTreeClickHandler(data,1);
								}
							}
						},
						dataRender:function(data){
							if(data.rootCode=='SCLGHJ'){
								var rows = data.Rows;
								var row = {};
								row.id="otherOrg";
								row.name="其他项目";
								row.parentId=data.parentId;
								rows.push(row);
								return rows;
							}
							return data.Rows;
						},
						IsShowMenu : false
					});

}

function loadProjectBusiTreeView(nodeData) {
	nodeData = nodeData || {};
	// 显示资源业态树形
	$('#proBusiTree')
	.commonTree(
			{
				loadTreesAction : "/projectOrganAction!queryProjectTree.ajax",
				idFieldName : 'id',
				parentIDFieldName : 'parentId',
				 manageType : 'planProjectManager',
				parentId :'C232482A7AEA42C0B53A7AE628A9B7E2',
				textFieldName : "name",
				iconFieldName : "nodeIcon",
				sortName : 'orgId',// 排序列名
				sortOrder : 'asc',// 排序方向
				checkbox:false,
				isLeaf : function(data) {
					return data.hasChildren==0;
				},
				getParam : function(e){
					var param = {};
					param.showDisabledOrg = 0;
					param.displayableOrgKinds='ogn,prj';
					param["projectId"] = nodeData.projectId;
					if(e){
						param.rootCode=e.code;
					}
					return param;
				},
				onClick : function(data) {
					if (data && data.resourceKindId && owningObjectId != data.id) {
						if (data.resourceKindId == 'project'||data.resourceKindId == 'stage') {
							projectTreeClickHandler(data,1);
						}
					}
				},
				dataRender:function(data){
					if(data.rootCode=='SCLGHJ'){
						var rows = data.Rows;
						var row = {};
						row.id="otherOrg";
						row.name="其他项目";
						row.parentId=data.parentId;
						rows.push(row);
						return rows;
					}
					return data.Rows;
				},
				IsShowMenu : false
			});	

}
// 显示资源业态树形
function loadProjectTree(nodeData) {
	nodeData = nodeData || {};
	$('#proTree')
			.commonTree(
					{
						loadTreesAction : "/projectAction!queryProjectResourceTree.ajax",
						idFieldName : 'id',
						manageType : 'planProjectManager',
						parentIDFieldName : 'parentId',
						parentId : nodeData.parentId || 'C232482A7AEA42C0B53A7AE628A9B7E2',
						textFieldName : "name",
						iconFieldName : "nodeIcon",
						sortName : 'sequence',// 排序列名
						sortOrder : 'asc',// 排序方向
						checkbox : false,
						getParam : function(data) {
							var param = {};
							param['searchQueryCondition'] = "(resource_kind_id is null OR resource_kind_id in ('project','stage'))";
							param["projectId"] = nodeData.projectId;
							return param;
						},
						isLeaf : function(data) {
							return data.hasChildren == 0;
						},
						onClick : function(data) {
							if (data && owningObjectId != data.id) {
								projectTreeClickHandler(data,1);
							}
						},
						IsShowMenu : false
					});
}

//显示资源业态树形
function loadProjectBusiTree(nodeData) {
	nodeData = nodeData || {};
	$('#proBusiTree')
			.commonTree(
					{
						loadTreesAction : "/projectAction!queryProjectResourceTree.ajax",
						idFieldName : 'id',
						manageType : 'planProjectManager',
						parentIDFieldName : 'parentId',
						parentId : nodeData.parentId || 'C232482A7AEA42C0B53A7AE628A9B7E2',
						textFieldName : "name",
						iconFieldName : "nodeIcon",
						sortName : 'sequence',// 排序列名
						sortOrder : 'asc',// 排序方向
						checkbox : false,
						getParam : function(data) {
							var param = {};
							param['searchQueryCondition'] = "(resource_kind_id is null OR resource_kind_id in ('project','stage'))";
							param["projectId"] = nodeData.projectId;
							return param;
						},
						isLeaf : function(data) {
							return data.hasChildren == 0;
						},
						onClick : function(data) {
							if (data && owningObjectId != data.id) {
								projectTreeClickHandler(data,1);
							}
						},
						IsShowMenu : false
					});
}

function bindProEventSelf() {

	$("#projectName").searchbox({
		type : 'masterdata',
		name : 'mdProjectSelect',
		 manageType : 'planProjectManager',
		onChange : function(values, nodeData) {
			$("#projectName").val(nodeData.name);
			$("#proTree").data('ui-common-tree', 0);
			if(nodeData.name){
				loadProjectTree(nodeData);
			}
			if(!nodeData.name){
				loadProTreeView();
			}
		}
	});

	$("#projectBusiName").searchbox({
		type : 'masterdata',
		name : 'mdProjectSelect',
		 manageType : 'planProjectManager',
		onChange : function(values, nodeData) {
			$("#projectBusiName").val(nodeData.name);
			$("#proBusiTree").data('ui-common-tree', 0);
			if(nodeData.name){
				loadProjectBusiTreeView(nodeData);
			}
			if(!nodeData.name){
				loadProjectBusiTree();
			}
		}
	});

}



// 点击树节点时加载表格
function projectTreeClickHandler(data,managerType) {
	owningObjectId = data.id;
	$('#owningObjectId').val(data.id);
	var params = $("#queryMainForm").formToJSON();
	params.owningObjectId = data.id;// projectId
	params.managerType = managerType;
	$('#managerType').val(managerType);
	params['queryKind'] = 99;
	/* params.queryKindId = 1; */
	var url = web_app.name + '/planTaskManagerGroupAction!queryPlanTask.ajax';
	LoadJSONProject(project, url, params);
}


var chooseFilterTaskGridManager = null, refreshFlag = false;
$(document).ready(function() {
	initchooseFilterTaskGrid();
});

//初始化表格
function initchooseFilterTaskGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		leadIntoHandler:{id:'leadInto',text:'引入计划', click:leadIntoHandler, img:'icon_package_get.gif'},
		sendQuotoApplayHandler:{id:'sendQuotoApplay',text:'发起引用审批', click:sendQuotoApplayHandler, img:'star_add.gif'}

	});
	chooseFilterTaskGridManager = UICtrl.grid('#chooseFilterTaskGrid', {
		columns: [
		  		{ display: "计划名称", name: "taskName", width: 200, minWidth: 60, type: "string", align: "left" },	    
		  		{ display: "级别", name: "taskLevel", width: 60, minWidth: 60, type: "string", align: "left",render:function(item){
		  			var _nm = "";
		  			var _val = item.taskLevel;
		  			if(_val=='hza')
		  				_nm = '核重A';
		  			else if(_val=='hz')
		  				_nm = '核重';
		  			else if(_val=='5a')
		  				_nm = '5A';
		  			else if(_val=='4a')
		  				_nm = '4A';
		  			else if(_val=='3a')
		  				_nm = '3A';
		  			else if(_val=='c')
		  				_nm = 'C';
		  			
		  			return _nm;
		  		}},		   
		  		{ display: "计划开始时间", name: "startDate", width: 100, minWidth: 60, type: "string", align: "left" },
		  		{ display: "计划结束时间", name: "finishDate", width: 100, minWidth: 60, type: "string", align: "left" },
		  		{ display: "责任人", name: "ownerName", width: 100, minWidth: 60, type: "string", align: "left" },
		  		{ display: "责任部门", name: "dutyDeptName", width: 180, minWidth: 60, type: "string", align: "left" }
		  		],
		  		dataAction : 'server', 
		  		usePager : false,
//		  		pageSize : 20,		
		  		width : '100%',
		  		height : '100%',
		  		heightDiff : -10,
		  		headerRowHeight : 25,
		  		rowHeight : 25,
		  		sortName:'id',
		  		sortOrder:'asc',
		  		fixedCellHeight : true,
		  		toolbar: toolbarOptions,	
		  		selectRowButtonOnly : true,
		  		checkbox : false
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

//添加默认数据行
function addFilterTaskGridHandler(UID, Name,StartDate,FinishDate, TaskLevel, OwnerName, DutyDeptName){
	UICtrl.addGridRow(chooseFilterTaskGridManager,
		{taskName:Name,taskLevel:TaskLevel,startDate: StartDate, finishDate: FinishDate, 
		ownerName:OwnerName,  dutyDeptName:DutyDeptName, taskId: UID});  
}

function leadIntoHandler() {
	//读取project数据,并获取列写入引用表格
	//往chooseFilterTaskGridManager中间写数据 
    var tasks = project.getSelecteds();
    if (!tasks||tasks.length<=0) {
        Public.tip('请选择引用的计划！');
        return;
    }
	var ids = new Array();
    var  planTaskId ;
	for (var i = 0; i < tasks.length; i++) {
		var task = tasks[i]
	    var status = task.Status;
	        //设置为未完，校验当前状态
        if (status != 0) {
            Public.tip('任务不是\'执行中\'状态，不能执行引用操作!');
            return;
        }
        if('-111' == task.TaskKindId){
            Public.tip('目录不执行引用操作!');
            return;
        } 
        addFilterTaskGridHandler(task.UID, task.Name,task.StartDate,task.FinishDate, task.TaskLevel, task.OwnerName, task.DutyDeptName);
    }
	  
}

function sendQuotoApplayHandler() {
	//读取chooseFilterTaskGridManager数据,转入后台进行task初始化转换默认生成计划数据,并将数据生成为制定审批记录.
	var idsInfo ;
	var ids = new Array();
	var detailData = DataUtil.getGridData({gridManager: chooseFilterTaskGridManager});
	if(!detailData){
	      Public.tip("请筛选计划,并引用后发起审批！");
	      return;
	}
	for (var i = 0; i < detailData.length; i++) {
		ids[i] = detailData[i].taskId;
	}
	if(!ids) return;
	idsInfo = $.toJSON(ids); 
    var managerTypeBase = $('#managerTypeBase').val();
    var owningObjectIdBase = $('#owningObjectIdBase').val();
	var url = web_app.name+ '/planAuditAction!showLeadIntoPlanAudit.job?idsInfo='+idsInfo+'&owningObjectId='+owningObjectIdBase+
	'&managerType='+managerTypeBase;
	var  planTaskId = $('#planTaskId').val();
	if(planTaskId){
		url = url+"&planTaskId="+planTaskId
	}  
	parent.addTabItem({tabid : 'addQuotoApplayPlanTask',text : '新增引用计划', url : url});
}
