var gridManager = null, refreshFlag = false;
$(document).ready(function() {
			UICtrl.autoSetWrapperDivHeight();
			initializeGrid();
		});

// 初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addHandler : function() {
			UICtrl.addGridRow(gridManager);
		},
		createEvalHandler : {
			id : 'createEval',
			text : '发起评价',
			img : 'page_next.gif',
			click : createEval
		}
		});
	gridManager = UICtrl.grid('#maingrid', {
		columns : [{
					display : "员工所在单位",
					name : "orgnName",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "center"
				}, {
					display : "员工所在部门",
					name : "deptName",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "center"
				}, {
					display : "员工所在岗位",
					name : "posName",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "center"
				},
				{
					display : "员工姓名",
					name : "staffName",
					width : 250,
					minWidth : 60,
					type : "string",
					align : "center",
					editor : {
						type : 'select',
						required : true,
						data : {
							type : "hr",
							name : "resignationChoosePerson",
							back : {
								staffName : "staffName",
								archivesId : "archivesId",
								ognName : "orgnName",
								dptName : "deptName",
								posName : "posName"
							}
						}
					}
				}, {
					display : "督导师姓名",
					name : "teacher",
					width : 250,
					minWidth : 60,
					type : "string",
					align : "center",
					editor : {
						type : 'select',
						required : true,
						data : {
							type : "sys",
							name : "orgSelect",
							getParam : function() {
								return {
									a : 1,
									b : 1,
									searchQueryCondition : " org_kind_id ='psm' and instr(full_id, '.prj') = 0 "
								};
							},
							back : {
								personMemberId : "teacherId",
								personMemberName : "teacher",
								orgName : "teacherOrg",
								deptName : "teacherDept",
								positionName : "teacherPos"
							}
						}
					}
				}, {
					display : "督导师所在单位",
					name : "teacherOrg",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "center"
				}, {
					display : "督导师所在部门",
					name : "teacherDept",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "center"
				}, {
					display : "督导师所在岗位",
					name : "teacherPos",
					width : 100,
					minWidth : 60,
					type : "string",
					align : "center"
				}

		],
		autoAddRowByKeydown : false,
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit : true,
		toolbar : toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData : function() {
			return !($('#evalId').val() == '');
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 刷新表格
function reloadGrid() {
	gridManager.loadData();
}

function createEval() {
	var detailData = DataUtil.getGridData({
				gridManager : gridManager
			});
	if (!detailData) {
		Public.tip('没有数据！');
		return;
	}
	Public.ajax(web_app.name
					+ '/lightNewstaffEvalAction!createEvalProcTask.ajax', {
				detailData : $.toJSON(detailData)
			}, function() {
				reloadGrid();
			});
}
