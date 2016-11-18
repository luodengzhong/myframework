var gridManager = null,
refreshFlag = false;
$(document).ready(function() {
    UICtrl.autoSetWrapperDivHeight();
    initializeUI();
    initializeGrid();
});
function initializeUI() {
    UICtrl.layout("#layout", {
        leftWidth: 200,
        heightDiff: -5
    });
    $('#maintree').commonTree({
        loadTreesAction: 'orgAction!queryOrgs.ajax',
        parentId: 'orgRoot',
        manageType: 'hrPerFormAssessManage',
        getParam: function(e) {
            if (e) {
                return {
                	showVirtualOrg: 1,
                    showDisabledOrg: 0,
                    displayableOrgKinds: "ogn,dpt"
                };
            }
            return {
                showDisabledOrg: 0
            };
        },
        changeNodeIcon: function(data) {
            data[this.options.iconFieldName] = OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
        },
        IsShowMenu: false,
        onClick: onFolderTreeNodeClick
    });
    $('#periodMapQuery').combox({
        onChange: function() {
        	var fullId = $('#mainFullId').val();
            if (fullId == '' || fullId == '-1') {
                return;
            }
            query($('#queryMainForm'));
        }
    });
}
function onFolderTreeNodeClick(data) {
	//点击是判断是否是考核主题
    var fullId = '';
    $('.l-layout-center .l-layout-header').html('被考核人列表');
    $('#mainFullId').val('');
    gridManager.options.parms['fullId'] = '';
    if (data) {
    	fullId = data.fullId;
    	//鉴权通过后才能执行
		Public.authenticationAssessSubject('hrPerFormAssessManage',fullId,true,function(flag){
			if(flag){
				$('#mainFullId').val(fullId);
				$('.l-layout-center .l-layout-header').html("<font style=\"color:Tomato;font-size:13px;\">[" + data.name + "]</font>" + '被考核人列表');
				UICtrl.gridSearch(gridManager, {
			           fullId: fullId,
			           periodCode: $('#periodMapQuery').val()
			    });
			}else{
				//清除数据
				$('#mainFullId').val('');
				gridManager._clearGrid();
				Public.tip('选择的单位没有权限！');
			}
		});
    }
    
}
// 初始化表格
function initializeGrid() {
    var toolbarOptions = UICtrl.getDefaultToolbarOptions({
        startPerformAssess: {
            id: 'startPerformAssess',
            text: '发起考评',
            img: 'page_dynamic.gif',
            click: startPerformAssess
        },
        modifAssessSubject: {
        	id: 'modifAssessSubject',
            text: '修改考核排名单位',
            img: 'page_boy.gif',
            click: modifAssessSubject
        },
        forwardFormNotPass: {
            id: 'forwardFormNotPass',
            text: '考评表未启用',
            img: 'page_find.gif',
            click: forwardFormNotPass
        },
        forwardNoFormPerson: {
            id: 'forwardNoFormPerson',
            text: '无考核表人员',
            img: 'page_find.gif',
            click: forwardNoFormPerson
        },
        exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		 startOnJobAssess: {
            id: 'startOnJobAssess',
            text: '发起胜任力测评(特殊)',
            img: 'page_dynamic.gif',
            click: startOnJobAssess
        }
		
    });
    gridManager = UICtrl.grid('#maingrid', {
        columns: [{
            display: "姓名",
            name: "staffName",
            width: 60,
            minWidth: 60,
            type: "string",
            align: "left"
        },
        {
            display: "考核表",
            name: "templetName",
            width: 140,
            minWidth: 60,
            type: "string",
            align: "left"
        },
         {
            display: "考核表最后更新时间",
            name: "updateDate",
            width: 100,
            minWidth: 60,
            type: "String",
            align: "left"
        },
         {
            display: "排名单位",
            name: "orgnName",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        },
        {
            display: "排名单位路径",
            name: "rankFullName",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        },
         {
            display: "所在单位",
            name: "ognName",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        },
         {
            display: "所在中心",
            name: "centreName",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        },
         {
            display: "所在岗位",
            name: "posName",
            width: 100,
            minWidth: 60,
            type: "string",
            align: "left"
        },
         {
            display: "操作",
            width: 150,
            minWidth: 60,
            type: "string",
            align: "center",
            render: function(item) {
                var html = ['<a href="javascript:showForm(', item.evaluationId, ',\'', item.templetName, '\');" class="GridStyle">'];
                html.push('查看考评表');
                html.push('</a>', '&nbsp;&nbsp;');
                html.push('<a href="javascript:showPerson(', item.underAssessmentId, ');" class="GridStyle">');
                html.push('查看评分人');
                html.push('</a>');
                return html.join('');
            }},
        
         
        {
            display: "类别",
            name: "periodName",
            width: 60,
            minWidth: 60,
            type: "string",
            align: "left"
        },
         {
            display: "入职时间",
            name: "employedDate",
            width: 80,
            minWidth: 60,
            type: "string",
            align: "left"
        },
          {
            display: "离职时间",
            name: "departurDate",
            width: 80,
            minWidth: 60,
            type: "string",
            align: "left"
        }
        
       ],
        dataAction: 'server',
        url: web_app.name + '/performassessAction!slicedQueryUnderAssessment.ajax',
        parms: {
            status: "1",paType:$('#paType').val
        },
        pageSize: 20,
        manageType: 'hrPerFormAssessManage',
        width: '99%',
        height: '100%',
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        sortName: 'sequence',
        sortOrder: 'asc',
        toolbar: toolbarOptions,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        checkbox: true,
        onLoadData: function() {
            return ! ($('#mainFullId').val() == '');
        }
    });
}
// 刷新表格
function reloadGrid() {
    gridManager.loadData();
}
// 查询
function query(obj) {
    var fullId = $('#mainFullId').val();
    if (fullId == '' || fullId == '-1') {
        Public.tip("请选择组织节点!");
        return;
    }
    var param = $(obj).formToJSON();
    UICtrl.gridSearch(gridManager, param);
}

