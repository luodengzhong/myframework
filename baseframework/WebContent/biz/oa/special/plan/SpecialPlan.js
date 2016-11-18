
var gridManager = null, refreshFlag = false;
var specialPlanId;
var templateArr = [];
var status;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initView();//显示与隐藏日历视图
	initParam();
	bindEvent();
	initOwnerSel();//初始化选责任人下拉选择框
	initTemplateDiv();//初始化模板选择div
	editDisplayFunction();//退回发起人后，编辑回显之前选择的功能
	ajustYearViewPosition();//调整年视图的位置处于横向的中间
});

function ajustYearViewPosition(){
	var maxLeft,maxTop,de = document.documentElement;
	maxLeft = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var move = maxLeft/10;
	//设置日历表居中
	$("#yearCalendarMain").css("margin-left",move);
	//设置当前年居中
	$("#curYearDiv").css("position","absolute").css("left",maxLeft/2-20);
	//设置年视图的旬复选框在右边的位置
	$("#yearMonthPart").css("position","relative").css("right",move);
}


function editDisplayFunction(){
	/*
	 * 1 退回的计划，打开时回显之前的功能和管理权限
	 * 2 已审核通过的计划 (status == 3)
	 */
	 
	if(status == 0 && specialPlanId != "" || status == 3){
		Public.ajax(web_app.name + '/specialPlanAction!queryFuncAndAuthByPlanId.load',
        {specialPlanId:specialPlanId},
        function (data) {
			if(data.length > 0){
				var disHtml = "";
				for(var i=0;i<data.length;i++){
					disHtml += data[i].functionName+"(管理权限："+data[i].authorityName+")";
					$("#functionShowDiv").html(disHtml);
					setFuncAndAuth(data[i].functionId,data[i].functionName,data[i].authorityCode,data[i].authorityName);
				}
			}
        }
		);
	}
}

function initTemplateDiv(){
	var functionId=$('#functionId').val();
	//当新增计划 (不是回退)
	if(status !=1 && functionId=='' && specialPlanId == ''){//新增时确定调用哪个专项计划模板
		Public.ajax(web_app.name + '/planTemplateAction!selPlanTemplatesByUserId.load',
        {},
        function (data) {
			templateArr = data;
        	chooseLandCategory();
        });
	}
}

function initView(){
	$("#calendar").show();
	$("#yearCalendarMain").hide();

	//年月视图切换事件绑定
	$("input[name='planview']").on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.val() == 'year'){
			$("#calendar").hide();
			$("#yearCalendarMain").show();
		}else{
			$("#calendar").show();
			$("#yearCalendarMain").hide();
		}
	});
}

function initParam(){
	//流程的状态
	status = $("#status").val();
	specialPlanId = $("#specialPlanId").val();

	//流程为审批状态时，不显示执行人复选框
	if(status != 0){
		$(".calReceiverClass").hide();
	}
}

function chooseLandCategory(){

	var html=[''];
	$.each(templateArr,function(i,o){
		html.push('<div style="text-align:left;margin:5px;" id="chooseLandCategoryDiv">');
		html.push('<label><input type="radio" name="radioTest" value="',i,'"',i==0?' checked="true"':'','/>&nbsp;',o.templateName,'</label>');
		html.push('</div>');
	});
	if(templateArr.length == 0){
		html.push('<div style="text-align:left;margin:5px;">');
		html.push('<span>请先创建专项计划模板数据!</span>');
		html.push('</div>');
	}

	var options={
		title:'选择专项计划模板',
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
			if(templateArr.length > 0){
				var kind=$('#chooseLandCategoryDiv').find('input').getValue();
				$('#landCategoryId').combox('setValue',kind);
				var template = templateArr[kind];
				var disHtml = template.functionName+"(管理权限："+template.authorityName+")";
				$("#functionShowDiv").html(disHtml);
				setFuncAndAuth(template.functionId,template.functionName,template.authorityCode,template.authorityName);
			}
		}
	};
	var div=Public.dialog(options);
	if(templateArr.length == 0){
		div.find('a.close').hide();
	}
}

function setFuncAndAuth(functionId,functionName,authorityCode,authorityName){
	$("#functionId").val(functionId);
	$("#functionName").val(functionName);
	$("#authorityCode").val(authorityCode);
	$("#authorityName").val(authorityName);
}


function bindEvent(){
	//标题编辑事件
	if(status == 0){
		$('#editSubject').on('click',function(e){
			var $clicked = $(e.target || e.srcElement);
			if($clicked.is('input')){
				return false;
			}
			var style="width:300px;height:25px;font-size:16px;border: 0px;border-bottom: 2px solid #d6d6d6;";
			var subject=$(this).text(),html=[];
			html.push('<input type="text" style="',style,'" value="',subject,'" maxlength="100" id="editSubjectInput">');
			$(this).html(html.join(''));
			setTimeout(function(){
				$('#editSubject').find('input').val($.trim(subject));
				$('#editSubject').find('input').focus();
			},0);
		});
	}
	
	$('#editSubject').on('focus','input',function(){
		var text=$(this).val();
		if(text=='重大技术方案报审表'){
			$(this).val('');
		}
	}).on('blur','input',function(){
		var text=$(this).val();
		if(text==''){
			text='专项计划报审表';
		}
		$('#title').val($(this).val());
		$('#editSubject').html(text);
	});	

	
}


var receiverArray=new Array();//接收执行计划人

