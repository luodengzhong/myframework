var treeManager = null, treeBudgdetManager = null, gridManager = null, maingridBudgetSubject = null, refreshFlag = false;
var detailGridManger = null, budgetSubjectDetailGridManager = null;
var gloabGridManager = null;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initTree();
});

function initializeUI() {
	$("#budgetSubject").hide();
	$("#salaryItem").hide();
	$('#budgetsubjectName').treebox({
		name : 'bmOrganizeRootChoose',
		treeLeafOnly : true,
		checkbox : false,
		hasSearch : false,
		getParam : function(data) {
			return {
				root : $('#orgRoot').val()
			};
		},
		back : {
			text : '#budgetsubjectName',
			value : '#budgetsubjectId'
		}
	});
	$('#subjectName').treebox({
		name : 'bmSubjectRootChoose',
		treeLeafOnly : true,
		checkbox : false,
		hasSearch : false,
		getParam : function(data) {
			return {
				root : $('#subRoot').val()
			};
		},
		back : {
			text : '#subjectName',
			value : '#subjectId'
		}
	});

	// param:{searchQueryCondition:"org_kind_id in('ogn','dpt','psm')"}
	$("#orgName").orgTree({
		// param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		filter : 'dpt,psm',
		back : {
			text : "#orgName",
			value : "#orgId",
			id : "#orgId",
			name : "#orgName"
		}
	});
	$("#salaryItems").comboDialog({
		type : 'hr',
		name : 'chooseSalaryItem',
		width : 290,
		dataIndex : 'id',
		checkbox : false,
		manageType : '',
		onShow : function() {
			$("#salaryItems").val('');
			$("#salaryItemsId").val('');
			return true;
		},
		getParam : function() {
		},
		onChoose : function() {
			var row = this.getSelectedRow();
			$("#salaryItems").val(row['display']);
			$("#salaryItemsId").val(row['id']);
			return true;
		}
	});
	UICtrl.layout("#layout", {
		leftWidth : 200,
		heightDiff : -5,
		onSizeChanged : function() {
			/*
			 * layoutProc._onResize(); elementGridManager.reRender();
			 * handlerGridManager.reRender();
			 */
		}
	});
	layoutProc = UICtrl.layout("#layoutCenter", {
		leftWidth : 200,
		heightDiff : -10
	});
	layoutProc.setLeftCollapse(true);
}
function initTree() {
	treeManager = UICtrl.tree("#maintree", {
		url : web_app.name
				+ '/salarySetbookAction!queryBudgetEntityTreeByKind.ajax',
		param : {
			parentId : '0',
			feeKind : 'fee'
		},
		idFieldName : 'id',
		textFieldName : "name",
		checkbox : false,
		nodeWidth : 155,
		needCancel : false,
		isLeaf : function(data) {
			if (!data)
				return false;
			return data.hasChild == false;
		},
		delay : function(n) {
			var url = this.options.url;
			return {
				url : url,
				parms : {
					parentId : n.data.id,
					parentName : n.data.name,
					orgRoot : n.data.orgRoot,
					subRoot : n.data.subRoot
				}
			};
		},
		onClick : function(node) {
			var html = [];
			layoutProc.setLeftCollapse(true);
			$("#budgetTree").hide();
			var id = node.data.entityDefineId;
			gloabGridManager = null;
			$("#budgetSubject").hide();
			$("#salaryItem").hide();
			$('#setbookId').val("");
			$('#setbookName').val("");
			if (node.data.entityDefineId) {
				resetForm("#querySalaryMainForm");
				resetForm("#queryBudgetMainForm");
				$('#setbookId').val(id);
				$('#setbookName').val(node.data.parentName);
				if (node.data.id == "maintainSubject") {
					layoutProc.setLeftCollapse(true);
					$("#budgetSubject").hide();
					$("#budgetTree").hide();
					$("#salaryItem").show();
					$('#subRoot').val(node.data.subRoot);

					if (!gridManager) {
						initSalaryGrid();
						gloabGridManager = gridManager;
					} else {
						gloabGridManager = gridManager;
						reloadGrid();
					}
				}
				if (node.data.id == "maintainBudget") {
					$("#salaryItem").hide();
					$("#budgetSubject").show();
					$("#budgetTree").show();
					layoutProc.setLeftCollapse(false);
					$('#orgRoot').val(node.data.orgRoot);
					$("#salaryItem").hide();
					initBudgetTree();

					if (!maingridBudgetSubject) {
						initializeBudgetGrid();
						gloabGridManager = maingridBudgetSubject;
					} else {
						gloabGridManager = maingridBudgetSubject;
						reloadGrid();
					}

				}
			}
		}
	});
}
function initBudgetTree() {
	if (treeBudgdetManager)
		treeBudgdetManager.clear();
	
	UICtrl.tree("#budgetTree",{
		url: web_app.name + '/budgetOrganizeAction!queryOrganizeTree.ajax',
		param:{
			parentId : $('#orgRoot').val()
		},
		idFieldName : 'id',
		textFieldName : "name",
		checkbox : false,
        nodeWidth : 155,
        needCancel: false,
        isLeaf : function(data)
        {
            if (!data) return false;
            return data.hasChild == false;
        },
        delay: function(n){
        	var url = this.options.url;
            return {url:url,parms:{parentId: n.data.id}};
        },
        onClick: function (node) {
        	alert(data.data.id);
        	alert(data.data.name);
        	
        	//UICtrl.gridSearch(ex.grid,{parentId: node.data.id});
        }
    });
	/*

	treeBudgdetManager = UICtrl
			.tree(
					"#budgetTree",
					{
						url : web_app.name
								+ '/budgetsubjectOrgAction!queryBudgetEntityTreeByParentId.ajax',
						param : {
							parentId : '0',
							setbookId : $("#setbookId").val()
						},
						idFieldName : 'id',
						textFieldName : "name",
						checkbox : false,
						nodeWidth : 100,
						needCancel : false,
						isLeaf : function(data) {
							if (!data)
								return false;
							return data.hasChild == false;
						},
						delay : function(n) {
							var url = this.options.url;
							return {
								url : url,
								parms : {
									parentId : n.data.id,
									setbookId : $("#setbookId").val()
								}
							};
						},
						onClick : function(node) {
							// $("#budgetTreeParentId").val(node.data.parentId);
							gloabGridManager.options.parms = {};
							if (node.data.hasChild == 1)
								UICtrl.gridSearch(gloabGridManager, {
									setbookId : $("#setbookId").val(),
									budgetsubjectOrgId : node.data.parentId,
									parentId : node.data.parentId,
									budgetsubjectOrgDetailId : ''
								});
							if (node.data.hasChild == 0)
								UICtrl.gridSearch(gloabGridManager, {
									setbookId : $("#setbookId").val(),
									budgetsubjectOrgId : node.data.parentId,
									parentId : node.data.parentId,
									budgetsubjectOrgDetailId : node.data.id
								});
						}
					});*/
}

