var gridManager = null, detailGridManager = null, paTypeValue = null, refreshFlag = false, perStatus = {};
var tempTotal = 0;// 字表分值合计差
$(document).ready(function() {
			UICtrl.autoSetWrapperDivHeight();
			perStatus = $('#perStatusQuery').combox('getJSONData');
			paTypeValue = $('#paType').val();
			initializeUI();
			initializeGrid();
			initDetailGrid();
			initializeBatchBtn();
		});

function businessJudgmentUnit() {
	return true;
}

function initializeUI() {
	$('#mainfullId').val("-1");
	UICtrl.layout("#layout", {
				leftWidth : 200,
				heightDiff : -5,
				onSizeChanged : function() {
					try {
						detailGridManager.reRender();
					} catch (e) {
					}
				}
			});
	$('#maintree').commonTree({
		loadTreesAction : 'orgAction!queryOrgs.ajax',
		parentId : 'orgRoot',
		manageType : 'hrPerFormAssessManage',
		getParam : function(e) {
			if (e) {
				return {
					showDisabledOrg : 0,
					displayableOrgKinds : "ogn,dpt,pos"
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
	$('div.l-layout-center').css({
				borderWidth : 0
			});
}
function onFolderTreeNodeClick(data) {
	var fullId = '';
	if (data) {
		fullId = data.fullId;
		$('#mainFullId').val(fullId);
	}
	if (!fullId) {
		$('#maingrid').find(".l-panel-header-text").html('考核表列表');
	} else {
		$('#maingrid').find(".l-panel-header-text")
				.html("<font style=\"color:Tomato;font-size:13px;\">["
						+ data.name + "]</font>" + '考核表列表');
	}
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
	var evaluationId = $('#evaluationId').val();
	var paType = $('#paType').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
				addHandler : addHandler,
				updateHandler : function() {
					updateHandler();
				},
				noAduitHandler : {
					id : 'noaduit',
					text : '修改状态',
					img : '',
					click : onAduit
				},
				moreOperate : {
					id : 'moreOperate',
					text : '更多操作',
					img : 'page_settings.gif',
					click : function() {
					}
				}
			});
	gridManager = UICtrl.grid('#maingrid', {
				columns : [{
							display : "考核表名称",
							name : "templetName",
							width : 180,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "考核表编码",
							name : "templetCode",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "指标总分",
							name : "total",
							width : 60,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "状态",
							name : "status",
							width : 60,
							minWidth : 60,
							type : "string",
							align : "left",
							render : function(item) {
								return perStatus[item.status];
							}
						}],
				dataAction : 'server',
				url : web_app.name
						+ '/performassessAction!slicedQueryPerformAssessTemplet.ajax',
				parms : {
					fullId : $('#mainFullId').val(),
					templetId : evaluationId,
					paType : paType
				},
				pageSize : 20,
				title : "考核表列表",
				width : '39%',
				height : '100%',
				heightDiff : -15,
				headerRowHeight : 25,
				rowHeight : 25,
				sortName : 'templetId',
				sortOrder : 'desc',
				checkbox : true,
				toolbar : toolbarOptions,
				fixedCellHeight : true,
				selectRowButtonOnly : true,
				onDblClickRow : function(data, rowindex, rowobj) {
					updateHandler(data.templetId);
				},
				onLoadData : function() {
					return !($('#mainFullId').val() == '')
							|| !($('#evaluationId').val() == '');
				},
				onSelectRow : function(data, rowindex, rowobj) {
					refreshIndexGrid(data.templetId);
				},
				onSuccess : function() {
					var v = $('#mainTempletId').val();
					if (v != '' && v != -1) {
						refreshIndexGrid(-1);
					}
				}
			});
	UICtrl.createGridQueryBtn('#maingrid', function(param) {
				UICtrl.gridSearch(gridManager, {
							templetName : encodeURI(param)
						});
			});
	initMoreOperate();
}
// 更多操作按钮
function initMoreOperate() {
	// copyNew:{id:'copyNew',text:'复制',img:'page_favourites.gif',click:copyNew},
	// aduitHandler:{
	// id:'sendAduit',text:'发起审核',img:'page_next.gif',click:sendAduit}
	var more = $('#toolbar_menumoreOperate');
	more.contextMenu({
				width : "100px",
				eventType : 'mouseover',
				autoHide : true,
				overflow : function() {
					var of = more.offset(), height = more.height() + 2;
					return {
						left : of.left,
						top : of.top + height
					};
				},
				items : [{
							name : "删除",
							icon : 'copyGif',
							handler : function() {
								deleteTempletHandler()
							}
						}, {
							name : "复制新增",
							icon : 'copyGif',
							handler : copyNew
						}, {
							name : "移动",
							icon : 'copyGif',
							handler : doMove
						}, {
							classes : 'separator'
						}, {
							name : "发起审核",
							icon : 'next',
							handler : sendAduit
						}

				],
				onSelect : function() {
					this._hideMenu();
				}
			});
}
// 刷新表格
function reloadGrid() {
	gridManager.loadData();
}
// 更改显示状态,不重刷表格
function updateMainStatus() {
	var row = gridManager.getSelectedRow();
	gridManager.updateRow(row, {
				status : 0
			});
}
// 移动
function doMove() {
	var rows = gridManager.getSelectedRows();
	if (!rows || rows.length < 1) {
		Public.tip('请选择数据！');
		return;
	}
	if (!UICtrl.moveTreeDialog) {
		UICtrl.moveTreeDialog = UICtrl.showDialog({
			title : '请选择单位',
			width : 300,
			content : '<div style="overflow-x: hidden; overflow-y: auto; width:280px;height:250px;"><ul id="dialogMoveOrgTree"></ul></div>',
			init : function() {
				$('#dialogMoveOrgTree').commonTree({
					loadTreesAction : 'orgAction!queryOrgs.ajax',
					parentId : 'orgRoot',
					getParam : function(e) {
						if (e) {
							return {
								showVirtualOrg : 1,
								showDisabledOrg : 0,
								displayableOrgKinds : "ogn,dpt"
							};
						}
						return {
							showDisabledOrg : 0
						};
					},
					changeNodeIcon : function(data) {
						data[this.options.iconFieldName] = OpmUtil
								.getOrgImgUrl(data.orgKindId, data.status);
					},
					IsShowMenu : false
				});
			},
			ok : function() {
				var node = $('#dialogMoveOrgTree').commonTree('getSelected');
				if (!node) {
					Public.tip('请选择树节点！');
					return false;
				}
				var rows = gridManager.getSelectedRows();
				if (!rows || rows.length < 1) {
					Public.tip('请选择数据！');
					return;
				}
				var fullId = node.fullId;

				Public
						.ajax(
								web_app.name
										+ '/performassessAction!movePerformAssessTemplet.ajax',
								{
									detailData : $.toJSON(rows),fullId:fullId
								}, function() {
									reloadGrid();
									
								});

			},
			close : function() {
				this.hide();
				return false;
			}
		});
	} else {
		$('#dialogMoveTree').commonTree('refresh');
		UICtrl.moveTreeDialog.show().zindex();
	}

}
// 添加按钮
function addHandler() {
	var fullId = $('#mainFullId').val();
	if (fullId == '' || fullId == '-1') {
		Public.tip("请选择组织节点!");
		return;
	}
	UICtrl.showAjaxDialog({
				url : web_app.name
						+ '/performassessAction!showInsertPerformAssessTemplet.load',
				param : {},
				ok : insert,
				title : "新增考核表",
				width : 350
			});
}
// 发送审核按钮
function sendAduit() {
	var fullId = $('#mainFullId').val();
	if (fullId == '' || fullId == '-1') {
		Public.tip("请选择组织节点!");
		return;
	}
	UICtrl.confirm('确定发起审核吗?', function() {
				$('#submitForm').ajaxSubmit({
					url : web_app.name
							+ '/assessmentauditAction!sendAduit.ajax',
					param : {
						fullId : fullId,
						kind : "formAduit"
					},
					success : function() {
						reloadGrid();
					}
				});
			});
}

// 直接修改表的状态
function onAduit() {
	var templetIds = DataUtil.getSelectedIds({
				gridManager : gridManager,
				idFieldName : 'templetId'
			});
	if (!templetIds)
		return;
	var sts = DataUtil.getSelectedIds({
				gridManager : gridManager,
				idFieldName : 'status'
			});
	for (var i = 0; i < sts.length; i++) {
		if (parseInt(sts[i]) == 3) {
			Public.tip('审核中的状态不能修改!');
			return false;
		}
	}
	UICtrl.confirm('确定修改表的状态为【已审核】吗?', function() {
				$('#submitForm').ajaxSubmit({
							url : web_app.name
									+ '/performassessAction!noAduit.ajax',
							param : {
								templetIds : $.toJSON(templetIds)
							},
							success : function() {
								reloadGrid();
							}
						});
			});
}
// 复制新增
function copyNew() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！');
		return;
	}
	UICtrl.confirm('您确定复制吗?', function() {
		Public
				.ajax(
						web_app.name
								+ '/performassessAction!copyNewPerformAssessTemplet.ajax',
						{
							templetId : row.templetId
						}, function() {
							reloadGrid();
							refreshIndexGrid(-1);
						});
	});
}
// 编辑按钮
function updateHandler(templetId) {
	if (!templetId) {
		var row = gridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择模板数据！');
			return;
		}
		templetId = row.templetId;
	}
	UICtrl.showAjaxDialog({
				url : web_app.name
						+ '/performassessAction!showUpdatePerformAssessTemplet.load',
				param : {
					templetId : templetId
				},
				ok : update,
				title : "修改考核表",
				width : 350
			});
}