//打开机构选择对话框
function showChooseOrgDialog(personKind){
	var personArray=window[personKind+'Array'];
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='dpt,pos,psm';
	var options = { params: selectOrgParams,title : "选择组织",
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
				o['kindId']=o['orgKindId'];
				personArray.push(o);
			});
			initShowDivText(personKind);
			this.close();
		},
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				$.each(personArray,function(i,d){
					addFn.call(window,d);
				});
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
	var html= "";
	$.each(personArray,function(i,o){
		html += '<span title="'+o['fullName']+'">';
		html += o['name'];
		html += '</span>&nbsp;';
		html += '<input type=checkbox orgId="'+o['orgUnitId']+'" orgName="'+o['orgUnitName']+'" orgType="'+o['orgKindId']+'" fullId="'+o['fullId']+'"/>';		
	});
	showDiv.html(html);
}

function initOwnerSel(){
	$("#ownerName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{id:"#ownerId",personMemberName:"#ownerName"}
	});
	var $dep = $("#dutyDeptName");
	$dep.orgTree({filter:'dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		//manageType:'hrArchivesManage',
		back:{
			text:$dep,
			value:'#dutyDeptId',
			id:'#dutyDeptId',
			name:$dep
		}
	});

	$org = $("#beManageredName");
	$org.orgTree({param:{},
		back:{
			text:$org,
			value:'#beManageredId',
			id:'#beManageredId',
			name:$org
		}
	});
}


//清空已选择列表
function clearChooseArray(personKind){
	var personArray=window[personKind+'Array'];
	$('#'+personKind+'ShowDiv').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}

function getViewValue(){
	var viewValue = "month";
	var views = $("input[name='planview']")	
	$.each(views,function(i,view){
		if($(view).attr("checked")){
			viewValue = $(view).val();
		}
	});
	return viewValue;
}

function validateViewIsNull(viewValue){
	if(viewValue == "month" && planDatas.length == 0){
		Public.tip('请在日历月视图中添加事项!');
		return true;
	}
	if(viewValue == "year" && planYearDatas.length == 0){
		Public.tip('请在日历年视图中添加事项!');
		return true;
	}
	return false;
}

function getExtendedData(){
	var subject = $("#title").val();
	if(subject ==""){
		subject = "专项计划报审表";
	}
	$("#title").val(subject);
	if(status == 0){
		//这里先判断 表单必填项，统一了保存和提交
		var formCheckBack = $('#submitForm').formToJSON();
	    if (formCheckBack === false) {
	        return false;
	    }
		
		if(planDatas.length<1 && planYearDatas.length<1){
			Public.tip('请在日历视图中添加事项!');
			return false;
		}else{
			var viewValue = getViewValue();
			if(validateViewIsNull(viewValue)){
				return false;
			}
			if(planDatas.length>0){
				$("#calDatas").val($.toJSON(planDatas));
			}
			if(planYearDatas.length>0){
				$("#calYearDatas").val($.toJSON(planYearDatas));
			}
			
			
		}
	}	
	return true;
}

/**
 * 获得基础管理编码和名称，以及日历视图中是否指定了执行人
 */
function getAuth(viewValue){
	var auth = {};
	auth.isSetExecutor = false;
	if(viewValue == "month"){
		for(var i=0;i<planDatas.length;i++){
			if(i==0){
				auth.authorityCode = planDatas[i].planFunction.authorityCode;
				auth.authorityName = planDatas[i].planFunction.authorityName;
			}
			var orgs = planDatas[i].planOrgs;
			if(orgs.length > 0){
				auth.isSetExecutor = true;
				break;
			}
		}
	}
	if(viewValue == "year"){
		for(var i=0;i<planYearDatas.length;i++){
			if(i==0){
				auth.authorityCode = planYearDatas[i].planFunction.authorityCode;
				auth.authorityName = planYearDatas[i].planFunction.authorityName;
			}
			var orgs = planYearDatas[i].planOrgs;
			if(orgs.length > 0){
				auth.isSetExecutor = true;
				break;
			}
		}
	}
	return auth;
}

/**
 * 在job.js定义的统一流程是：
 * 保存：会先执行getExtendedData方法，在判断表单必填项
 * 提交：先判断表单必填项，再执行getExtendedData方法
 * 该checkConstraints方法在job.js只有提交才调用，保存没有调用的
 * 
 */
function checkConstraints() {
	var viewValue = getViewValue();
	if(validateViewIsNull(viewValue)){
		return false;
	}
	var formCheckBack = $('#submitForm').formToJSON();
    if (formCheckBack === false) {
        return false;
    }
    
	/**
	 * 发起专项计划提交时，如果没有指定执行人，那么在提交时
	 * 需要通过ajax的方式去 查询被管理组织 在指定管理权限下 是否配置了管理者
	 */
	var auth = getAuth(viewValue);
	//判断是否指定了具体执行人
	var isSetExecutor = auth.isSetExecutor;
	var authorityCode = auth.authorityCode;//管理权限编码
	var authorityName = auth.authorityName;//管理权限名称
	var beManageredId = $("#beManageredId").val();//被管理组织id
	
	//当没有指定 执行人时
	//如果是点的保存，beManageredId可能没有填值
	var canSent = true;
	if(beManageredId && !isSetExecutor){
		//同步ajax调用
		Public.syncAjax(web_app.name + '/specialPlanAction!findOrgByFunctionIdAndAuthorityCode.load',
	        {beManageredId:beManageredId,authorityCode:authorityCode},
	        function (data) {
				if(data == "hasNoExecutor"){
					var beManageredName = $("#beManageredName").val();//被管理组织名称
					var alertMsg = "被管理组织("+beManageredName+")，在基础管理权限("+authorityName+")下面没有进行授权，本计划将没有执行人，还确定提交?";
					if(!confirm(alertMsg)){
						canSent = false;
					}
				}
	        });
	}
	return canSent;
}

function setId(value){
	$("#specialPlanId").val(value);
}

function getId(){
	return $("#specialPlanId").val();
}