function addHandler() {
	var _self = this;
	$('#submitFormSalary').ajaxSubmit({
		url : web_app.name + '/salarySubjectAction!insert.ajax',
		param : {
			setbookId : $("#setbookId").val(),
			setbookName : $("#setbookName").val()
		},
		success : function(data) {
			reloadGrid();
		}
	});
}
function updateHandler(data) {
	if (!data) {
		var data = gridManager.getSelectedRow();
		if (!data) {
			Public.tip('请选择数据！');
			return;
		}
	}
	if (data.status == -1) {
		{
			Public.tip('状态是禁用,请先启用!');
			return;
		}
	}
	var url = web_app.name
			+ '/salarySubjectDetailAction!forwardList.do?setbookId='
			+ data.setbookId + '&setbookName=' + encodeURI(encodeURI(data.setbookName))
			+ '&parentId=' + data.salarySubjectId + '&subject=' + encodeURI(encodeURI(data.subjects));
	parent.addTabItem({
		tabid : 'salarySubjecDetail' + data.salarySubjectId,
		text : '工资栏目与科目维护:' + data.subjects,
		url : url
	});
}

function deleteBudgetHandler() {
	var row = detailGridManger.getSelectedRow();
}
function deleteHandler() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！');
		return;
	}
	UICtrl.confirm('确定删除吗?', function() {
		// 所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/salarySubjectAction!delete.ajax', {
			salarySubjectId : row.salarySubjectId
		}, function() {
			reloadGrid();
		});
	});
}