// 删除模板
function deleteTempletHandler() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择考核表数据！');
		return;
	}
	UICtrl.confirm('确定删除吗?', function() {
		// 所需参数需要自己提取 {id:row.id}
		Public
				.ajax(
						web_app.name
								+ '/performassessAction!deletePerformAssessTemplet.ajax',
						{
							templetId : row.templetId
						}, function() {
							reloadGrid();
							refreshIndexGrid(-1);
						});
	});
}
// 新增保存
function insert() {
	var templetId = $('#templetId').val();
	var paType = $('#paType').val();
	if (templetId != '')
		return update();
	var _self = this;
	$('#submitForm').ajaxSubmit({
		url : web_app.name
				+ '/performassessAction!insertPerformAssessTemplet.ajax',
		param : {
			fullId : $('#mainFullId').val(),
			paType : paType
		},
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
}

// 编辑保存
function update() {
	var _self = this;
	$('#submitForm').ajaxSubmit({
		url : web_app.name
				+ '/performassessAction!updatePerformAssessTemplet.ajax',
		success : function() {
			_self.close();
			reloadGrid();
		}
	});
}

function refreshIndexGrid(templetId) {
	$('#mainTempletId').val(templetId);
	detailGridManager.options.parms.templetId = templetId;
	detailGridManager.loadData();
}
function initDetailGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		saveHandler : saveIndexHandler,
		addBatchHandler : {
			id : 'AddBatch',
			text : '批量添加指标项',
			img : 'page_extension.gif'
		},
		addHandler : addIndexHandler,
		updateHandler : function() {
			updateIndexHandler();
		},
		deleteHandler : deleteIndexHandler
			/*
			 * saveScoreHandler:{id:'saveScore',text:'保存分值',img:'filesave.png',click:function(){
			 * saveScore(); }}
			 */

		});
	detailGridManager = UICtrl.grid('#indexgrid', {
		columns : [{
					display : "主项目",
					name : "mainContent",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "left",
					editor : {
						type : 'text'
					}
				}, {
					display : "指标名称",
					name : "partContent",
					width : 150,
					minWidth : 60,
					type : "string",
					align : "left"
				}, {
					display : "分值",
					name : "scoreNum",
					width : 60,
					minWidth : 60,
					type : "string",
					align : "left",
					editor : {
						type : 'spinner',
						min : 1,
						mask : 'nnn.n'
					}
				}, {
					display : "序号",
					name : "sequence",
					width : 60,
					minWidth : 60,
					type : "string",
					align : "left",
					editor : {
						type : 'spinner',
						min : 1,
						mask : 'nnn',
						required : true
					}
				}, {
					display : "指标说明",
					name : "desption",
					width : 400,
					minWidth : 60,
					type : "string",
					align : "left",
					editor : {
						type : 'text'
					},
					render : function(item) {
						return '<div title="' + item.desption + '">'
								+ item.desption + '</div>';
					}
				}],
		dataAction : 'server',
		url : web_app.name
				+ '/performassessAction!slicedQueryPerformAssessTempletDeta.ajax',
		pageSize : 20,
		parms : {
			totalFields : 'scoreNum'
		},
		width : '59%',
		height : '100%',
		heightDiff : -18,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit : true,
		sortName : 'sequence',
		sortOrder : 'asc',
		checkbox : true,
		toolbar : toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData : function() {
			return !($('#mainTempletId').val() == '');
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateIndexHandler(data.detailId);

		},
		totalRender : function(data) {
			var pageTotal = 0, scoreNum;
			$.each(data.Rows, function(i, o) {
						scoreNum = parseInt(o.scoreNum, 10);
						pageTotal += isNaN(scoreNum) ? 0 : scoreNum;
					});
			var allTotal = 0;
			if (data.totalFields) {
				allTotal = data.totalFields['scoreNum'];
			} else {
				allTotal = pageTotal;
			}
			var html = ['指标分值合计: <span id="scoreNumSpan">'];
			html.push(allTotal);
			html.push('</span>');
			tempTotal = parseInt(allTotal, 10) - pageTotal;
			return html.join('');
		},
		onAfterEdit : function(e) {
			if (e.column.name == "scoreNum") {
				var totalSpan = $('#scoreNumSpan');
				var data = detailGridManager.currentData['Rows'];
				var pageTotal = 0, scoreNum;
				$.each(data, function(i, o) {
							scoreNum = parseInt(o.scoreNum, 10);
							pageTotal += isNaN(scoreNum) ? 0 : scoreNum;
						});
				totalSpan.text(pageTotal + tempTotal);
			}
		}
	});
}

