var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeUI() {
	UICtrl.layout("#layout", {
		leftWidth : 200,
		heightDiff : -5
	});
	$('#maintree').commonTree(
			{
				loadTreesAction : 'orgAction!queryOrgs.ajax',
				parentId : 'orgRoot',
				getParam : function(e) {
					if (e) {
						return {
							showDisabledOrg : 0,
							displayableOrgKinds : "ogn,dpt"
						};
					}
					return {
						showDisabledOrg : 0
					};
				},
				changeNodeIcon : function(data) {
					data[this.options.iconFieldName] = OpmUtil.getOrgImgUrl(
							data.orgKindId, data.status);
				},
				IsShowMenu : false,
				onClick : onFolderTreeNodeClick
			});
}

function onFolderTreeNodeClick(data) {

	var html = [], fullId = '', fullName = '';
	if (!data) {
		html.push('绩效考评评分列表');
	} else {
		fullId = data.fullId, fullName = data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[', fullName,
				']</font>绩效考评评分列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager && fullId != '') {
		UICtrl.gridSearch(gridManager, {
			fullId : fullId
		});
	} else {
		gridManager.options.parms['fullId'] = '';
	}

}
// 初始化表格
function initializeGrid() {
	var formId=$('#formId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		urgeHandler:{id:'urge',text:'催办',img:'page_user.gif',click:function(){
			urge();
		}},
		againHandler:{id:'again',text:'重发',img:'page_user.gif',click:function(){
			again();
		}},
		stopHandler:{id:'stop',text:'中止',img:'page_user.gif',click:function(){
			stop();
		}},
		updateProportionHandler:{id:'updateProportion',text:'修改权重',img:'page_edit.gif',click:function(){
			updateProportion();
		}}
		/*,
		viewHandler:function(){
			viewHandler();
		}*/
		
	});
	gridManager = UICtrl
			.grid(
					'#maingrid',
					{
						columns : [
								{
									display : "被考核员工",
									name : "assessName",
									width : 100,
									minWidth : 60,
									type : "string",
									align : "left"
								},
								{
									display : "所在单位",
									name : "orgName",
									width : 120,
									minWidth : 60,
									type : "string",
									align : "left"
								},
								{
									display : "考核表名称",
									name : "formName",
									width : 120,
									minWidth : 60,
									type : "string",
									align : "left"
								},
								{
									display : "考核人",
									name : "scorePersonName",
									width : 100,
									minWidth : 60,
									type : "string",
									align : "left"
								},
								{
									display : "评分时间",
									name : "evaDate",
									width : 100,
									minWidth : 60,
									type : "date",
									align : "left"
								},
								{
									display : "评分状态",
									name : "scoreStatusTextView",
									width : 100,
									minWidth : 60,
									type : "string",
									align : "left"
								},
								{
									display : "考核人级别",
									name : "scorePersonLevelTextView",
									width : 80,
									minWidth : 60,
									type : "string",
									align : "left"
								},
								{
									display : "所占权重",
									name : "proportion",
									width : 80,
									minWidth : 60,
									type : "string",
									align : "left",
									render : function(item) {
										if (Public.isBlank(item.proportion))
											return '';
										return item.proportion + '%';
									}
								},
								 {
									display : "催办截止时间",
									name : "urgeEndTime",
									width : 100,
									minWidth : 60,
									type : "date",
									align : "left"
								}

						],
						dataAction : 'server',
						url : web_app.name
								+ '/paformMakeAction!slicedQueryPerformAssessFormPerson.ajax',
						parms:{formId:formId},
						pageSize : 20,
						width : '100%',
						height : '100%',
						heightDiff : -5,
						headerRowHeight : 25,
						rowHeight : 25,
						sortName : 'evaDate',
						sortOrder : 'desc',
						checkbox:'true',
						toolbar: toolbarOptions,
						fixedCellHeight : true,
						selectRowButtonOnly : true
					});
	UICtrl.setSearchAreaToggle(gridManager);
}


