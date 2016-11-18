var copyForArray=new Array();//接收人
var handlerArray=new Array();//处理人
var askReportBuildTaskGrid=null;//计划
var taskKindData={};//计划种类
var taskLevelData={};
var managerTypeData={};
$(document).ready(function() {
	queryAskReportHandler();
	taskKindData = $("#taskKindId").combox("getJSONData");
	taskLevelData = $("#reportLevel").combox("getJSONData");
	managerTypeData = $("#managerType").combox('getJSONData');
	initializeUI();
	bindEvent();
	afterSave();
	askReportKindChange();
	hidePersonLink();
	enableAskReportBuildTask();
	initAskReportBuildTask();
});
function getId() {
	return $("#askReportId").val() || 0;
}
//判断是否是自由流程
function isFreeFlow(){
	var isFreeFlow=$('#isFreeFlow').val();
	return parseInt(isFreeFlow,10)==1;
}
//job js 中判断处理
function allowTransfer() {
	if(isFreeFlow()){
		return true;
	}else{
		return $("#currentHandleAllowTransfer").val() == "1";
	}
}
//job js 中判断处理 加减签
function allowAdd() {
	if(isFreeFlow()){
		return true;
	}else{
		return $("#currentHandleAllowTransfer").val() == "1";
	}
}
function setId(value){
	$("#askReportId").val(value);
	$('#askReportIdAttachment').fileList({bizId:value});
	$('#askReportTextBody').fileList({bizId:value});
	if(askReportBuildTaskGrid!=null){
		askReportBuildTaskGrid.options.parms['askReportId'] =value;
	}
}
function afterSave(){
	var askReportKindId=$('#askReportKindId').val();
	if(askReportKindId!=''){//编辑时已存在类别 则类别不能编辑
		UICtrl.disable('#askKindName');
	}
	var subject=$('#subject').val();
	if(subject!=''){
		$('#editSubject').siblings('b').hide();
	}
	if(askReportBuildTaskGrid!=null){
		askReportBuildTaskGrid.loadData();
	}
}
/**
* 检查约束
* 
*/
function checkConstraints() {
	var subject=$('#subject').val();
	if(subject==''){
		Public.tip('请输入标题!');
		return false;
	}
	var flag=$('#dispatchNo').checkDispatchNo();
	if(!flag){
		Public.tips({type:1,content:'发起流程前,请先获取文件编号!',time:4000});
		return false;
	}
	if(UICtrl.isApplyProcUnit()){
		if(isFreeFlow()){//自由流程需要选择处理人
			var handlerLength=handlerArray.length;
			if(handlerLength==0){
				Public.tip('请选择处理人!');
				return false;
			}
		}
	}
    return true;
}

/**
 * 是否查询预览处理人
 * 系统默认为true
 */