function addIndexHandler() {
	var templetId = $('#mainTempletId').val();
	if (templetId == '' || templetId <= 0 || templetId == '-1') {
		Public.tip("请选择考核表!");
		return;
	}
	UICtrl.showAjaxDialog({
				url : web_app.name
						+ '/performassessAction!showIndexTempletIndex.load',
				param : {
					templetId : templetId,
					paType : paTypeValue
				},
				ok : insertIndex,
				width : 400,
				title : "新增考核指标"
			});
}
// 编辑按钮
function updateIndexHandler(detailId) {
	if (!detailId) {
		var row = detailGridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择指标数据！');
			return;
		}
		detailId = row.detailId;
	}
	// 所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({
		url : web_app.name + '/performassessAction!showUpdateTempletIndex.load',
		param : {
			detailId : detailId,
			paType : paTypeValue
		},
		width : 400,
		title : "修改考核指标",
		ok : updateIndex
	});
}
// 新增保存
function insertIndex() {
	var _self = this;
	$('#submitForm').ajaxSubmit({
				url : web_app.name
						+ '/performassessAction!insertTempletIndex.ajax',
				param : {
					templetId : $('#mainTempletId').val()
				},
				success : function(data) {
					_self.close();
					reLoaddetailGrid();
					updateMainStatus();
				}
			});
}