function updateBudgetHandler(data) {
	if (!data) {
		var data = gloabGridManager.getSelectedRow();
		if (!data) {
			Public.tip('请选择数据！');
			return;
		}
	}
	var parentId = data.parentId;
	if (!parentId) {
		Public.tip('请先选择预算主体');
		return;
	}
	window['showEditBudgetDetail'] = UICtrl.showDialog({
		title : '维护对应组织',
		width : 600,
		content : "<div id='budgetSubjectDetailGrid'></div>",
		init : function(doc) {
			initializeOrgGrid(parentId);
		},
		ok : function() {
			var _self = this;
			_self.close();
			reloadGrid();
		},
		close : function() {
			initBudgetTree();
		}
	});
}
// 预算主体对应的组织明细
function initializeOrgGrid(budgetSubjectId) {

	var toolbarOptions = UICtrl
			.getDefaultToolbarOptions({
				addHandler : function() {
					var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
					selectOrgParams = $.extend({}, selectOrgParams, {
						selectableOrgKinds : 'dpt,psm',cascade : false
					});
					var options = {
						params : selectOrgParams,
						title : "请选择组织",
						cascade : false,
						cancel : false,
						parent : window['showEditBudgetDetail'],
						closeHandler : function() {
						},
						confirmHandler : function() {
							var data = this.iframe.contentWindow.selectedData;
							if (data.length == 0) {
								Public.errorTip("请选择数据。");
								return;
							}
							var rows = [];
							$.each(data, function(i, o) {
								eachRow = {};
								eachRow['orgId'] = o['id'];
								eachRow['fullId'] = o['fullId'];
								eachRow['orgName'] = o['name'];
								eachRow['orgKindId'] = o['orgKindId'];
								eachRow['parentId'] = budgetSubjectId;
								// eachRow['status']=1;
								rows.push(eachRow);
							});
							var url = web_app.name
									+ '/budgetsubjectOrgDetailAction!insert.ajax';
							var _self = this;
							Public.ajax(url, {
								setbookId : $("#setbookId").val(),
								detailData : encodeURI($.toJSON(rows))
							}, function(data) {
								if (data) {
									UICtrl.alert(data);
								}
								_self.close();
								budgetSubjectDetailGridManager.loadData();
								initBudgetTree();
							});
						}
					};
					OpmUtil.showSelectOrgDialog(options);
				},
				deleteHandler : function() {
					var rowDetail = budgetSubjectDetailGridManager
							.getSelectedRow();
					if (!rowDetail) {
						Public.tip('请选择数据！');
						return;
					}
					UICtrl
							.confirm(
									'确定删除吗?',
									function() {
										// 所需参数需要自己提取 {id:row.id}
										Public
												.ajax(
														web_app.name
																+ '/budgetsubjectOrgDetailAction!delete.ajax',
														{
															budgetsubjectOrgDetailId : rowDetail.budgetsubjectOrgDetailId
														},
														function() {
															budgetSubjectDetailGridManager
																	.loadData();
															maingridBudgetSubject
																	.loadData();
															initBudgetTree();
														});
									});
				},
				enableHandler : function(data) {
					var rowDetail = budgetSubjectDetailGridManager
							.getSelectedRow();
					if (!rowDetail) {
						Public.tip('请选择数据！');
						return;
					}
					DataUtil
							.updateById({
								action : 'budgetsubjectOrgDetailAction!updateStatus.ajax',
								gridManager : budgetSubjectDetailGridManager,
								idFieldName : 'budgetsubjectOrgDetailId',
								param : {
									status : 1,
									setbookId : $("#setbookId").val(),
									orgName : rowDetail.orgName,
									orgId : rowDetail.orgId
								},
								message : '确实要启用选中数据吗?',
								onSuccess : function() {
									budgetSubjectDetailGridManager.loadData();
									maingridBudgetSubject.loadData();
								}
							});

				},
				disableHandler : function() {
					DataUtil
							.updateById({
								action : 'budgetsubjectOrgDetailAction!updateStatus.ajax',
								gridManager : budgetSubjectDetailGridManager,
								idFieldName : 'budgetsubjectOrgDetailId',
								param : {
									status : -1
								},
								message : '确实要禁用选中数据吗?',
								onSuccess : function() {
									budgetSubjectDetailGridManager.loadData();
									maingridBudgetSubject.loadData();
								}
							});

				}
			});
	var columns = [ {
		display : "组织",
		name : "orgName",
		width : 110,
		minWidth : 60,
		type : "string",
		align : "left"
	} ];
	columns.push({
		display : "状态",
		name : "status",
		width : 80,
		minWidth : 60,
		type : "string",
		align : "left",
		render : function(item) {
			return UICtrl.getStatusInfo(item.status);
		}
	});
	columns.push({
		display : "组织全路径",
		name : "fullName",
		width : 300,
		minWidth : 100,
		type : "string",
		align : "left"
	});

	var param = {
		parentId : budgetSubjectId
	};
	budgetSubjectDetailGridManager = UICtrl.grid('#budgetSubjectDetailGrid', {
		columns : columns,
		dataAction : 'server',
		url : web_app.name + '/budgetsubjectOrgDetailAction!slicedQuery.ajax',
		parms : param,
		width : '600',
		height : '300',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		/*
		 * sortName:'budgetsubjectName', sortOrder:'asc',
		 */
		toolbar : toolbarOptions,
		autoAddRowByKeydown : false,
		// checkbox: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}
// 启用
function enableHandler() {
	DataUtil.updateById({
		action : 'salarySubjectAction!updateSalarySubjectStatus.ajax',
		gridManager : gridManager,
		idFieldName : 'salarySubjectId',
		param : {
			status : 1
		},
		message : '确实要启用选中数据吗?',
		onSuccess : function() {
			reloadGrid();
		}
	});
}
// 禁用
function disableHandler() {
	DataUtil.updateById({
		action : 'salarySubjectAction!updateSalarySubjectStatus.ajax',
		gridManager : gridManager,
		idFieldName : 'salarySubjectId',
		param : {
			status : -1
		},
		message : '确实要禁用选中数据吗?',
		onSuccess : function() {
			reloadGrid();
		}
	});
}

function initializeBudgetGrid() {
	var toolbarOptions = UICtrl
			.getDefaultToolbarOptions({
				addHandler : function() {
					UICtrl
							.showAjaxDialog({
								title : "添加主体",
								url : web_app.name
										+ '/budgetsubjectOrgAction!showInsert.load',
								width : 500,
								init : function() {
									$("#budgetsubjectPersonName").orgTree({
										// param:{searchQueryCondition:"org_kind_id
										// in('ogn','dpt')"},
										filter : 'psm',
										back : {
											text : "#budgetsubjectPersonName",
											value : "#budgetsubjectPersonId",
											id : "#budgetsubjectPersonId",
											name : "#budgetsubjectPersonName"
										}
									});
									/*$('#budgetsubjectName').treebox({
										name : 'bmOrganizeRootChoose',
										treeLeafOnly : true,
										checkbox : false,
										hasSearch : false,
										getParam : function(data) {
											return {
												root : $('#orgRoot').val()
											};
										},
										back : {
											text : '#budgetsubjectName',
											value : '#budgetsubjectId'
										}
									});*/
									
									$('#budgetsubjectName').searchbox({
										type:'fee',name:'queryBudgetOrganAll',
										isOriginalValue:false,showToolbar:false,
										getParam:function(){
											var entityDefineId=$('#setbookId').val();
											if(!entityDefineId){
												Public.errorTip("请选择帐套");
												return;
											}
											return {entityDefineId:entityDefineId};
										},
										onChange:function(o){
											/*var csmRelationKind=o['csmRelationKind'];
											$('#csmRelationKind').combox('setValue',csmRelationKind);*/
										},
										back:{
											id:'#budgetsubjectId',
											name:'#budgetsubjectName'
										}
									});
									
									
									
								},
								ok : function() {
									var subject = $("#budgetsubjectName").val();
									if (!subject) {
										Public.errorTip("请选择预算主体");
										return;
									}
									var personName=$("#budgetsubjectPersonName").val();
									if (!personName)
										if (!subject) {
											Public.errorTip("请选负责人");
											return;
										}
									var _self = this;
									$('#submitForm')
											.ajaxSubmit(
													{
														url : web_app.name
																+ '/budgetsubjectOrgAction!insert.ajax',
														param : {
															setbookId : $(
																	"#setbookId")
																	.val(),
															setbookName : $(
																	"#setbookName")
																	.val()
														},
														success : function(data) {
															if(data.budgetsubjectPersonName)
																personName=data.budgetsubjectPersonName;
															/*
															 * if
															 * (data=="added") {
															 * UICtrl.confirm('此预算主体已经添加了，将转到对应组织维护页面，确定吗？',function(){
															 * //所需参数需要自己提取
															 * {id:row.id}
															 * Public.ajax(web_app.name +
															 * '/budgetsubjectOrgAction!delete.ajax',
															 * {budgetsubjectOrgId:rowSubject.budgetsubjectOrgId},
															 * function(){
															 * maingridBudgetSubject.loadData();
															 * }); }); }
															 * 
															 */
															gloabGridManager.options.parms = {};
															UICtrl
																	.gridSearch(
																			gloabGridManager,
																			{
																				setbookId : $(
																						"#setbookId")
																						.val(),
																				budgetsubjectQuery : '',
																				subjectId : ''
																			});
															_self.close();
															var url = web_app.name
																	+ '/budgetsubjectOrgDetailAction!forwardList.do?setbookId='
																	+ $("#setbookId").val()
																	+ '&setbookName='
																	+ encodeURI($(
																			"#setbookName")
																			.val())
																	+ '&parentId='
																	+ data.budgetsubjectOrgId
																	+ '&budgetSubject='
																	+ encodeURI(subject)
																	+ "&budgetsubjectPersonName="+encodeURI(personName);
																	
															parent
																	.addTabItem({
																		tabid : 'budgetsubjectOrgDetail'
																				+ data.budgetsubjectOrgId,
																		text : '预算主体与组织维护:'
																				+ subject,
																		url : url
													});
														},
														fail : function(data) {

															_self.close();
														}
													});
								},
								close : function() {
									reloadGrid();
								}
							});
					/*
					 * var subject=$("#budgetsubjectName").val(); if(!subject){
					 * Public.errorTip("请选择预算主体"); return; }
					 * $('#submitFormBudget').ajaxSubmit({url: web_app.name +
					 * '/budgetsubjectOrgAction!insert.ajax',
					 * param:{setbookId:$("#setbookId").val(),setbookName:$("#setbookName").val()},
					 * success : function(data) {
					 * maingridBudgetSubject.loadData(); } });
					 */
				},
				updateHandler : function() {
					var data = maingridBudgetSubject.getSelectedRow();
					if (!data) {
						Public.tip('请选择数据！');
						return;
					}
					var url = web_app.name
							+ '/budgetsubjectOrgDetailAction!forwardList.do?setbookId='
							+$("#setbookId").val() + '&setbookName='
							+ encodeURI($("#setbookName").val()) + '&parentId='
							+ data.budgetsubjectOrgId + '&budgetSubject='
							+ data.budgetsubjectName+"&budgetsubjectPersonName="+encodeURI(data.budgetsubjectPersonName);
					parent.addTabItem({
						tabid : 'budgetsubjectOrgDetail' + data.budgetsubjectOrgId,
						text : '预算主体与组织维护:' + data.budgetsubjectName,
						url : url
					});
					//updateBudgetHandler();
				},
				deleteHandler : function() {
					var rowSubject = maingridBudgetSubject.getSelectedRow();
					if (!rowSubject) {Public.tip('请选择数据！'); return; }
					/*if (rowSubject.parentId==0){*/
					UICtrl.confirm('确定删除吗?',function(){
							//所需参数需要自己提取 {id:row.id}
							Public.ajax(web_app.name + '/budgetsubjectOrgAction!delete.ajax', {budgetsubjectOrgId:rowSubject.budgetsubjectOrgId}, function(){
								maingridBudgetSubject.loadData();
							});
					});
				},enableHandler: function(){
					var rowSubject = maingridBudgetSubject.getSelectedRow();
					if (!rowSubject) {Public.tip('请选择数据！'); return; }
				/*	if(rowSubject.parentId==0){*/
						DataUtil.updateById({ action: 'budgetsubjectOrgAction!updateStatus.ajax',
							gridManager: maingridBudgetSubject,idFieldName:'budgetsubjectOrgId', param:{status:1,setbookId:rowSubject.setbookId,budgetsubjectId:rowSubject.budgetsubjectId},
							message:'确实要启用选中数据吗?',
							onSuccess:function(){
								maingridBudgetSubject.loadData();
							}
						});	
						/*}else {
						DataUtil.updateById({ action: 'budgetsubjectOrgDetailAction!updateStatus.ajax',
							gridManager: maingridBudgetSubject,idFieldName:'detailId', param:{status:1,setbookId:$("#setbookId").val(),orgName:rowSubject.name,orgId:rowSubject.orgId},
							message:'确实要启用选中数据吗?',
							onSuccess:function(){
								maingridBudgetSubject.loadData();
							}
						});
						
						
						
					}*/
					
				},
				disableHandler: function(){
					var rowSubject = maingridBudgetSubject.getSelectedRow();
					if (!rowSubject) {Public.tip('请选择数据！'); return; }
				/*	if(rowSubject.parentId==0){*/
						DataUtil.updateById({ action: 'budgetsubjectOrgAction!updateStatus.ajax',
							gridManager: maingridBudgetSubject,idFieldName:'budgetsubjectOrgId', param:{status:-1},
							message:'确实要禁用选中数据吗?',
							onSuccess:function(){
								maingridBudgetSubject.loadData();
							}
						});	
					/*}else {
						DataUtil.updateById({ action: 'budgetsubjectOrgDetailAction!updateStatus.ajax',
							gridManager: maingridBudgetSubject,idFieldName:'detailId', param:{status:-1},
							message:'确实要禁用选中数据吗?',
							onSuccess:function(){
								maingridBudgetSubject.loadData();	
							}
						});
					}
					*/
					
				},
				modifyBudgetPersonInfo : {
					id : 'modifyBudgetPersonInfo',
					text : '修改责任人',
					img : 'page_edit.gif',
					click : function() {
						var row = gloabGridManager.getSelectedRow();
						if (!row) {
							Public.tip('请选择数据！');
							return;
						}
						UICtrl
								.showAjaxDialog({
									url : web_app.name
											+ '/budgetsubjectOrgAction!showUpdate.load',
									param : {
										budgetsubjectOrgId : row.budgetsubjectOrgId
									},
									title : "修改责任人",
									width : "100",
									init : function() {
										$("#budgetsubjectPersonName")
												.orgTree(
														{
															// param:{searchQueryCondition:"org_kind_id
															// in('ogn','dpt')"},
															filter : 'psm',
															back : {
																text : "#budgetsubjectPersonName",
																value : "#budgetsubjectPersonId",
																id : "#budgetsubjectPersonId",
																name : "#budgetsubjectPersonName"
															}
														});
										$('#budgetsubjectName').treebox({
											name : 'bmOrganizeRootChoose',
											treeLeafOnly : true,
											checkbox : false,
											hasSearch : false,
											getParam : function(data) {
												return {
													root : $('#orgRoot').val()
												};
											},
											back : {
												text : '#budgetsubjectName',
												value : '#budgetsubjectId'
											}
										});

									},
									ok : function() {
										var _self = this;
										$('#submitForm')
												.ajaxSubmit(
														{
															url : web_app.name
																	+ '/budgetsubjectOrgAction!update.ajax',
															success : function() {
																maingridBudgetSubject
																		.loadData();
																_self.close();
															}
														});

									},
									close : function() {

									}
								});
					}
				},
				reSetup : {
					id : 'reSetup',
					text : '立项',
					img : 'page_edit.gif',
					click : function() {
						var row = gloabGridManager.getSelectedRow();
						if (!row) {
							Public.tip('请选择数据！');
							return;
						}
						UICtrl
								.showAjaxDialog({
									url : web_app.name
											+ '/budgetsubjectOrgAction!showReBulidSetup.load',
									param : {
										budgetsubjectOrgId : row.budgetsubjectOrgId
									},
									title : "立项",
									okVal:'确认',
									width : "200",
									init : function() {
										$('#budgetOrganId').val(row.budgetsubjectId);
										$('#personMemberId').val(row.budgetsubjectPersonId);
										$('#accountId').val(row.setbookId);
										
										$('#fillinDate').searchbox({
											type:'hr',name:'chooseFeePeriod',
/*											isOriginalValue:false,showToolbar:false,
*/											getParam:function(){
												var setbookId=row.setbookId;
												if(!setbookId){
													Public.errorTip("请先选择帐套");
													return;
												}
												return {setbookId:setbookId};
											},
											onChange:function(o){
												/*var csmRelationKind=o['csmRelationKind'];
												$('#csmRelationKind').combox('setValue',csmRelationKind);*/
											},
											back:{
												fillinDate:'#fillinDate'
											}
										});
									},
									ok : function() {
										var _self = this;
										$('#submitForm')
												.ajaxSubmit(
														{
															url : web_app.name
																	+ '/feeHrInterflowAction!doSaveFeeHrSetup.ajax',
															success : function() {
																maingridBudgetSubject
																		.loadData();
																_self.close();
															}
														});

									},
									close : function() {

									}
									
								});
					}
				}
			// saveSortIDHandler: saveSortIDHandler
			});
			var param={setbookId:$("#setbookId").val()};
			maingridBudgetSubject = UICtrl.grid('#maingridBudget', {
				columns: [
				{ display: "名称", name: "budgetsubjectName", id:"subjectName",width: 150, minWidth: 60, type: "string", align: "left" },		   
				{ display: "全路径", name: "fullName", width: 400, minWidth: 100, type: "string", align: "left" },		   
				/*{ display: "创建时间", name: "createDatetime", width: 100, minWidth: 60, type: "string", align: "left" },*/
				{ display: "责任人", name: "budgetsubjectPersonName", width: 150, minWidth: 60, type: "string", align: "left" },
				{ display: "状态", name: "status", width: 10, minWidth: 60, type: "string", align: "left" ,
					render: function (item) { 
					return UICtrl.getStatusInfo(item.status);
					}
				}],
				width:'100%',
				dataAction : 'server',
				url: web_app.name+'/budgetsubjectOrgAction!slicedQuery.ajax',
				parms:param,
				pageSize : 10,
				width : '100%',
				height : '100%',
				heightDiff : -5,
				headerRowHeight : 25,
				rowHeight : 25,
				/*sortName:'sequence',
				sortOrder:'asc',*/
				/*tree: {
		            columnId: 'subjectName',
		            idField: 'detailId',
		            parentIDField: 'parentId'
		        },*/
		       
				/*detail: { onShowDetail: f_showDetailOrg,height:'auto' },*/
				toolbar: toolbarOptions,
				fixedCellHeight : true,
				selectRowButtonOnly : true,
				onDblClickRow : function(data, rowindex, rowobj) {
					if (!data) {
						Public.tip('请选择数据！');
						return;
					}
					var url = web_app.name
							+ '/budgetsubjectOrgDetailAction!forwardList.do?setbookId='
							+$("#setbookId").val() + '&setbookName='
							+ encodeURI(encodeURI($("#setbookName").val())) + '&parentId='
							+ data.budgetsubjectOrgId + '&budgetSubject='
							+ data.budgetsubjectName+"&budgetsubjectPersonName="+encodeURI(encodeURI(data.budgetsubjectPersonName));
					parent.addTabItem({
						tabid : 'budgetsubjectOrgDetail' + data.budgetsubjectOrgId,
						text : '预算主体与组织维护:' + data.budgetsubjectName,
						url : url
					});
				}
			});
			UICtrl.setSearchAreaToggle(maingridBudgetSubject,$("#budgetSubject"));
	// maingridBudgetSubject.collapseAll();
}
function updatePersonInfoById(inputPersonName, parentId, itemId) {
	// alert( "#"+inputPersonName.id+" "+ "#txtBudgetsubjectPersonId_"+itemId);
	var oldValue = inputPersonName.value;
	$("#" + inputPersonName.id).orgTree({
		// param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		width : 200,
		filter : 'psm',
		back : {
			text : "#" + inputPersonName.id,
			value : "#txtBudgetsubjectPersonId_" + itemId,
			id : "#txtBudgetsubjectPersonId_" + itemId,
			name : "#" + inputPersonName.id
		}
	});
	if ($("#txtBudgetsubjectPersonId_" + itemId).val()) {
		UICtrl.confirm('确定更新更新责任人?', function() {
			// 所需参数需要自己提取 {id:row.id}
			Public.ajax(web_app.name + '/budgetsubjectOrgAction!update.ajax',
					{
						budgetsubjectOrgId : parentId,
						budgetsubjectPersonName : $("#" + inputPersonName.id)
								.val(),
						budgetsubjectPersonId : $(
								"#txtBudgetsubjectPersonId_" + itemId).val()
					}, function() {
						maingridBudgetSubject.loadData();
					});
		}, function() {
			maingridBudgetSubject.loadData();
		});
	}
	if (!$("#" + inputPersonName.id).val()) {
		Public.errorTip("请选择责任人,不能为空");
	}
}
// 显示详细信息
function f_showDetailOrg(row, detailPanel, callback) {
	// var grid = document.createElement('div');
	var grid = $("<div/>", {
		id : row.budgetsubjectOrgId,
		height : 100
	});
	$(detailPanel).append(grid);
	detailGridManger = UICtrl
			.grid(
					grid,
					{
						columns : [ {
							display : "组织",
							name : "name",
							width : 10,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "全路径",
							name : "fullName",
							width : 400,
							minWidth : 100,
							type : "string",
							align : "left"
						}, {
							display : "状态",
							name : "status",
							width : 10,
							minWidth : 60,
							type : "string",
							align : "left",
							render : function(item) {
								return UICtrl.getStatusInfo(item.status);
							}
						} ],
						dataAction : 'server',
						url : web_app.name
								+ '/budgetsubjectOrgDetailAction!slicedDetailQuery.ajax?parentId='
								+ row.budgetsubjectOrgId,
						/* pageSize : 10, */
						usePager : false,
						width : '100%',
					/*
					 * width : '100%', height : '50%'/* onDblClickRow :
					 * function(data, rowindex, rowobj) {
					 * alert(JSON.stringify(data)); return false; },
					 */
					/*
					 * onAfterShowData: function(){ alert("onAfterShowData"); }
					 */
					/*
					 * sortName:'sequence', sortOrder:'asc',
					 */
					});
}
function initSalaryGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler : function() {

			UICtrl.showAjaxDialog({
				title : "添加科目",
				url : web_app.name + '/salarySubjectAction!showInsert.load',
				width : 500,
				init : function() {
					$('#subjects').treebox({
						name : 'bmSubjectRootChoose',
						treeLeafOnly : true,
						checkbox : false,
						hasSearch : false,
						getParam : function(data) {
							return {
								root : $('#subRoot').val()
							};
						},
						back : {
							text : '#subjects',
							value : '#subjectId'
						}
					});
				},
				ok : function() {
					var subject = $("#subjects").val();
					if (!subject) {
						Public.errorTip("请选择预算科目");
						return;
					}
					var _self = this;
					$('#submitForm').ajaxSubmit(
							{
								url : web_app.name
										+ '/salarySubjectAction!insert.ajax',
								param : {
									setbookId : $("#setbookId").val(),
									setbookName : $("#setbookName").val()
								},
								success : function(data) {
									var salarySubject = {};
									salarySubject.setbookId = $("#setbookId")
											.val();
									salarySubject.setbookName = $(
											"#setbookName").val();
									salarySubject.salarySubjectId = data;
									salarySubject.subjects = $("#subjects")
											.val();
									gloabGridManager.options.parms = {};
									UICtrl.gridSearch(gloabGridManager, {
										setbookId : $("#setbookId").val(),
										budgetsubjectQuery : '',
										subjectId : '',
										orgidQuery : '',
										salaryItemsId : ''
									});
									_self.close();
									updateHandler(salarySubject);
								},
								fail : function(data) {
									_self.close();
								}
							});
				},
				close : function() {
					gloabGridManager.options.parms = {};
					UICtrl.gridSearch(gloabGridManager, {
						setbookId : $("#setbookId").val(),
						budgetsubjectQuery : '',
						subjectId : '',
						orgidQuery : '',
						salaryItemsId : ''
					});
				}
			});

		},// addHandler,
		updateHandler : function() {
			updateHandler();
		},
		deleteHandler : deleteHandler,
		enableHandler : enableHandler,
		disableHandler : disableHandler
	// saveSortIDHandler: saveSortIDHandler
	});
	var param = {
		setbookId : $("#setbookId").val()
	};
	gridManager = UICtrl.grid("#maingridSalary", {
		columns : [ {
			display : "科目",
			name : "subjects",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "创建者",
			name : "creator",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "创建时间",
			name : "createDatetime",
			width : 150,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "状态",
			name : "status",
			width : 100,
			minWidth : 60,
			type : "string",
			align : "left",
			render : function(item) {
				return UICtrl.getStatusInfo(item.status);
			}
		} ],
		dataAction : 'server',
		url : web_app.name + '/salarySubjectAction!slicedQuery.ajax',
		parms : param,
		pageSize : 10,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'subjects',
		sortOrder : 'asc',
		toolbar : toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager, $("#salaryItem"));
}

function getEntityDefineId() {
	return $('#setbookid').val();
}

function dialogClose() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

function reloadGrid() {
	if (gloabGridManager) {
		gloabGridManager.options.parms = {};
		UICtrl.gridSearch(gloabGridManager, {
			setbookId : $("#setbookId").val(),
			budgetsubjectQuery : '',
			subjectId : '',
			orgidQuery : '',
			salaryItemsId : '',
			budgetsubjectId : '',
			budgetsubjectName : '',
			budgetsubjectOrgId : ''
		});
	}
}

function query(obj) {
	var param = $(obj).formToJSON();
	/*	param.subjectId = getSubId();
	 param.organizeId = getOrgId();*/
	param.setbookId = $("#setbookId").val();
	gloabGridManager.options.parms = {};
	UICtrl.gridSearch(gloabGridManager, param);
}

function resetForm(obj) {
	$(obj).formClean();
	reloadGrid();
}