function startPerformAssess() {
    var fullId = $('#mainFullId').val();
    if (fullId == '' || fullId == '-1') {
        Public.tip("请选择组织节点!");
        return;
    }
    var total=gridManager.currentData[gridManager.options.record];
    if(total<1){
    	Public.tip("没有需要发起的考评!");
        return;
    }
    var fn=function(){Public.successTip("考评已成功发起!");};
    var selectedRows = gridManager.getSelectedRows();
    if(selectedRows.length>0){//发起选中人员的考评
    	var underAssessmentIds = new Array();
    	$.each(selectedRows,function(i,o){
    		underAssessmentIds.push(o['underAssessmentId']);
    	});
    	UICtrl.confirm('您确定发起<font color=red>选中</font>的考评吗?',function(){
    		Public.ajax(web_app.name + '/performassessAction!startPerformAssess.ajax',{ids:$.toJSON(underAssessmentIds)},fn);
    	});
    }else{//发起查询条件下全部人员的考评
    	UICtrl.confirm('您确定发起<font color=red>全部</font>考评吗?',function(){
    		var fullId = $('#mainFullId').val();
    		var periodCode = $('#periodMapQuery').val();
    		Public.ajax(web_app.name + '/performassessAction!startPerformAssess.ajax',{fullId:fullId,periodCode:periodCode},fn);
    	});
    }
    
}

function startOnJobAssess(){
   var fn=function(){Public.successTip("胜任力测评已成功发起!");};
    var selectedRows = gridManager.getSelectedRows();
    if(selectedRows.length>0){//发起选中人员的考评
    	var underAssessmentIds = new Array();
    	$.each(selectedRows,function(i,o){
    		underAssessmentIds.push(o['underAssessmentId']);
    	});
    	UICtrl.confirm('您确定发起<font color=red>选中</font>的考评吗?',function(){
    		Public.ajax(web_app.name + '/performassessAction!startPerformAssess.ajax',{ids:$.toJSON(underAssessmentIds),isOnJobAssess:1},fn);
    	});
    }else{
    	Public.tip("没有需要发起的考评!");
        return;
    }
}
function showForm(evaluationId, name) {
    UICtrl.showAjaxDialog({
        url: web_app.name + '/performassessAction!queryIndexForView.load',
        param: {
            evaluationId: evaluationId
        },
        ok: false,
        init: function(doc) {
            var div = $('#viewTempletIndexDiv').width(840);
            var height = div.height(),
            wh = getDefaultDialogHeight() - 50;
            if (height > wh) {
                div.height(wh);
            }
        },
        title: "考核表[" + name + "]指标",
        width: 850
    });
}
function showPerson(underAssessmentId) {
    UICtrl.showAjaxDialog({
        url: web_app.name + '/performassessAction!queryPersonForView.load',
        param: {
            underAssessmentId: underAssessmentId
        },
        ok: false,
        init: function(doc) {
            var div = $('#viewPersonDiv').width(580);
            var height = div.height(),
            wh = getDefaultDialogHeight() - 50;
            if (height > wh) {
                div.height(wh);
            }
        },
        title: "评分人",
        width: 600
    });
}

