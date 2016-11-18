var gridManager = null, refreshFlag = false;
var wageKindDate=null,wageChangeKindData=null, wageKindTypeData= null;
var examineGrade={};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	$('#mainWageKind').combox('disable');
	wageKindDate=$('#mainWageKind').combox('getJSONData');
	wageKindTypeData=$('#mainWageTypeKind').combox('getJSONData');
	wageChangeKindData=$('#mainWageChangeKind').combox('getJSONData');
	examineGrade=$('#mainEffectiveRank').combox('getJSONData');
	examineGrade['']='';
	var auditId=$('#auditId').val();
	if(auditId==''){//新增时确定薪酬调整类别
		choosePagKind();
		PersonalPasswordAuth.isAuthenticationPassword=true;
	}else{
		initializeGrid();
		doPersonalPasswordAuth(true);
	}
	$('#payChangeFileList').fileList();
	initToolBar();
});

function initToolBar(){
	var operationKind=$('#mainOperationKind').val();
	if(operationKind=='managerSubmit'){//面谈领导提交
		$('#toolBar').toolBar('removeItem');
		$('#toolBar').toolBar('addItem',[ 
		   {id:'save',name:'提交',icon:'turn',event: function(){
			   UICtrl.confirm("您点击“提交”后，系统将提醒到员工本人薪酬发生变动、并通知员工进行薪酬变动查询。", function() {
					var url=web_app.name + '/hRPayChangeAction!completeCopyForTask.ajax';
					Public.ajax(url, {auditId:getId(),taskId:taskId}, function(data){
						UICtrl.closeAndReloadTabs("TaskCenter", null);
					});
				});
		   }},
		   {line:true},
		   {id:'close',name:'关闭',icon:'close',event: function(){UICtrl.closeAndReloadTabs();}},
		   {line:true}
		]);
	}
}

//判断是否是特殊年薪变动
function checkNeedSpecialSalary(){
	var isNeedSpecialSalary=$('#isNeedSpecialSalary').val();
	isNeedSpecialSalary=Public.toNumber(isNeedSpecialSalary,0);
	return isNeedSpecialSalary===1;
}