// 编辑保存
function updateIndex() {
	var _self = this;
	$('#submitForm').ajaxSubmit({
				url : web_app.name
						+ '/performassessAction!updateTempletIndex.ajax',
				param : {
					templetId : $('#mainTempletId').val()
				},
				success : function() {
					_self.close();
					reLoaddetailGrid();
					updateMainStatus();
				}
			});
}
function reLoaddetailGrid() {
	detailGridManager.loadData();
	// reloadGrid();
}
function initializeBatchBtn() {
	$('#toolbar_menuAddBatch').comboDialog({
				type : 'hr',
				name : 'performAssessIndexSelect',
				width : 600,
				dataIndex : 'indexId',
				title : '请选择指标',
				checkbox : true,
				onShow : function() {
					var templetId = $('#mainTempletId').val();
					if (templetId == '' || templetId <= 0 || templetId == '-1') {
						Public.tip("请选择考核表!");
						return false;
					}
					return true;
				},
				onChoose : function() {
					var rows = this.getSelectedRows();
					var addRows = [], addRow;
					$.each(rows, function(i, o) {
								addRow = $.extend({}, o);
								addRow["indexId"] = o["indexId"];
								addRow["mainContent"] = o["mainContent"];
								addRow["partContent"] = o["partContent"];
								addRow["desption"] = o["desption"];
								addRows.push(addRow);
							});
					detailGridManager.addRows(addRows);
					return true;
				}
			});
}

// 删除模板指标
function deleteIndexHandler() {
	DataUtil.delSelectedRows({
				action : 'performassessAction!deletePerformAssessTempletDeta.ajax',
				gridManager : detailGridManager,
				idFieldName : 'detailId',
				param : {
					templetId : $('#mainTempletId').val()
				},
				onSuccess : function() {
					reLoaddetailGrid();
					updateMainStatus();
				}
			});
}
// 批量保存指标
function saveIndexHandler() {
	var templetId = $('#mainTempletId').val();
	if (templetId == '' || templetId <= 0 || templetId == '-1') {
		return false;
	}
	var detailData = DataUtil.getGridData({
				gridManager : detailGridManager,
				idFieldName : 'detailId'
			});
	if (!detailData)
		return false;
	if (detailData.length == 0)
		return;
	Public
			.ajax(
					web_app.name
							+ "/performassessAction!savePerformAssessTempletDetail.ajax",
					{
						detailData : encodeURI($.toJSON(detailData)),
						templetId : $('#mainTempletId').val()
					}, function() {
						reLoaddetailGrid();
						updateMainStatus();
						UICtrl.confirm('是否修改状态为已审核吗?', function() {
							$('#submitForm').ajaxSubmit({
								url : web_app.name
										+ '/performassessAction!noAduitOneTempletOrPerson.ajax',
								param : {
									templetId : templetId
								},
								success : function() {
									reloadGrid();
								}
							});
						})
					});
}