function isQueryHandlers(){
	if(isFreeFlow()){
		return false;
	}
	return true;
}
function initializeUI(){
	var isReadonlyContent=$('#isReadonlyContent').val();
	$('#askReportIdAttachment').fileList();//普通附件
	if(isReadonlyContent=='true'){
		$('#AskReportTextBodyTable').hide();
		var isBodyEdit=false;
		if(isApproveProcUnit()){//处理环节才允许修改附件
			isBodyEdit=$('#isBodyEdit1').is(':checked');
		}
		var isBodyDown=$('#isBodyDown1').is(':checked');
		$('#askReportTextBody').filePreview({appendTo:$('#showTextBody'),isReadOnly:!isBodyDown,canEdit:isBodyEdit});//预览模式
	}else{
		$('#askReportTextBody').fileList();//正文附件
	}
	if(!Public.isReadOnly){
	 	setTimeout(function(){$('#askReportIdAttachment').fileList('enable');},0);
	}
    function checkNode(rows){
    	var obj=[];
    	$.each(rows,function(i,o){
    		var n=o.hasChildren,t=o.nodeType;
    		if(t=='f'){
    			if(n>0){
    				o['children']=checkNode(o['children']);
    				obj.push(o);
    			}
    		}else{
    			obj.push(o);
    		}
    	});
    	return obj;
    }
	$('#askKindName').treebox({
		width:200,
		name:'askReportKind',
		treeLeafOnly:true,
		showToolbar:false,
		tree:{
			dataRender:function(data){
				var rows=data['Rows'];
				var objs=checkNode(rows);
				this.options.delay=true;
				return objs;
			}
		},
		changeNodeIcon:function(node){
			var nodeType=node.nodeType;
			var url=web_app.name + "/themes/default/images/org/";
			url +=nodeType=='f'?'roleType.gif':'dataRole.gif';
			node['nodeIcon']=url;
		},
		beforeChange:function(node){
			var nodeType=node.nodeType;
			if(nodeType=='f'){
				return false;
			}
			var askReportKindId=$('#askReportKindId').val();
			if(askReportKindId!=node.id){
				$('#askKindName').val(node.name);
				$('#askReportKindId').val(node.id);
				var reportLevel = node.reportLevel;
				if(reportLevel){
					$('#reportLevel').val(reportLevel);
					$('#reportLevel').combox('setText',taskLevelData[reportLevel]);
				}
				else{
					$('#reportLevel').val('');
					$('#reportLevel').combox('setText','');
				}
				$('#extendedFieldCode').val(node.extendedFieldCode);
				$('#askKindCode').val(node.code);
				$('#isNeedDispatchNo').val(node.isNeedDispatchNo);
				$('#isNeedAttachment').val(node.isNeedAttachment);
				$('#isBuildTask').val(node.isBuildTask);
				$('#isFreeFlow').val(node.isFreeFlow);
				var defaultTitle=node.defaultTitle;
				if(!Public.isBlank(defaultTitle)){//存在默认标题
					$('#subject').val(defaultTitle);
					$('#editSubject').html(defaultTitle);
				}
				askReportKindChange();//类别改变后执行
				initAskReportBuildTask();
			}
		}
	});
	$('#askContent').toAreaEdit({width:'99.9%'});
	if(getId()){
		var subject=$('#subject').val();
		if(subject==''){
			subject="请在此处录入标题";
		}
		$('#editSubject').html(subject);
	}
	$("#personInChargeName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : "org_kind_id ='psm'"};
		},
		back : {
			personMemberName : "#personInChargeName",
			personMemberId : "#personiInChargeId"
		}
	});
	//发文号获取控件初始化
	$('#dispatchNo').attr('notCheck',true).loadDispatchNo({
		getBizId:function(){
			return $('#askReportId').val();
		},
		title:function(){
			return $('#subject').val();
		},
		bizUrl:function(){
			return 'askReportAction!showUpdateAskReport.job?isReadOnly=true&bizId='+$('#askReportId').val();
		}
	});
}

function bindEvent(){
	if(!UICtrl.isApplyProcUnit()){
		return;
	}
	//标题编辑事件
	$('#editSubject').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('input')){
			return false;
		}
		var style="width:300px;height:25px;font-size:16px;border: 0px;border-bottom: 2px solid #d6d6d6;";
		var subject=$.trim($(this).text()),html=[];
		html.push('<input type="text" style="',style,'" value="',subject,'" maxlength="100" id="editSubjectInput">');
		$(this).html(html.join(''));
		setTimeout(function(){
			$('#editSubject').find('input').focus();
		},0);
	});
	$('#editSubject').on('focus','input',function(){
		var text=$(this).val();
		if(text=='请在此处录入标题'){
			$(this).val('');
		}
	}).on('blur','input',function(){
		var text=$(this).val();
		if(text==''){
			text='请在此处录入标题';
		}
		$('#subject').val($(this).val());
		$('#editSubject').html(text);
	});
}
//类别改变
function askReportKindChange(){
	clearExtendedField();
	var extendedCode=$('#extendedFieldCode').val();
	if(extendedCode!=''){
		var $el=$('#extendedFieldDiv');
    	$el.extendedField({businessCode:extendedCode,bizId:getId(),onInit:function(){
    		$el.attr('businessCode',extendedCode);
    		if(Public.isReadOnly||!UICtrl.isApplyProcUnit()){
    			UICtrl.setReadOnly($el);
    		}
    		$el.css('width','99.9%');
    	}});
	}
	//判断是否是自由流
	if(isFreeFlow()){
		if(UICtrl.isApplyProcUnit()){//在申请环节显示处理人选择框
			$('#chooseHandlerTd').show();
			$('#chooseHandlerTd').find('span').show();
		}
	}else{
		$('#chooseHandlerTd').hide();
		$('#chooseHandlerTd').find('span').hide();
	}
}
function  clearExtendedField() {
   $('#extendedFieldDiv').empty().removeAttr('businessCode').removeData();
}