function doPersonalPasswordAuth(flag){
	PersonalPasswordAuth.showDialog({
		checkTimeLimit:flag,
		okFun:function(){
			this.close();
			PersonalPasswordAuth.isAuthenticationPassword=true;
			if(gridManager){
				reloadGrid();
			}
		},
		closeFun:function(){
			this.close();
		}
	});
}
function choosePagKind(){
	var html=[''];
	var isNeedSpecialSalary=checkNeedSpecialSalary();
	$.each(wageKindTypeData,function(i,o){
		var kindTypeList = i.split('|');
		if(kindTypeList.length < 2){
			Public.tip("工资类别数据错误！");
			return;
		}
		var type = kindTypeList[1];
		var value = kindTypeList[0];
		if(isNeedSpecialSalary){//特殊变动只能选择 年薪制及 年预期制
			if(type != 'year'){
				return;
			}
		}
		html.push('<div style="text-align:left;margin:5px;" id="choosePagKindDiv">');
		html.push('<label><input type="radio" name="radioTest" value="',value,'"',(value==2?' checked="true"':''),'/>&nbsp;',o,'</label>');
		html.push('</div>');
	});
	var options={
		title:'选择工资类别',
		content:html.join(''),
		width: 200,
		opacity:0.1,
		onClick:function($el){
			if($el.is('label')||$el.is('input')){
				$el.find('input').attr('checked',true);
				this.close();
			}
		},
		onClose:function(){
			var kind=$('#choosePagKindDiv').find('input').getValue();
			$('#mainWageKind').combox('setValue',kind);
			initializeGrid();
		}
	};
	Public.dialog(options);
}
function initializeUI(){
	var changeOrgName=$('#changeOrgName');
	changeOrgName.orgTree({
		filter:'dpt,ogn',width:200,
		manageType:'hrPayChange',
		param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		back:{
			text:changeOrgName,
			value:'#changeOrgId',
			id:'#changeOrgId',
			name:changeOrgName
		}
	});
	var managerName=$('#managerName');
	managerName.orgTree({
		filter:'psm',
		back:{
			text:managerName,
			value:'#managerId',
			id:'#managerId',
			name:managerName
		}
	});
	$('#toolbar_menuAddBatch').comboDialog({type:'hr',name:'payChangeChoosePerson',width:700,dataIndex:'archivesId',
		manageType:'hrPayChange',
		getParam:function(){
			return {searchQueryCondition:"full_id like '%"+$('#changeOrgId').val()+"%'"};
		},
		checkbox:true,onChoose:function(){
			var isNeedSpecialSalary=checkNeedSpecialSalary();//是否特殊变动
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["organId"] = o["ognId"];
	    		addRow["organName"] = o["ognName"];
	    		addRow["deptId"] = o["dptId"];
	    		addRow["deptName"] = o["dptName"];
	    		addRow["archivesName"] = o["staffName"];
	    		addRow["oldWageKind"] = o["wageKind"];
	    		addRow["oldWageStandard"] = o["wageStandard"];
	    		addRow["oldWagMonth"] = o["wageMonth"];
	    		addRow["oldPerformanceRelatedPay"] = o["performanceRelatedPay"];
	    		addRow["oldQuarterlyPerformance"] = o["quarterlyPerformance"];
	    		addRow["oldSpecialPerformance"] = o["specialQuarterlyPerformance"];
	    		addRow["newWageStandard"] = o["wageStandard"];
	    		addRow["newWagMonth"] = o["wageMonth"];
	    		addRow["newPerformanceRelatedPay"] = o["performanceRelatedPay"];
	    		addRow["newQuarterlyPerformance"] = o["quarterlyPerformance"];
	    		addRow["newSpecialPerformance"] = o["specialQuarterlyPerformance"];
	    		addRow["changeCount"] = o["changeCount"];
	    		addRow["lastChangeTime"] = o["executionTime"];
	    		addRow["lastChangeNumber"] = o["changeWage"];
	    		addRow["examineGrade"] = o["performanceLevel"];
	    		addRow["changeWage"] = '';
	    		addRow["newWageKind"]=$('#mainWageKind').val();
	    		addRow["executionTime"] = $('#deftEecutionTime').val();
	    		if(isNeedSpecialSalary){
	    			var specialWageStandard=Public.toNumber(o["specialWageStandard"],0);
	    			var wageStandard=Public.toNumber(o["wageStandard"],0);
	    			var totalSalary=specialWageStandard+wageStandard;
	    			addRow["oldSpecialSalary"] = specialWageStandard;
	    			addRow["oldTotalSalary"] = totalSalary;
	    			addRow["newSpecialSalary"] = specialWageStandard;
	    			addRow["newTotalSalary"] = totalSalary;
	    		}
	    		addRows.push(addRow);
	    	});
	    	gridManager.addRows(addRows);
	    	return true;
    }});
	if(Public.isReadOnly){
		return;
	}
	if(!UICtrl.isApplyProcUnit()){
		return;
	}
	if($('#maingrid').find('div.l-panel-topbar').length>0){
		var html=['<div style="float:right;margin-right:10px;">默认生效日期&nbsp;:&nbsp;'];
		html.push('<input type="text" class="textGrid textDate" style="width:100px;" id="deftEecutionTime">');
		html.push('</div>');
		$('#maingrid').find('div.l-panel-topbar').append(html.join(''));
		var deftEecutionTime=$('#deftEecutionTime').val(Public.formatDate(DateUtil.getLastMonthFirstDay()));
		deftEecutionTime.datepicker().mask('9999-99-99');
	}
}

