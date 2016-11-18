var gridManager = null, refreshFlag = false;
var dataSource = {
	yesOrNo : {
		1 : '是',
		0 : '否'
	}
};
var developbutton = [{
			id : 'devbtn',
			name : '新开发课程',
			callback : developHandler
		}];
$(document).ready(function() {
			UICtrl.autoSetWrapperDivHeight();
			initializeGrid();
			initializeBatchBtn();
		});
// 初始化表格
function initializeGrid() {
	var classStatus = $('#classStatus').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		saveHandler : saveHandler,
		addBatchHandler : {
			id : 'AddBatch',
			text : '批量添加课程',
			img : 'page_extension.gif'
		},
		// updateCourseHandler:
		// {id:'updateCourse',text:'安排课程教师',img:'page_edit.gif',click:updateCourseTeacherHandler},
		closeCourseHandler : {
			id : 'closeCourse',
			text : '取消课程',
			img : 'page_delete.gif',
			click : closeCourseHandler
		},
		openCourseHandler : {
			id : 'openCourse',
			text : '开课',
			img : 'page_next.gif',
			click : openCourseHandler
		},
		lessonRecord : {
			id : 'studentSign',
			text : '课堂记录',
			img : 'action_go.gif',
			click : function(item) {
				var row = gridManager.getSelectedRow();
				var trainingClassCourseId = row.trainingClassCourseId;
				var url = web_app.name
						+ '/trainingClassCourseAction!showUpdateTrainingSignBill.do?bizId='
						+ trainingClassCourseId/* +'&isReadOnly=true' */;
				parent.addTabItem({
							tabid : 'studentSign' + trainingClassCourseId,
							text : '培训签到,课堂记录登记',
							url : url
						});
			}
		},
		sendCourseNoticeHandler : {
			id : 'sendCourseNotice',
			text : '发布通知',
			img : 'home.gif',
			click : sendCourseNotice
		}
		/*trainingChangeApplyHandler : {
			id : 'trainingChangeApply',
			text : '填写培训变更申请表',
			img : 'action_refresh_blue.gif',
			click : trainingChangeApply
		}*/
	});
	gridManager = UICtrl.grid('#maingrid', {
				columns : [{
							display : "班级名称",
							name : "className",
							width : 120,
							minWidth : 60,
							type : "string",
							align : "center"
						}, {
							display : "课程名称",
							name : "courseName",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "center"
						}, {
							display : "讲师姓名",
							name : "teacherName",
							width : 150,
							minWidth : 60,
							type : "string",
							align : "center",
							editor : {
								type : 'select',
								required : true,
								data : {
									type : "hr",
									name : "trainTeacherSelect",
									back : {
										staffName : "teacherName",
										trainingTeacherId : "trainingTeacherId"
									}
								}
							}
						}, {
							display : "课程时间(起)",
							name : "courseStartTime",
							width : 150,
							minWidth : 60,
							type : "string",
							align : "center",
							editor : {
								type : 'dateTime',
								required : true
							}
						}, {
							display : "课程时间(止)",
							name : "courseEndTime",
							width : 150,
							minWidth : 60,
							type : "string",
							align : "center",
							editor : {
								type : 'dateTime',
								required : true
							}
						}, {
							display : "是否节假日上课",
							name : "isHolidays",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "center",
							editor : {
								type : 'combobox',
								required : true,
								data : dataSource.yesOrNo
							},
							render : function(item) {
								return dataSource.yesOrNo[item.isHolidays];
							}
						}, {
							display : "课程地点",
							name : "coursePlace",
							width : 150,
							minWidth : 60,
							type : "string",
							align : "center",
							editor : {
								type : 'text',
								required : true
							}
						}, {
							display : "备注",
							name : "remark",
							width : 100,
							minWidth : 60,
							type : "string",
							align : "center",
							editor : {
								type : 'text',
								required : false
							}
						}, {
							display : "状态",
							name : "status",
							width : 60,
							minWidth : 60,
							type : "string",
							align : "center",
							render : function(item) {
								return UICtrl.getStatusInfo(item.status);
							}
						}, {
							display : "培训效果评估表",
							name : "num",
							width : 120,
							minWidth : 60,
							type : "string",
							align : "center",
							render : function(item) {
								if (item.num == 0) {
									return '<a href="javascript:doOperation('
											+ item.trainingClassCourseId
											+ ');" class="GridStyle">'
											+ "发送评估表" + '</a>';
								} else {
									return '<a href="javascript:viewOperation('
											+ item.trainingClassCourseId
											+ ');" class="GridStyle">'
											+ "查看评估表" + '</a>';
								}
							}
						}],
				dataAction : 'server',
				url : web_app.name
						+ '/trainingClassCourseAction!slicedQuery.ajax',
				parms : {
					trainingSpecialClassId : $("#trainingSpecialClassId").val()
				},
				pageSize : 20,
				enabledEdit : true,
				width : '100%',
				height : '100%',
				heightDiff : -10,
				headerRowHeight : 25,
				rowHeight : 25,
				sortName : 'trainingClassCourseId',
				sortOrder : 'asc',
				toolbar : toolbarOptions,
				onBeforeEdit : function() {
					if (classStatus != 2) {
						return true;
					}
					return false;
				},
				fixedCellHeight : true,
				selectRowButtonOnly : true,
				onDblClickRow : function(data, rowindex, rowobj) {
					// updateCourseTeacherHandler(data.trainingClassCourseId);
				}
			});
	UICtrl.setSearchAreaToggle(gridManager);
}