//获取扩展属性
function getExtendedData(){
	var param = {};
	if($('#extendedFieldDiv').html() != ''){
		param = $('#extendedFieldDiv').extendedField('getExtendedFieldValue');
		if(!param) return false;
	}
	if(UICtrl.isApplyProcUnit()){
		if(isFreeFlow()){//自由流程需要选择处理人
			var handlerLength=handlerArray.length;
			if(handlerLength==0){
				//将判断移动到提交判断中
				//Public.tip('请选择处理人!');
				//return false;
			}
		}
		var personsArray=new Array();
		personsArray.push.apply(personsArray,copyForArray);
		personsArray.push.apply(personsArray,handlerArray);
		param['detailData']=encodeURI($.toJSON(personsArray));
	}
	if(askReportBuildTaskGrid!=null){
		var askReportBuildTaskData=DataUtil.getGridData({gridManager:askReportBuildTaskGrid});
		if(!askReportBuildTaskData) return false;
		else {
			if(askReportBuildTaskData.length>0){
				var askReportBuildTask = $.toJSON(askReportBuildTaskData);
				if(!askReportBuildTask) return false;
				param['askReportBuildTaskData'] = askReportBuildTask;
			}
		}
	}
	return param;
}
//打印
function print() {
	var askReportId=$('#askReportId').val();
	if(askReportId==''){
		Public.tip('单据未保存, 不能打印!');
		return false;
	}
	//window.open(web_app.name + '/askReportAction!createPdf.load?askReportId='+askReportId);	
	
	var extendedFieldDivHtml=parseExtendedFieldHtmlToView('#extendedFieldDiv');
	//alert(extendedFieldDivHtml);return; 
	var url=web_app.name + '/askReportAction!createPdf.ajax';
	Public.ajax(url,{askReportId:askReportId,extendedFieldDivHtml:encodeURI(extendedFieldDivHtml)},function(data){
		var myWindow=window.open('')
		myWindow.document.write(data)
		myWindow.focus()
    });
}
/*******人员信息维护********/
//加载已存在的处理人信息
function queryAskReportHandler(){
	Public.ajax(web_app.name + '/askReportAction!queryAskReportHandler.ajax', {askReportId:getId()}, function(data){
		var kindId=null;
		$.each(data,function(i,d){
			kindId=d['kindId'];
			if($.isArray(window[kindId+'Array'])){
				window[kindId+'Array'].push(d);
			}
		});
		//处理人列表排序
		handlerArray.sort(handlerArraySort);
		initShowDivText('copyFor');
		initShowDivText('handler');
	});
}
function handlerArraySort(o1,o2){
	var g=o1['groupId']*100,q=o2['groupId']*100;
	var a=o1['sequence'],b=o2['sequence'];
	return (g+a)>(q+b)?1:-1
}
//打开机构选择对话框
function showChooseOrgDialog(personKind){
	var personArray=window[personKind+'Array'];
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='dpt,pos,psm';
	var options = { params: selectOrgParams,title : "请选择人员",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			//清空数组
			personArray.splice(0,personArray.length);
			$.each(data,function(i,o){
				o['orgUnitId']=o['id'];
				o['orgUnitName']=o['name'];
				o['kindId']=personKind;
				o['sequence']=(i+1);
				personArray.push(o);
			});
			initShowDivText(personKind);
			this.close();
		},
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				this.iframe.contentWindow.isInitializingData = true;
				$.each(personArray,function(i,d){
					addFn.call(window,d);
				});
				this.iframe.contentWindow.isInitializingData = false;
				//刷新列表
				var reloadGrid=this.iframe.contentWindow.reloadGrid;
				reloadGrid.call(window);
			}
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}
//初始化显示
function initShowDivText(personKind){
	var personArray=window[personKind+'Array'];
	var showDiv=$('#'+personKind+'ShowDiv');
	var html=new Array();
	if(personKind=='handler'){
		html.push(UICtrl.getProcessTemplateUsersHtml(personArray));
	}else{
		$.each(personArray,function(i,o){
			html.push('<span title="',o['fullName'],'">');
			html.push(o['orgUnitName']);
			html.push('</span">;&nbsp;');
		});
	}
	showDiv.html(html.join(''));
}
//清空已选择列表
function clearChooseArray(personKind){
	var personArray=window[personKind+'Array'];
	$('#'+personKind+'ShowDiv').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}