function setWageTypeValue(){
	var kind=$('#mainWageKind').val();
	$.each(wageKindTypeData,function(i,o){
		var kindTypeList = i.split('|');
		if(kindTypeList.length < 2){
			Public.tip("工资类别数据错误！");
			return;
		}
		var value = kindTypeList[0];
		if(kind == value){
			$('#mainWageTypeKind').combox('setValue',i);
		}
	});
}
//初始化表格
function initializeGrid() {
	setWageTypeValue();
	var kind=$('#mainWageTypeKind').val();
	var kindTypeList = kind.split('|');
	kind = kindTypeList[1];
	var columns=[
			{ display: "序号", name: "myRownum", width: 30, minWidth: 30, type: "string", align: "center" ,frozen: true},
			{ display: "单位", name: "organName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true },		   		   	   	   
			{ display: "部门", name: "deptName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true },		      
			{ display: "岗位", name: "posName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true },		   		   
			{ display: "姓名", name: "archivesName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true},
			{ display: "薪酬变动类别", name: "wageChangeKind", width: 100, minWidth: 60, type: "string", align: "left",frozen: true,
				editor: { type:'combobox',data:wageChangeKindData},
				render: function (item) { 
					return wageChangeKindData[item.wageChangeKind];
				}
			}
	];
	var isNeedSpecialSalary=checkNeedSpecialSalary();//是否特殊变动
	var columnThis={display: '本次薪酬调整情况', columns:[]};
	switch (kind) {
	     /*case 1://年薪制
	     case 2://年收入预期制
	     case 5://年预期制(销售经理)
	     case 8://年预期制(销支经理)
	     case 10://年预期制(物业经理)
	     case 11://提成制(奖金包)
	     case 12://年预期制(市场拓展)
*/	     case 'year':
	      	 var columnOld={display: '调整前标准', columns:[]};
	      	 columnOld.columns.push({ display: "薪酬类别", name: "oldWageKind", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return wageKindDate[item.oldWageKind];
				}
			 });
	    	 columnOld.columns.push({ display: "年薪酬标准", name: "oldWageStandard", width: 80, minWidth: 60, type: "money", align: "right"});
	    	 columnOld.columns.push({ display: "月标准工资", name: "oldWagMonth", width: 70, minWidth: 60, type: "money", align: "right"});
	    	 
	    	 if(isNeedSpecialSalary){
	    	 	columnOld.columns.push({display: "特殊年薪", name: "oldSpecialSalary", width: 80, minWidth: 60, type: "money", align: "right"});
	    	 	columnOld.columns.push({display: "合计年薪", name: "oldTotalSalary", width: 110, minWidth: 60, type: "money", align: "right"});
	    	 }
	    	 
	    	 var columnChange={display: '变动情况', columns:[]};
	    	 columnChange.columns.push({display: "变动金额", name: "changeWage", width: 90, minWidth: 60, type: "money", align: "right"});
	    	 columnChange.columns.push({display: "调整幅度(%)", name: "adjustmentRange", width: 50, minWidth: 60, type: "string", align: "right",
	    		 render: function (item){
	    		 	if(Public.isBlank(item.adjustmentRange)) return'';
	    		 	return item.adjustmentRange+'%';
				 }
	    	 });
	    	
	    	 var columnNew={display: '调整后标准', columns:[]};
	    	 columnNew.columns.push({ display: "薪酬类别", name: "newWageKind", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return wageKindDate[item.newWageKind];
				}
			 });
	    	 columnNew.columns.push({display: "年薪酬标准", name: "newWageStandard", width: 80, minWidth: 60, type: "money", align: "right",
	    		 editor: { type:'text',required: true,mask:'money'}
	    	 });
	    	 columnNew.columns.push({ display: "月标准工资", name: "newWagMonth", width: 70, minWidth: 60, type: "money", align: "right"});
	    	 if(isNeedSpecialSalary){
	    	 	columnNew.columns.push({display: "特殊年薪", name: "newSpecialSalary", width: 110, minWidth: 60, type: "money", align: "right",
	    	 		editor: { type:'text',required: true,mask:'money'}
	    	 	});
	    	 	columnNew.columns.push({display: "合计年薪", name: "newTotalSalary", width: 110, minWidth: 60, type: "money", align: "right"});
	    	 }
	    	 
	    	 columnThis.columns.push(columnOld);
	    	 columnThis.columns.push(columnChange);
	    	 columnThis.columns.push(columnNew);
	         break;
	     /*case 3://月薪制
	     case 4://提成制
	     case 7://其他
	     case 9://销支
	     case 13:*/
	     case 'month':
	    	 var columnOld={display: '调整前标准', columns:[]};
	    	 columnOld.columns.push({ display: "薪酬类别", name: "oldWageKind", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return wageKindDate[item.oldWageKind];
				}
			 });
	     	 columnOld.columns.push({ display: "年薪酬标准", name: "oldWageStandard", width: 80, minWidth: 60, type: "money", align: "right",editor: { type:'text',required: true,mask:'money'}});
	    	 columnOld.columns.push({ display: "月标准工资", name: "oldWagMonth", width: 70, minWidth: 60, type: "money", align: "right"});
	    	 var columnChange={display: '变动情况', columns:[]};
		     columnChange.columns.push({display: "变动金额", name: "changeWage", width: 80, minWidth: 60, type: "money", align: "right"});
		     columnChange.columns.push({display: "调整幅度(%)", name: "adjustmentRange", width: 50, minWidth: 60, type: "string", align: "right",
		    	 render: function (item){
	    		 	if(Public.isBlank(item.adjustmentRange)) return'';
	    		 	return item.adjustmentRange+'%';
				 }
		     });
		     var columnNew={display: '调整后标准', columns:[]};
		     columnNew.columns.push({ display: "薪酬类别", name: "newWageKind", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return wageKindDate[item.newWageKind];
				}
			 });
		     columnNew.columns.push({display: "年薪酬标准", name: "newWageStandard", width: 80, minWidth: 60, type: "money", align: "right",editor: { type:'text',required: true,mask:'money'}});
		     columnNew.columns.push({display: "月标准工资", name: "newWagMonth", width: 70, minWidth: 60, type: "money", align: "right",
		    	 editor: { type:'text',required: true,mask:'money'}
		     });
		     columnThis.columns.push(columnOld);
	    	 columnThis.columns.push(columnChange);
	    	 columnThis.columns.push(columnNew);
	         break;
	     /*case 5://年预期制(营销)
	    	 var columnOld={display: '调整前标准', columns:[]};
	    	 columnOld.columns.push({ display: "保障薪酬", name: "oldWageStandard", width: 100, minWidth: 60, type: "money", align: "right"});
	    	 columnOld.columns.push({ display: "季度绩效奖金", name: "oldQuarterlyPerformance", width: 100, minWidth: 60, type: "money", align: "right"});
	    	 columnOld.columns.push({ display: "年终绩效奖金", name: "oldPerformanceRelatedPay", width: 100, minWidth: 60, type: "money", align: "right"});
	    	 columnOld.columns.push({ display: "总额", name: "oldAll", width: 100, minWidth: 60, type: "money", align: "right",
	    		 render: function (item){
	    		 	return Public.currency(addCompute(item.oldWageStandard,item.oldQuarterlyPerformance,item.oldPerformanceRelatedPay));
				 }
	    	 });
	    	 var columnChange={display: '变动情况', columns:[]};
	    	 columnChange.columns.push({display: "变动金额", name: "changeWage", width: 100, minWidth: 60, type: "money", align: "right"});
	    	 columnChange.columns.push({display: "调整幅度(%)", name: "adjustmentRange", width: 100, minWidth: 60, type: "string", align: "right",
	    		 render: function (item){
	    		 	if(Public.isBlank(item.adjustmentRange)) return'';
	    		 	return item.adjustmentRange+'%';
				 }
	    	 });
	    	 var columnNew={display: '调整后标准', columns:[]};
	    	 columnNew.columns.push({display: "保障薪酬", name: "newWageStandard", width: 120, minWidth: 60, type: "money", align: "right",
	    		 editor: { type:'text',required: true,mask:'money'}
	    	 });
	    	 columnNew.columns.push({ display: "季度绩效奖金", name: "newQuarterlyPerformance", width: 120, minWidth: 60, type: "money", align: "right",
	    		 editor: { type:'text',required: true,mask:'money'}
	    	 });
	    	 columnNew.columns.push({ display: "年终绩效奖金", name: "newPerformanceRelatedPay", width: 120, minWidth: 60, type: "money", align: "right",
	    		 editor: { type:'text',required: true,mask:'money'}
	    	 });
	    	 columnNew.columns.push({ display: "总额", name: "newAll", width: 100, minWidth: 60, type: "money", align: "right",
	    		 render: function (item){
	    		 	return Public.currency(addCompute(item.newWageStandard,item.newQuarterlyPerformance,item.newPerformanceRelatedPay));
				 }
	    	 });
	    	 columnThis.columns.push(columnOld);
	    	 columnThis.columns.push(columnChange);
	    	 columnThis.columns.push(columnNew);
	         break;*/
	     /*case 6://年预期制(招标)
*/	     case 'zyear':
	    	 var columnOld={display: '调整前标准', columns:[]};
	    	  columnOld.columns.push({ display: "薪酬类别", name: "oldWageKind", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return wageKindDate[item.oldWageKind];
				}
			 });
	    	 columnOld.columns.push({ display: "年薪酬标准", name: "oldWageStandard", width: 80, minWidth: 60, type: "money", align: "right"});
	    	 columnOld.columns.push({ display: "月标准工资", name: "oldWagMonth", width: 70, minWidth: 60, type: "money", align: "right"});
	    	 columnOld.columns.push({ display: "全年季度绩效薪酬", name: "oldSpecialPerformance", width: 70, minWidth: 60, type: "money", align: "right"});
	    	 columnOld.columns.push({ display: "总额", name: "oldAll", width: 80, minWidth: 60, type: "money", align: "right",
	    		 render: function (item){
	    		 	return Public.currency(addCompute(item.oldWageStandard,item.oldSpecialPerformance));
				 }
	    	 });
	    	 var columnChange={display: '变动情况', columns:[]};
	    	 columnChange.columns.push({display: "变动金额", name: "changeWage", width: 80, minWidth: 60, type: "money", align: "right"});
	    	 columnChange.columns.push({display: "调整幅度(%)", name: "adjustmentRange", width: 50, minWidth: 60, type: "string", align: "right",
	    		 render: function (item){
	    		 	if(Public.isBlank(item.adjustmentRange)) return'';
	    		 	return item.adjustmentRange+'%';
				 }
	    	 });
	    	 var columnNew={display: '调整后标准', columns:[]};
	    	  columnNew.columns.push({ display: "薪酬类别", name: "newWageKind", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return wageKindDate[item.newWageKind];
				}
			 });
	    	 columnNew.columns.push({display: "年薪酬标准", name: "newWageStandard", width: 80, minWidth: 60, type: "money", align: "right",
	    		 editor: { type:'text',required: true,mask:'money'}
	    	 });
	    	 columnNew.columns.push({ display: "月标准工资", name: "newWagMonth", width: 70, minWidth: 60, type: "money", align: "right"});
	    	 columnNew.columns.push({ display: "全年季度绩效薪酬", name: "newSpecialPerformance", width: 70, minWidth: 60, type: "money", align: "right",
	    		 editor: { type:'text',required: true,mask:'money'}
	    	 });
	    	 columnNew.columns.push({ display: "总额", name: "newAll", width: 80, minWidth: 60, type: "money", align: "right",
	    		 render: function (item){
	    		 	return Public.currency(addCompute(item.newWageStandard,item.newSpecialPerformance));
				 }
	    	 });
	    	 columnThis.columns.push(columnOld);
	    	 columnThis.columns.push(columnChange);
	    	 columnThis.columns.push(columnNew);
	         break;
	} 
	columnThis.columns.push({ display: "调薪事由", name: "cause", width: 250, minWidth: 60, type: "string", align: "left",
		editor: { type:'text',maxLength:200}
	});		   
	columnThis.columns.push({ display: "生效日期", name: "executionTime", width: 100, minWidth: 60, type: "string", align: "left",
		editor: { type:'date',required: true}
	});
	columns.push(columnThis);
	columns.push({ display: "最近绩效考核等级", name: "examineGrade", width:60, minWidth: 60, type: "string", align: "left",
		editor: { type:'combobox',data:examineGrade},
		 render: function (item){
	    		 	return examineGrade[item.examineGrade];
		 }
	});
	columns.push({ display: '近期薪酬调整情况', columns:[
	               { display: "年度内已调薪次数", name: "changeCount", width: 60, minWidth: 60, type: "string", align: "left",editor: { type:'text',mask:'nn'} },		   
	               { display: "薪酬调整时间", name: "lastChangeTime", width:100, minWidth: 60, type: "date", align: "left",editor: { type:'date'}},		   
	               { display: "薪酬调整金额", name: "lastChangeNumber", width:100, minWidth: 60, type: "money", align: "left",editor: { type:'text',mask:'money'} }
    ]});
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addBatchHandler: function(){}, 
		/*addHandler: function(){
			UICtrl.addGridRow(gridManager,{executionTime:$('#deftEecutionTime').val(),newWageKind:$('#mainWageKind').val()});
		},*/
		deleteHandler: deleteHandler,
		showPassword:{id:'showPassword',text:'密码',img:'page_key.gif',click:function(){
			doPersonalPasswordAuth(false);
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/hRPayChangeAction!slicedQueryPayChangeDetail.ajax',
		parms:{auditId:$('#auditId').val()},
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRowByKeydown:false,
		autoAddRow:{organId:'',auditId:'',deptId:'',posId:'',centreId:'',fullId:'',newWageKind:$('#mainWageKind').val()},
		onLoadData :function(){
			var flag=PersonalPasswordAuth.isAuthenticationPassword;
			if(flag){
				return !($('#auditId').val()=='');
			}else{
				return false;
			}
		},
		onAfterEdit:onAfterEdit
	});
	initializeUI();
}


