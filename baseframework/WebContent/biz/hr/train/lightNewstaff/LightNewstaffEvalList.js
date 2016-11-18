var gridManager = null, refreshFlag = false;
$(document).ready(function() {
			UICtrl.autoSetWrapperDivHeight();
			initializeUI();
			initializeGrid();
		});
function initializeUI() {
	UICtrl.layout("#layout", {
				leftWidth : 200,
				heightDiff : -5
			});
	$('#maintree').commonTree({
		loadTreesAction : 'orgAction!queryOrgs.ajax',
		parentId : 'orgRoot',
		// manageType:'hrBaseRecruitData',
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
		html.push('季度评价列表');
	} else {
		fullId = data.fullId, fullName = data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[', fullName,
				']</font>季度评价列表');
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
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
				viewHandler : function() {
					updateHandler();
				}
			});
	gridManager = UICtrl.grid('#maingrid', {
				columns : [
				         {
							display : "员工姓名",
							name : "staffName",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "督导师姓名",
							name : "teacher",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "填表时间",
							name : "fillinDate",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "单据编号",
							name : "billCode",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "制表人机构姓名",
							name : "organName",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "制表人部门姓名",
							name : "deptName",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "制表人岗位名称",
							name : "positionName",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "制表人姓名",
							name : "personMemberName",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "状态",
							name : "statusTextView",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}, {
							display : "考核周期",
							name : "periodIndex",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left",
							render : function(item) {
								if (Public.isBlank(item.periodIndex))
									return '';
								return item.periodIndex + '季度';
							}
						}, {
							display : "考核年",
							name : "year",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "left"
						}

				],
				dataAction : 'server',
				url : web_app.name
						+ '/lightNewstaffEvalAction!slicedQuery.ajax',
				pageSize : 20,
				width : '100%',
				height : '100%',
				heightDiff : -10,
				headerRowHeight : 25,
				rowHeight : 25,
				sortName : 'fillinDate',
				sortOrder : 'desc',
				toolbar : toolbarOptions,
				fixedCellHeight : true,
				selectRowButtonOnly : true,
				onDblClickRow : function(data, rowindex, rowobj) {
					updateHandler(data.evalId);
				}
			});
	UICtrl.setSearchAreaToggle(gridManager);
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
// 编辑按钮
function updateHandler(evalId) {
	if (!evalId) {
		var row = gridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择数据！');
			return;
		}
		evalId = row.evalId;
	}
	parent.addTabItem({
				tabid : 'HRlightNewstaffEvalList' + evalId,
				text : '光芒新生季度评价表查看',
				url : web_app.name
						+ '/lightNewstaffEvalAction!showUpdate.do?bizId='
						+ evalId + '&isReadOnly=true'
			});
}

// 删除按钮
function deleteHandler() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！');
		return;
	}
	UICtrl.confirm('确定删除吗?', function() {
				// 所需参数需要自己提取 {id:row.id}
				Public.ajax(web_app.name
								+ '/lightNewstaffEvalAction!delete.ajax', {},
						function() {
							reloadGrid();
						});
			});
}

// 关闭对话框
function dialogClose() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}
