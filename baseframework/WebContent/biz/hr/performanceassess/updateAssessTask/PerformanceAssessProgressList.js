var gridManager = null, refreshFlag = false,archivesState=null,periodCodeData=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
	periodCodeData=$('#periodCode').combox('getJSONData');
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodIndex').combox({data:{}});
	var value =$('#periodCode').combox().val(); 
	setPriodIndex(value);	 
	$('#periodCode').combox({
			onChange:function(obj){
				var value = obj.value;
				setPriodIndex(value);
			}
	});
	initUI();
	initializeGrid();
});

function setPriodIndex(value){
	if("month"==value){
		$('#periodIndex').combox('setData',{
			1:'1月',
			2:'2月',
			3:'3月',
			4:'4月',
			5:'5月',
			6:'6月',
			7:'7月',
			8:'8月',
			9:'9月',
			10:'10月',
			11:'11月',
			12:'12月'
		});
	}else if("quarter"==value){
		$('#periodIndex').combox('setData',{
			1:'1季度',
			2:'2季度',
			3:'3季度',
			4:'4季度'
		});
	}else {
		$('#periodIndex').combox('setData',{});					
	}				
}
function initUI(){
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
//初始化表格
function initializeGrid() {
	var progressId=$('#progressId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		    //personTaskHandler:{id:'personHandler',text:'移除人员',img:'page_delete.gif',click:personDeleteHandler},
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
		    exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		addUpdateIndexTask: {
            id: 'addUpdateIndexTask',
            text: '发送更新绩效考核表任务',
            img: 'page_next.gif',
            click: addUpdateIndexTask
        }
		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },		   
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },	
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },		   
		{ display: "员工姓名", name: "staffName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "人员状态", name: "state", width: 60, minWidth: 60, type: "string", align: "left",
		   render: function (item) { 
				return archivesState[item.state];}},
		{ display: "编制类别", name: "staffingLevelTextView", width: 70, minWidth: 60, type: "string", align: "left" },
		{ display: "入职时间", name: "employedDate", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "考核年", name: "year", width: 60, minWidth: 60, type: "string", align: "center" },	
		{ display: "考核周期", name: "periodCode", width: 70, minWidth: 60, type: "string", align: "center",
		 render: function (item) { 
	 					return periodCodeData[item.periodCode];
	 			        }},	
		{ display: "考核时间", name: "periodIndex", width: 70, minWidth: 60, type: "string", align: "center",
		render:function(item){
			if(item.periodIndex>0){
				return item.periodIndex+periodCodeData[item.periodCode];}
		 }	},	
		{ display: "考核表最后更新时间", name: "updateDate", width: 100, minWidth: 60, type: "date", align: "center" },	
		{ display: "排名单位", name: "orgnName", width: 120, minWidth: 60, type: "string", align: "left"},	
		{ display: "排名单位路径", name: "rankFullName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "考核表填写修改",  width: 160, minWidth: 60, type: "string", align: "center" ,
            render: function(item) {
                var html = ['<a href="javascript:showForm(', item.evaluationId, ',\'', item.templetName, '\');" class="GridStyle">'];
                html.push('修改考评表');
                html.push('</a>', '&nbsp;&nbsp;');
                html.push('<a href="javascript:showPerson(', item.underAssessmentId, ');" class="GridStyle">');
                html.push('修改评分人');
                html.push('</a>');
                return html.join('');
            }},		   
		{ display: "考核表发起跟踪", name: "performScoreProgress", width: 150, minWidth: 60, type: "string", align: "left",
		 render:function(item){
						return '<a href="javascript:showScoreDetail('+item.formId+');" class="GridStyle">'+item.performScoreProgress+'</a>';
		  			}},
	
		{ display: "离职时间", name: "departurDate", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "最近一次调动时间", name: "effectiveDate", width: 80, minWidth: 60, type: "string", align: "left" }
		//{ display: "排名跟踪", name: "joinRankDes", width: 100, minWidth: 60, type: "string", align: "left" }

		],
		dataAction : 'server',
		url: web_app.name+'/updateAssessTaskAction!slicedQueryPerformanceAssessProgress.ajax',
		parms : {
			progressId : progressId
		},
		pageSize : 20,
		checkbox:true,
		width : '99%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		  onLoadData: function() {
            return ! ($('#mainFullId').val() == '');
        },
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
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



function personDeleteHandler(){
	
}

function showScoreDetail(formId){
	parent.addTabItem({ 
		tabid: 'HRAssessResult'+formId,
		text:'员工考评评分情况查看',
		url: web_app.name + '/performAssessScoreDetailAction!forwardList.do?formId='+formId
		}); 
	
}

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


function  startPerformAssess() {
 var fn=function(){
  Public.successTip("成功发起绩效评分任务!");
  reloadGrid();
  };
 var selectedRows = gridManager.getSelectedRows();
    if(selectedRows.length>0){//发起选中人员的考评
    	var underAssessmentIds = new Array();
    	$.each(selectedRows,function(i,o){
    		underAssessmentIds.push(o['underAssessmentId']);
    	});
    	UICtrl.confirm('您确定发起<font color=red>选中</font>的考评吗?',function(){
    		Public.ajax(web_app.name + '/performassessAction!startPerformAssess.ajax',{ids:$.toJSON(underAssessmentIds)},fn);
    	});
    }else{
    	Public.tip("请选择数据!");	
    }
}

function showForm(evaluationId, name) {
    UICtrl.showAjaxDialog({
        url: web_app.name + '/performassessAction!queryIndexForView.load',
        param: {
            evaluationId: evaluationId
        },
         ok: function(){
         updateIndexHandler(evaluationId);
         },
         okVal:'修改指标',
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
        ok: function(){
        updatePersonHandler(underAssessmentId);
        },
        okVal:'修改评分人',
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


function  updateIndexHandler(evaluationId){
	parent.addTabItem({
		tabid: 'PerformAssessTemplet'+evaluationId,
		text: '考核表管理',
		url: web_app.name + '/performassessAction!forwardListPerformAssessTemplet.do?evaluationId=' + evaluationId+'&paType=1'
	  }
	);
}

function updatePersonHandler(underAssessmentId){
	parent.addTabItem({
		tabid: 'RelevancePerformAssess'+underAssessmentId,
		text: '考核人管理',
		url: web_app.name + '/performassessAction!forwardRelevancePerformAssess.do?underAssessmentId=' + underAssessmentId+'&paType=1'
	  }
	);
}


function  addUpdateIndexTask(){
	var year=$('#year').val();
	var periodIndex=$('#periodIndex').val();
	var periodCode=$('#periodCode').val();
	 var archivesIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'archivesId' });
    if (!archivesIds) return;
	 $('#submitForm').ajaxSubmit({url: web_app.name + '/updateAssessTaskAction!sendUpdateTask.ajax',
		   param:{archivesIds:$.toJSON(archivesIds),periodIndex:periodIndex,year:year,periodCode:periodCode},
		   success : function() {
			   reloadGrid();
		   }});
}



//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "updateAssessTaskAction!updatePerformanceAssessProgressSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'updateAssessTaskAction!updatePerformanceAssessProgressStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'updateAssessTaskAction!updatePerformanceAssessProgressStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