function doOperation(trainingClassCourseId) {
	UICtrl.confirm('发送培训评估表需要在课程培训结束后，确定现在发送培训评估表吗?', function() {
		Public
				.ajax(
						web_app.name
								+ '/trainingEffectEvaAction!insertTrainingEffectEvaluate.ajax',
						{
							trainingClassCourseId : trainingClassCourseId
						}, function() {
							reloadGrid();
						});
	});
}

function updateCourseTeacherHandler(trainingClassCourseId) {
	if (!trainingClassCourseId) {
		var row = gridManager.getSelectedRow();
		if (!row) {
			Public.tip('请选择数据！');
			return;
		}
		trainingClassCourseId = row.trainingClassCourseId;
	}
	UICtrl.showAjaxDialog({
				url : web_app.name
						+ '/trainingClassCourseAction!showUpdate.load',
				param : {
					trainingClassCourseId : trainingClassCourseId
				},
				ok : update,
				title : '指定教师',
				width : 420,
				close : dialogClose
			});
}

function viewOperation(trainingClassCourseId) {
	parent.addTabItem({
		tabid : 'HRTrainingEffectEvalation' + trainingClassCourseId,
		text : '培训效果评估反馈列表',
		url : web_app.name
				+ '/trainingEffectEvaAction!forwardListTrainingEffectEvaluate.do?trainingClassCourseId='
				+ trainingClassCourseId
	});
}

function saveHandler() {
	var trainingLevel = $('#trainingLevel').val();
	var trainingSpecialClassId = $('#trainingSpecialClassId').val();
	var classStatus = $('#classStatus').val();
	var isNewStaffTrain = $('#isNewStaffTrain').val();
	var extendedData = DataUtil.getGridData({
				gridManager : gridManager
			});
	if (!extendedData) {
		return false;
	}
	if (classStatus == 2) {
		Public.tip('此班级已被锁定,若需变更课程信息,请填写培训变更申请表！');
		return;

	}
	var fn = function() {
		$('#classStatus').val('2');
		Public.successTip("已完成初始化，班级课程已锁定!");
		reloadGrid();
	};
	Public.ajax(web_app.name + '/trainingClassCourseAction!save.ajax', {
				extendedData : $.toJSON(extendedData)
			}, function() {
				if (trainingLevel == 1 && isNewStaffTrain != 1
						&& classStatus != 2) {
					UICtrl.showDialog({
						width : 410,
						title:'提示',
						content : '保存成功！请选择是否锁定课程？课程锁定后将不能修改课程时间和地点',
						cancelVal: '不锁定课程',
		               okVal:'锁定课程',
						ok : function() {
						 Public.ajax(web_app.name + '/trainingSpecialClassAction!updateClassStatus.ajax',
					       {trainingSpecialClassId:trainingSpecialClassId,classStatus:2},
					      fn);
						}
					});

					/* UICtrl.confirm('保存成功，锁定课程请点击 确定 按钮，若不需要锁定请点击 取消
					 按钮!(注:锁定课程后将不能编辑列表)',function(){
					 Public.ajax(web_app.name +
					 '/trainingSpecialClassAction!updateClassStatus.ajax',
					 {trainingSpecialClassId:trainingSpecialClassId,classStatus:2},
					 fn);
				 })*/
				} else {
					reloadGrid();
				}
			});
}