//隐藏人员选择链接
function hidePersonLink(){
	if(Public.isReadOnly||!UICtrl.isApplyProcUnit()){
		$.each(['copyFor','handler'],function(i,p){
			$('#'+p+'ChooseLink').hide();
			$('#'+p+'ClearLink').hide();
		});
		$('#chooseProcessTemplateLink').hide();
	}
}

function showChooseHandlerDialog(){
	var params = {};
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    params = $.extend({}, params, selectOrgParams);
    UICtrl.showFrameDialog({
        title: '处理人选择',
        width: 800,
        height: 380,
        url: web_app.name + '/workflowAction!showCounterSignDialog.do',
        param: params,
        init:function(){
        	var addFn=this.iframe.contentWindow.addData;
			if($.isFunction(addFn)){//初始化已选择列表
				this.iframe.contentWindow.isInitializingData = true;
				$.each(handlerArray,function(i,d){
					addFn.call(window,d);
				});
				this.iframe.contentWindow.isInitializingData = false;
			}
        },
        ok: function(){
        	var fn = this.iframe.contentWindow.getChooseGridData;
		    var params = fn();
		    if (!params) { return;}
		    //清空数组
			handlerArray.splice(0,handlerArray.length);
			$.each(params,function(i,o){
				o['orgUnitId']=o['handlerId'];
				o['orgUnitName']=o['handlerName'];
				o['id']=o['handlerId'];
				o['name']=o['handlerName'];
				o['kindId']='handler';
				handlerArray.push(o);
			});
			//处理人列表排序
			handlerArray.sort(handlerArraySort);
			initShowDivText('handler');
			this.close();
        },
        cancelVal: '关闭',
        cancel: true
    });
}

function initAskReportBuildTask(){
	var isBuildTask = $('#isBuildTask').val();
	if(isBuildTask=="1"){
		$('#bulidTaskDiv').show();
		if(askReportBuildTaskGrid==null){
			initAskReportBuildTaskGird();
		}
	}
	else{
		$('#bulidTaskDiv').hide();
	}
}

