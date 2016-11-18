var imp_log_query_manage_type = 'hrSocialImp';

// 日志查询列表按钮
function getLogGridToolbarOptions() {
	var tmp_button = $('<span style="display:none;"></span>').appendTo('body');
	tmp_button.comboDialog({
		title : '请选择业务期间',
		type : 'hr',
		name : 'chooseOperationPeriod',
		width : 305,
		onInit : function(doc) {
			// 默认查询条件为当前年
			var year = new Date().getFullYear();
			$('input.text', doc).val(year).mask('9999').spinner();
		},
		getParam:function(){
			var year = new Date().getFullYear();
			return {paramValue:year};
		},
		onChoose : function() {
			var row = this.getSelectedRow();
			if (!row) {
				Public.tip('请选择数据！');
				return;
			}
			var periodId = row['periodId'];
			if (Public.isBlank(choose_serialId)) {
				return true;
			}
			Public.ajax(web_app.name+ '/staffWelfareAction!updateSocialSecurityOperationPeriodBySerialId.ajax',{periodId : periodId,serialId : choose_serialId});
			return true;
		}
	});
	return UICtrl.getDefaultToolbarOptions({
		deleteBySerialId : {
			id : 'deleteBySerialId',
			text : '删除导入数据',
			img : 'page_text_delete.gif',
			click : function() {
				var row = gridManager.getSelectedRow();
				if (!row) {
					Public.tip('请选择数据！');
					return;
				}
				var serialId = row['serialId'];
				if (Public.isBlank(serialId)) {
					Public.tip('本次导入没有生成数据!');
					return;
				}
				UICtrl.confirm('确定删除本次导入数据吗?', function() {
					Public
							.ajax(
									web_app.name
											+ '/staffWelfareAction!deleteSocialSecurityBySerialId.ajax',
									{
										serialId : serialId
									}, function() {
										reloadGrid();
										try {
											getErrorGridManager().loadData();
											getSuccessGridManager().loadData();
										} catch (e) {
										}
									});
				});
			}
		},
		noSocialSecurityPerson : {
			id : 'noSocialSecurityPerson',
			text : '查询导入遗漏人员',
			img : 'page_find.gif',
			click : function() {
				var row = gridManager.getSelectedRow();
				/*
				 * if (!row) {Public.tip('请选择数据！'); return; } var
				 * serialId=row['serialId']; if(Public.isBlank(serialId)){
				 * Public.tip('本次导入没有生成数据!'); return; }
				 */
				var organId = ContextUtil.getOperator('orgId');
				if (row) {
					organId = row['organId'];
				}
				UICtrl.showFrameDialog({
					url : web_app.name
							+ "/biz/hr/pay/staffwelfare/noStaffwelfarePerson.jsp",
					param : {
						impOrganId : organId,
						// impSerialId : serialId,
						queryType : 'socialSecurity'
					},
					title : "导入遗漏人员",
					width : 880,
					height : 400,
					cancelVal : '关闭',
					ok : false,
					cancel : true
				});
			}
		},
		updateOperationPeriod : {
			id : 'updateOperationPeriod',
			text : '确定业务期间',
			img : 'page_component.gif',
			click : function() {
				var row = gridManager.getSelectedRow();
				if (!row) {
					Public.tip('请选择数据！');
					return;
				}
				choose_serialId = row['serialId'];
				if (Public.isBlank(choose_serialId)) {
					Public.tip('本次导入没有生成数据!');
					return;
				}
				tmp_button.triggerHandler('click');
			}
		}
	});
}

function getErrorGridOptions() {
	var options = {};
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		saveManualOperation : {
			id : 'saveManualOperation',
			text : '确认导入',
			img : 'page_wizard.gif',
			click : function() {
				var ids = DataUtil.getSelectedIds({
							gridManager : getErrorGridManager(),
							idFieldName : 'tmpId'
						});
				if (!ids)
					return;
				var serialId = getErrorGridManager().getSelectedRow()['serialId'];
				// 重新导入 重复数据
				Public
						.ajax(
								web_app.name
										+ '/staffWelfareAction!saveRepeatImpSocialSecurity.ajax',
								{
									ids : $.toJSON(ids),
									serialId : serialId
								}, function() {
									getErrorGridManager().loadData();
									getSuccessGridManager().loadData();
									reloadGrid();
								});
			}
		}
	});
	options['toolbar'] = toolbarOptions;
	options['checkbox'] = true;
	return options;
}