function openCourseHandler() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！');
		return;
	}
	var status = row.status;
	var trainingSpecialClassId = $('#trainingSpecialClassId').val();
	if (status != 0) {
		Public.tip('课程不是草稿状态,不能执行开课操作！');
		return;
	}
	UICtrl.confirm('确定开课吗?', function() {
				Public
						.ajax(
								web_app.name
										+ '/trainingClassCourseAction!updateCourseStatus.ajax',
								{
									trainingClassCourseId : row.trainingClassCourseId,
									trainingSpecialClassId : trainingSpecialClassId,
									status : 1
								}, function() {
									reloadGrid();
								});
			});
}

function sendCourseNotice() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！');
		return;
	}
	var status = row.status;
	var trainingSpecialClassId = $('#trainingSpecialClassId').val();
	if (status == -1) {
		Public.tip('课程已关闭,不能发送通知！');
		return;
	}
	Public.ajax(web_app.name
					+ '/trainingClassCourseAction!sendCourseNotice.ajax', {
				trainingClassCourseId : row.trainingClassCourseId,
				trainingSpecialClassId : trainingSpecialClassId,
				flag : 1
			}, function() {
				reloadGrid();
			});
}

function developHandler() {
	var trainingSpecialClassId = $("#trainingSpecialClassId").val();
	var url = web_app.name
			+ '/trainingCourseAction!forwardList.do?trainingSpecialClassId='
			+ trainingSpecialClassId;
	parent.addTabItem({
				tabid : 'developHandler' + trainingSpecialClassId,
				text : '课程管理',
				url : url
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
// 添加按钮
function initializeBatchBtn() {
	var trainingSpecialClassId = $('#trainingSpecialClassId').val();
	$('#toolbar_menuAddBatch').comboDialog({
		type : 'hr',
		name : 'trainCourseSelect',
		width : 600,
		dataIndex : 'trainingCourseId',
		title : '请选择课程',
		checkbox : true,
		dialogOptions : {
			button : developbutton
		},
		onChoose : function() {
			var rows = this.getSelectedRows();
			if (!rows.length) {
				Public.tip('请选择课程!');
				return false;
			}
			Public
					.ajax(
							web_app.name
									+ '/trainingClassCourseAction!saveChoiceCourse.ajax',
							{
								trainingSpecialClassId : trainingSpecialClassId,
								trainingCourses : $.toJSON(rows)
							}, function() {
								reloadGrid();
							});
			return true;
		}
	});
}

// 删除按钮
function closeCourseHandler() {
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！');
		return;
	}
	var status = row.status;
	var trainingSpecialClassId = $('#trainingSpecialClassId').val();
	/*
	 * if(status!=0){ Public.tip('课程不是草稿状态,不能执行关闭操作！'); return; }
	 */
	UICtrl.confirm('确定关闭课程吗?', function() {
				Public
						.ajax(
								web_app.name
										+ '/trainingClassCourseAction!updateCourseStatus.ajax',
								{
									trainingClassCourseId : row.trainingClassCourseId,
									trainingSpecialClassId : trainingSpecialClassId,
									status : -1
								}, function() {
									reloadGrid();
								});
			});
}
// 编辑保存
function update() {
	$('#submitForm').ajaxSubmit({
				url : web_app.name + '/trainingClassCourseAction!update.ajax',
				success : function() {
					refreshFlag = true;
				}
			});
}
// 关闭对话框
function dialogClose() {
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}
/*
function trainingChangeApply() {
	var trainingSpecialClassId = $('#trainingSpecialClassId').val();
	var url = web_app.name
			+ '/trainingChangeApplyAction!forwardTrainingChangeApplyBill.job?trainingSpecialClassId='
			+ trainingSpecialClassId;
	parent.addTabItem({
				tabid : 'trainingChangeApply' + trainingSpecialClassId,
				text : '培训变更申请',
				url : url
			});
}*/