//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	gridManager.options.parms['auditId'] =value;
	$('#payChangeFileList').fileList({bizId:value});
}
function afterSave(){
	reloadGrid();
}
/*//保存
function save() {
	var detailData =getExtendedData();
	if(detailData===false){
		return;
	}
	$('#submitForm').ajaxSubmit({
		url : web_app.name + '/hRPayChangeAction!savePayChangeAudit.ajax',
		param : $.extend({}, detailData),
		success : function(data) {
			if (!getId())
				setId(data);
			afterSave();
		}
	});
}*/
function checkConstraints(){
	if (gridManager.getData().length == 0){
		Public.tip("没有选择员工信息，不能提交！");
		return false;
	}
	return true;
}
function deleteHandler(){
	DataUtil.delSelectedRows({action:'hRPayChangeAction!deletePayChangeDetail.ajax',
		gridManager: gridManager,idFieldName:'detailId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}
function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}
//编辑行后执行
function onAfterEdit(e){
	setWageTypeValue();
	var kind=$('#mainWageTypeKind').val();
	var kindTypeList = kind.split('|');
	kind = kindTypeList[1];
	switch (kind) {
    	/*case 1://年薪制
    	case 2://年收入预期制
    	case 8://年预期制(销支经理)
    	case 5://年预期制(销售经理)
    	case 10://年预期制(物业经理)
    	case 11://提成制(奖金包)
    	case 12://年预期制(市场拓展)
*/    	case 'year': 
    		var isNeedSpecialSalary=checkNeedSpecialSalary();//是否特殊变动
    		var  row=e.record;
    		if(isNeedSpecialSalary){
    			if (e.column.name == "newWageStandard"||e.column.name == "newSpecialSalary"){
    				var m1=addCompute(row.oldWageStandard,row.oldSpecialSalary);
    				var m2=addCompute(row.newWageStandard,row.newSpecialSalary);
    				gridManager.updateCell('changeWage', minusCompute(m1,m2), e.record); 
    				gridManager.updateCell('adjustmentRange', rangeCompute(m1,m2), e.record);
    		   	    gridManager.updateCell('newTotalSalary',m2,e.record);
    			}
    		}else{
	    		if (e.column.name == "newWageStandard"){
	    			var m1=row['oldWageStandard'];
	    			if(row.oldWageKind==6){
	    				m1=addCompute(row.oldWageStandard,row.oldSpecialPerformance);
	    			}
	    			gridManager.updateCell('changeWage', minusCompute(m1,e.value), e.record); 
	    			gridManager.updateCell('adjustmentRange', rangeCompute(m1,e.value), e.record);
	            }
    		}
    		break;
    	/*case 3://月薪制
    	case 4://提成制
    	case 7://其他
    	case 9://销支
    	case 13:*/
    	case 'month':
    		if (e.column.name == "newWagMonth"){
    			var  row=e.record;
    			gridManager.updateCell('changeWage', minusCompute(row['oldWagMonth'],e.value), e.record); 
    			gridManager.updateCell('adjustmentRange', rangeCompute(row['oldWagMonth'],e.value), e.record);
            }
    		break;
    	/*case 5://年预期制(销售经理)
    		if (e.column.name == "newWageStandard"||e.column.name == "newQuarterlyPerformance"||e.column.name == "newPerformanceRelatedPay"){
    			var  row=e.record;
    			var m1=addCompute(row.oldWageStandard,row.oldQuarterlyPerformance,row.oldPerformanceRelatedPay);
    			var m2=addCompute(row.newWageStandard,row.newQuarterlyPerformance,row.newPerformanceRelatedPay);
    			gridManager.updateCell('changeWage', minusCompute(m1,m2), e.record); 
    			gridManager.updateCell('adjustmentRange', rangeCompute(m1,m2), e.record);
    		    gridManager.updateCell('newAll',m2,e.record);
            }
    		break;*/
    	/*case 6://年预期制(招标)
*/    	case 'zyear':
    		if (e.column.name == "newWageStandard"||e.column.name == "newSpecialPerformance"){
    			var  row=e.record;
    			var m1=addCompute(row.oldWageStandard,row.oldSpecialPerformance);
    			var m2=addCompute(row.newWageStandard,row.newSpecialPerformance);
    			gridManager.updateCell('changeWage', minusCompute(m1,m2), e.record); 
    			gridManager.updateCell('adjustmentRange', rangeCompute(m1,m2), e.record);
    		    gridManager.updateCell('newAll',m2,e.record);
            }
    		break;
	}
}
function addCompute(m1,m2,m3){
	m1=parseFloat(toNumber(m1),10);
	m2=parseFloat(toNumber(m2),10);
	m3=parseFloat(toNumber(m3),10);
	m1=isNaN(m1)?0:m1;
	m2=isNaN(m2)?0:m2;
	m3=isNaN(m3)?0:m3;
	return m1+m2+m3;
}
function minusCompute(min,max){
	var m1=parseFloat(toNumber(min),10);
	var m2=parseFloat(toNumber(max),10);
	m1=isNaN(m1)?0:m1;
	m2=isNaN(m2)?0:m2;
	return m2-m1;
}
function rangeCompute(min,max){
	var m1=parseFloat(toNumber(min),10);
	var m2=parseFloat(toNumber(max),10);
	m1=isNaN(m1)?0:m1;
	m2=isNaN(m2)?0:m2;
	if(m1==0){
		return 100;
	}
	var p=(m2-m1)/m1*100;
	return p.toFixed(2);
}
function toNumber(val){
	if(Public.isBlank(val)){
    	return '';
    }
    if(typeof val=='string'){
    	val=val.replace(/[,]/g, '');
    }
    return val;
}
/*
 * 覆盖job.js中方法 在抄送任务提交后给员工发起薪酬变动通知
 * */
function doCompleteTask(){
	/*Public.ajax(web_app.name + '/hRPayChangeAction!completeCopyForTask.ajax', 
			{ taskId : taskId,auditId:getId()},
			function(data) {
				UICtrl.closeAndReloadTabs("TaskCenter", null);
			}
	);*/
}