function  updateProportion(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
    var scorePersonDetailId=row.scorePersonDetailId;
    var formId=row.formId;
    var html=['<div class="ui-form">','<form method="post" action="">'];
    html.push("<div class='row'><dl>");
    html.push("<dt style='width:80px'>所占权重(%)<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' id='choose_proportion' required='true' maxlength='20' value='' mask='nnn'/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<dl></div>","</form>");
	UICtrl.showDialog( {
		width:280,
		top:150,
		title : '修改评分人权重',
		content:html.join(''),
		ok : function(){
			
			var proportion=$('#choose_proportion').val();
			
			if(proportion==''){
				Public.tip('请填写所占权重！');
			    return false;
			}
			doUpdateProportion(scorePersonDetailId,proportion,formId);
		}
		
	});

}

function doUpdateProportion(scorePersonDetailId,proportion,formId){
		Public.ajax(web_app.name + '/paformMakeAction!doUpdateProportion.ajax', {
			scorePersonDetailId : scorePersonDetailId,
			proportion : proportion,
			formId : formId
		}, function() {
			reloadGrid();
		});
	

}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

// 刷新表格
function reloadGrid() {
	gridManager.loadData();
}

// 重置表单
function resetForm(obj) {
	$(obj).formClean();
}

// 催办
function urge() {
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var scoreStatus=row.scoreStatus;
	var scorePersonDetailId=row.scorePersonDetailId;
	var formId=row.formId;
	var scorePersonId=row.scorePersonId;
	if (scoreStatus == 1 || scoreStatus == 3) {
		UICtrl
				.showAjaxDialog({
					title : "请输入评分的截止时间",
					width : 400,
					url : web_app.name
							+ '/paformMakeAction!showUrgeEndTime.load',
					param : {
						scorePersonDetailId : scorePersonDetailId,
						scorePersonId : scorePersonId,
						formId : formId
					},
					ok : function() {
						var _self = this;
						$('#submitForm')
								.ajaxSubmit(
										{
											url : web_app.name
													+ '/paformMakeAction!updatePerformAssessFormPerson.ajax',
											success : function() {
												_self.close();
												reloadGrid();
											}
										});
					}
				});

	} else {
		Public.tip('不能进行催办操作！');
	}

}

function again(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var scoreStatus=row.scoreStatus;
	var scorePersonDetailId=row.scorePersonDetailId;
	var formId=row.formId;
	var scorePersonId=row.scorePersonId;
	if ( scoreStatus==0 ||scoreStatus==2) {
		Public.ajax(web_app.name + '/paformMakeAction!again.ajax', {
			scorePersonDetailId : scorePersonDetailId,
			scorePersonId : scorePersonId,
			formId : formId
		}, function() {
			reloadGrid();
		});

	} else {
		Public.tip('不能进行重发操作,若需要重发,请先点击中止按钮！');
	}
	
}
function stop() {
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var scoreStatus=row.scoreStatus;
	var scorePersonDetailId=row.scorePersonDetailId;
	var formId=row.formId;
	var scorePersonId=row.scorePersonId;
	if (scoreStatus == 1 || scoreStatus == 3) {
		Public.ajax(web_app.name + '/paformMakeAction!stop.ajax', {
			scorePersonDetailId : scorePersonDetailId,
			scorePersonId : scorePersonId,
			formId : formId
		}, function() {
			reloadGrid();
		});

	} else {
		Public.tip('不能进行中止操作！');
	}
}
// 编辑按钮
function viewHandler(scorePersonDetailId) {
	if (!scorePersonDetailId) {
		var row = gridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择数据！');
			return;
		}
		scorePersonDetailId = row.scorePersonDetailId;
	}
	parent
			.addTabItem({
				tabid : 'HRPerformAssess' + scorePersonDetailId,
				text : '绩效考评评分查看',
				url : web_app.name
						+ '/paformMakeAction!showUpdatePerformAssessFormPerson.do?scorePersonDetailId='
						+ scorePersonDetailId + '&isReadOnly=true'
			});

}