function forwardFormNotPass() {
    var fullId = $('#mainFullId').val();
    if (fullId == '' || fullId == '-1') {
        Public.tip("请选择组织节点!");
        return;
    }
    var periodCode = $('#periodMapQuery').val();
    UICtrl.showFrameDialog({
        url: web_app.name + "/performassessAction!forwardFormNotPass.do",
        param: {
            fullId: fullId,
            periodCode: periodCode
        },
        title: "考核表未启用人员",
        width: 880,
        height: 400,
        cancelVal: '关闭',
        ok: false,
        cancel: true
    });
}
function forwardNoFormPerson(){
	 var fullId = $('#mainFullId').val();
	    if (fullId == '' || fullId == '-1') {
	        Public.tip("请选择组织节点!");
	        return;
	    }
	    var periodCode = $('#periodMapQuery').val();
	    UICtrl.showFrameDialog({
	        url: web_app.name + "/performassessAction!forwardNoFormPerson.do",
	        param: {
	            fullId: fullId,
	            periodCode: periodCode
	        },
	        title: "无考核表人员",
	        width: 880,
	        height: 400,
	        cancelVal: '关闭',
	        ok: false,
	        cancel: true
	    });
}
//修改考核评分单位
function modifAssessSubject(){
	var rows =gridManager.getSelectedRows();
	if (!rows || rows.length < 1) {
		Public.tip('请选择数据！');
		return;
	}
	if(!UICtrl.moveTreeDialog){
		UICtrl.moveTreeDialog=UICtrl.showDialog({title:'请选择单位',width:300,
			content:'<div style="overflow-x: hidden; overflow-y: auto; width:280px;height:250px;"><ul id="dialogMoveOrgTree"></ul></div>',
			init:function(){
				$('#dialogMoveOrgTree').commonTree({
					 loadTreesAction: 'orgAction!queryOrgs.ajax',
				     parentId: 'orgRoot',
				     getParam: function(e) {
				    	 if (e) {
				    		return {showVirtualOrg: 1,showDisabledOrg: 0,displayableOrgKinds: "ogn,dpt"};
				         }
				         return {showDisabledOrg: 0};
				     },
				     changeNodeIcon: function(data) {
				         data[this.options.iconFieldName] = OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
				     },
				     IsShowMenu: false
				});
			},
			ok:function(){
				var node=$('#dialogMoveOrgTree').commonTree('getSelected');
				if(!node){
					Public.tip('请选择树节点！');
					return false;
				}
				var rows =gridManager.getSelectedRows();
				if (!rows || rows.length < 1) {
					Public.tip('请选择数据！');
					return;
				}
				var fullId=node.fullId;
				//鉴权通过后才能执行
				Public.authenticationAssessSubject('',fullId,true,function(flag){
					if(flag){
						var underAssessmentIds = new Array();
				    	$.each(rows,function(i,o){
				    		underAssessmentIds.push(o['underAssessmentId']);
				    	});
				    	Public.ajax(web_app.name + '/performassessAction!modifAssessSubject.ajax',{ids:$.toJSON(underAssessmentIds),orgId:node.id,orgName:node.name},function(){
				    		UICtrl.moveTreeDialog.hide();
				    		reloadGrid();
				    	});
					}else{
						Public.errorTip('选择的单位不是考核主体！');
					}
				});
			},
			close: function () {
		        this.hide();
		        return false;
		    }
		});
	}else{
		$('#dialogMoveTree').commonTree('refresh');
		UICtrl.moveTreeDialog.show().zindex();
	}
}