function initAskReportBuildTaskGird(){
	var toolbarAskReportBulidTaskOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			if(!getId()) {Public.tip('请先保存表单！'); return;}
            UICtrl.addGridRow(askReportBuildTaskGrid,
                { sequence: askReportBuildTaskGrid.getData().length + 1,askReportId:getId()});
		},
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'askReportAction!deleteAskReportBuildTask.ajax',
				gridManager:askReportBuildTaskGrid,idFieldName:'askReportBuildTaskId',
				onSuccess:function(){
					askReportBuildTaskGrid.loadData();
				}
			});
		}
	});
	askReportBuildTaskGrid = UICtrl.grid('#askReportBuildTaskGrid', {
		columns: [   
			{ display: "类别", name: "taskKindId", width: 120, minWidth: 80, type: "string", align: "left",
					editor: { type: 'combobox',data: taskKindData,required:true},
					render: function(item){
						return taskKindData[item.taskKindId];
					}
			},	
			{ display: "级别", name: "taskLevelKind", width: 120, minWidth: 80, type: "string", align: "left",
				editor: { type: 'combobox',data: taskLevelData,required:true},
				render: function(item){
					return taskLevelData[item.taskLevelKind];
				}
			},	
			{ display: "名称", name: "name", width: 200, minWidth: 100, type: "string", align: "left",
				editor: { type: 'text',required:true}},
			{ display: "责任人", name: "personMemberName", width: 100, minWidth: 120, type: "string", align: "left",
				editor: { type: 'select', required: true, data: { type:"sys", name: "orgSelect", 
					getParam: function(){
						return { a: 1, b: 1, searchQueryCondition: "org_kind_id ='psm'" };
				}, back:{id:"personMemberId", personMemberName: "personMemberName",
					deptId:"deptId",deptName:"deptName" }
			}}},
			{ display: "开始时间", name: "startTime", width: 100, minWidth: 130, type: "date", align: "left",
					editor: { type: 'date',required:true}},	
			{ display: "结束时间", name: "endTime", width: 100, minWidth: 130, type: "date", align: "left",
					editor: { type: 'date',required:true}},	
			{ display: "完成标志", name: "finishStandard", width: 130, minWidth: 120, type: "string", align: "left",
					editor: { type: 'text',required:false}},
			{ display: "序列号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left"	,
				editor: { type: 'spinner',mask:"nnn",required:true}
			},
			{ display: "描述", name: "description", width: 220, minWidth: 120, type: "string", align: "left",
				editor: { type: 'text',required:false}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/askReportAction!slicedQueryAskReportBuildTask.ajax',
		parms:{askReportId:getId(),pagesize:1000},
		width : "99.9%",
		height : 230,
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarAskReportBulidTaskOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox: true,
		enabledEdit: true,
		usePager: false,
		onLoadData :function(){
   			return (getId()!='');
   		}
	});
}

function enableAskReportBuildTask(){
	if (isApproveProcUnit()) {
		permissionAuthority['askReportBuildTaskGrid.addHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['askReportBuildTaskGrid.deleteHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['askReportBuildTaskGrid.taskKindId']={authority:'readwrite',type:'1'};
		permissionAuthority['askReportBuildTaskGrid.taskLevelKind']={authority:'readwrite',type:'1'};
		permissionAuthority['askReportBuildTaskGrid.name']={authority:'readwrite',type:'1'};
		permissionAuthority['askReportBuildTaskGrid.personMemberName']={authority:'readwrite',type:'1'};
		permissionAuthority['askReportBuildTaskGrid.startTime']={authority:'readwrite',type:'1'};
		permissionAuthority['askReportBuildTaskGrid.endTime']={authority:'readwrite',type:'1'};
		permissionAuthority['askReportBuildTaskGrid.finishStandard']={authority:'readwrite',type:'1'};
		permissionAuthority['askReportBuildTaskGrid.sequence']={authority:'readwrite',type:'1'};
		permissionAuthority['askReportBuildTaskGrid.description']={authority:'readwrite',type:'1'};
	}
}
//选择流程模板
function chooseProcessTemplate(){
	UICtrl.chooseProcessTemplate(function(datails,title){
		handlerArray.splice(0,handlerArray.length);
		$.each(datails,function(i,o){
			o['commonHandlerId']='';
			handlerArray.push(o);
		});
		var subject=$('#subject').val();
		if(subject==''){
			$('#subject').val(title);
			$('#editSubject').html(title);
		}
		//处理人列表排序
		handlerArray.sort(handlerArraySort);
		initShowDivText('handler');
		this.close();
	});
}
//保存流程模板
function saveProcessTemplate(){
	if(handlerArray.length==0){
		Public.tip('请选择处理人!');
		return false;
	}
	UICtrl.saveProcessTemplate(handlerArray);
}