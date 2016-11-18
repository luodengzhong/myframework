var homePageTab={
		'needTimingWaitingTasks':'计时待办任务',
		'notNeedTimingWaitingTasks':'不计时待办任务',
		'trackTasks':'跟踪事项',
		'notifications':'消息提醒',
		'taskPlanView':'我的任务计划',
		'infoPromulgates':'信息中心',
		'otherSystemTemplate':'其它系统待办',
		'otherSystemTemplate':'其它系统待办'
};
$(function(){
	initChooseHomePageTab(); 
	initEvent();
	var codeId=Public.getQueryStringByName("codeId");
	if(!Public.isBlank(codeId)){
		showRightPanel(codeId);
	}
});
function initEvent(){
	var input=$("#modifNewPassword");
	input.bind('blur',function(){
		pswStrength($(this).val());
	}).bind('keyup',function(){
		pswStrength($(this).val());
	});
}
//门户定义
function initChooseHomePageTab(){
	var el=$('#chooseHomePageTab');
	var isSelected=true,hide=null;
	$.each(homePageTab,function(p,v){
		hide=$.cookie(p+'_hide');//窗口是否隐藏
		if(hide&&hide=='hide'){
			isSelected=false;
		}
		el.append(['<option ','value="',p,'"',isSelected?'selected':'', '>',v,'</option>'].join(''));
	});
	el.multiselect2side({
		labelsx:"备选门户",
		labeldx:"登录打开的门户",
		selectedPosition:"right",
		moveOptions:false
	});
}
//保存门户设置
function saveHomePageTab(){
	//暂时保存到cookie
	$('#chooseHomePageTab').find('option').each(function(){
		var p=$(this).val();
		if($(this).is(':selected')){
			$.cookie(p+'_hide','show');
		}else{
			$.cookie(p+'_hide','hide');
		}
	});
	Public.successTip('保存成功!');
}

function showRightPanel(divId){
	var div=$('#'+divId);
	if(div.is(':visible')){
		return;
	}
	$('#RightBox').find('div.righrDiv').hide();
	div.show();
	if($.isFunction(window['init'+divId])){
		window['init'+divId].call(window);
	}
}
//初始化信息推送设置
/*function initsetMessageKind(){
	var div=$('#setMessageKind');
	var flag=div.attr('isInit');//是否已初始化
	if(flag=='1'){
		return;
	}
	var table=$('#messageKindTable'),html=[];
	Public.ajax(web_app.name + "/parameterAction!queryUserMessageKind.ajax",{},function(data){
		div.attr('isInit','1');//标记为已初始化
		$.each(data,function(i,o){
			html.push('<tr>');
			html.push('<td rowspan="2" class="title">',o['name'],'<input type="hidden" name="messageKindCode" value="',o['messageKindCode'],'"></td>');
			html.push('<td><input type="checkbox" value="1" id="',o['messageKindCode'],'_status" ',o['status']==1?'checked':'','/>&nbsp;是(事务消息发送到以下配置)</td>');
			html.push('</tr>','<tr>');
			html.push('<td><input type="text" class="text" id="',o['messageKindCode'],'_userParam" maxlength="100" value="',o['userParam'],'"></td>');
			html.push('</tr>');
		});
		table.append(html.join(''));
	});
}
//保存设置
function saveMessageKind(){
	var table=$('#messageKindTable');
	var datas=[];
	table.find('tr').each(function(){
		var messageKindCode=$(this).find('input[name="messageKindCode"]');
		if(messageKindCode.length>0){
			var code=messageKindCode.val();
			var status=$('#'+code+'_status').is(':checked')?'1':'0';
			var userParam=$('#'+code+'_userParam').val();
			datas.push({messageKindCode:code,status:status,userParam:userParam});
		}
	});
	Public.ajax(web_app.name + "/parameterAction!saveUserMessageKind.ajax",{detailData:encodeURI($.toJSON(datas))});
}*/
function saveUserInfo(){
	$('#updatePersonForm').ajaxSubmit({url : web_app.name + '/personOwnAction!saveUsercontrolInfo.ajax',
		success : function() {
		}
	});
}

function updateErpUserStatus(){
	Public.ajax(web_app.name + "/personOwnAction!updateErpUserStatus.ajax",{},function(data){});
}
//测试某个字符是属于哪一类. 
function charMode(iN) {
  if (iN >= 48 && iN <= 57) //数字 
  return 1;
  if (iN >= 65 && iN <= 90) //大写字母 
  return 2;
  if (iN >= 97 && iN <= 122) //小写 
  return 4;
  else return 8; //特殊字符 
}

//计算出当前密码当中一共有多少种模式 
function bitTotal(num) {
  var modes = 0;
  for (var i = 0; i < 4; i++) {
      if (num & 1) modes++;
      num >>>= 1;
  }
  return modes;
}

//返回密码的强度级别 
function checkStrong(psw) {
  if (psw.length <= 3) return 0; //密码太短 
  var modes = 0;
  for (var i = 0; i < psw.length; i++) {
      //测试每一个字符的类别并统计一共有多少种模式. 
	  modes |= charMode(psw.charCodeAt(i));
  }
  return bitTotal(modes);
}

//当用户放开键盘或密码输入框失去焦点时,根据不同的级别显示不同的颜色 
function pswStrength(pwd) {
  var o_color = "#e0f0ff",l_color = "#FF0000",m_color = "#FF9900",h_color = "#33CC00";
  if (Public.isBlank(pwd)) {
	  $.each([1,2,3],function(i,o){
		  $('#passwordStrength'+o).css({backgroundColor:o_color});
	  });
      return;
  } else {
	  var level = checkStrong(pwd);
      switch (level) {
      case 0:
      case 1:
    	  $('#passwordStrength1').css({backgroundColor:l_color});
    	  $('#passwordStrength2').css({backgroundColor:o_color});
    	  $('#passwordStrength3').css({backgroundColor:o_color});
          break;
      case 2:
    	  $('#passwordStrength1').css({backgroundColor:o_color});
    	  $('#passwordStrength2').css({backgroundColor:m_color});
    	  $('#passwordStrength3').css({backgroundColor:o_color});
          break;
      default:
    	  $('#passwordStrength1').css({backgroundColor:o_color});
      	  $('#passwordStrength2').css({backgroundColor:o_color});
    	  $('#passwordStrength3').css({backgroundColor:h_color});
      }
  }
  return;
}
//保存密码设置
function savePassword(){
	var psw=$.trim($("#modifOldPassword").val());
    if( psw==""){
    	Public.tip('密码不能空！');
    	$("#modifOldPassword").focus();
    	return ;
    }
    var newPsw=$.trim($("#modifNewPassword").val());
    if(newPsw ==""){
    	Public.tip('新密码不能空！');
    	$("#modifNewPassword").focus();
    	return ;
    }
    if(newPsw.length < 6) {
    	Public.tip('密码长度应大于等于6位！');
    	$("#modifNewPassword").focus();
    	return ;
    }
    var surePsw=$.trim($("#modifSurePassword").val());
	if(newPsw != surePsw){
		Public.tip('两次输入的密码不一致！');
		return ;
	}
	$('#updatePasswordForm').ajaxSubmit({url : web_app.name + '/orgAction!updatePassword.ajax',
		param:{psw:$.base64.btoa(psw),newPsw:$.base64.btoa(newPsw)},
		success : function() {}
	});
}
/********************用户分组相关*************************/
function initsetUserGroup(){
	var div=$('#setUserGroup');
	var flag=div.attr('isInit');//是否已初始化
	if(flag=='1'){
		return;
	}
	queryUserOwnerGroup(function(){
		div.attr('isInit',"1");
	});
}
//用户分组相关
var userGroupObject={},userGroupMaxSequence=0;
function queryUserOwnerGroup(fn){
	Public.ajax(web_app.name + "/oaSetupAction!getUserOwnerGroup.ajax",{},function(data){
		var html = [];
		$.each(data, function(i, o){
			userGroupObject[o['groupId']]=o;
			html.push('<tr style="min-height:25px;">');
			html.push('<td class="title index" style="text-align:center;">',o['sequence'],'</td>');
			html.push('<td class="title" style="text-align:center;">',o['name'],'</td>');
			html.push('<td class="title" style="text-align:left;" id="groupDetail',o['groupId'],'">');
			html.push(getGroupDetailHtml(o.details));//组合组织信息显示
			html.push('</td>');
			html.push('<td class="title" style="text-align:left;"><div class="operating">');
			html.push('<a href="javascript:void(null);" class="GridStyle" onclick="doEditGroup(',o['groupId'],')"><span class="ui-icon ui-icon-edit">&nbsp;</span>编辑</a>&nbsp;');
			html.push('<a href="javascript:void(null);" class="GridStyle" onclick="deleteUserGroup(',o['groupId'],')"><span class="ui-icon ui-icon-trash">&nbsp;</span>删除</a>&nbsp;');
			html.push('<a href="javascript:void(null);" class="GridStyle" onclick="addUserGroupDetail(',o['groupId'],')"><span class="ui-icon ui-icon-folder">&nbsp;</span>设置用户</a>');
			html.push('</div></td>');
			html.push('</tr>');
			userGroupMaxSequence=o['sequence'];
        });
		$("#userGroupListTable>tbody").html(html.join(""));
		if($.isFunction(fn)){
			fn.call(window);
		}
	});
}
function getGroupDetailHtml(details){
	var html=[];
	$.each(details,function(i,d){
		html.push('<span title="',d['fullName'],'" style="word-break:keep-all;">');
		html.push('<img src="',OpmUtil.getOrgImgUrl(d['orgKindId'],d['status']),'" width="16" height="16"/>');
		html.push(d['name']);
		html.push('</span>;&nbsp;');
	});
	return html.join('');
}
function doEditGroup(groupId){
	var id='',name='',sequence=userGroupMaxSequence+1;
	if(groupId&&userGroupObject[groupId]){
		var group=userGroupObject[groupId];
		id=groupId;
		sequence=group['sequence'];
		name=group['name'];
	}
	var html=['<form method="post" action="" id="submitGroupForm"><div class="ui-form">'];
	html.push('<dl>');
	html.push('<dt style="width:70px">排序号<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd><input type="text" name="sequence" id="groupSequence" class="text" required="true" label="序号" value="',sequence,'" spinner="true" mask="nnnn"></dd>');
	html.push('</dl>');
	html.push('<dl>');
	html.push('<dt style="width:70px">名称<font color="#FF0000">*</font>&nbsp;:</dt>');
	html.push('<dd><input type="text" name="name" id="groupName" class="text" required="true" label="名称" value="',name,'"></dd>');
	html.push('</dl>');
	html.push('</div></form>');
	UICtrl.showDialog({title:'用户分组',width:300,top:150,
		content:html.join(''),
		ok:function(){
			var param=$('#submitGroupForm').formToJSON();
			if(!param) return false;
			param['groupId']=id;
			Public.ajax(web_app.name + "/oaSetupAction!saveUserGroupPersonOwner.ajax",param,function(data){
				queryUserOwnerGroup();
			});
			return true;
		}
   });
}

function addUserGroupDetail(groupId){
	var groupObject=userGroupObject[groupId],detailData=null;
	if(groupObject) detailData=groupObject['details'];
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='dpt,pos,psm';
	var options = { params: selectOrgParams,title : "选择组织",
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)&&detailData){//初始化已选择列表
				$.each(detailData,function(i,d){
					addFn.call(window,d);
				});
				//刷新列表
				var reloadGrid=this.iframe.contentWindow.reloadGrid;
				reloadGrid.call(window);
			}
		},
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			var addRows=[],_self=this;;
			$.each(data,function(i,o){
				addRows.push($.extend({},o,{orgId:o['id']}));
			});
			Public.ajax(web_app.name + '/oaSetupAction!saveUserGroupDetail.ajax',{groupId:groupId,detailData:encodeURI($.toJSON(addRows))},
				function(data) {
					groupObject['details']=addRows;
					//组合显示数据
					$('#groupDetail'+groupId).html(getGroupDetailHtml(addRows));
					_self.close();
				}
			);
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}
function deleteUserGroup(groupId){
	 UICtrl.confirm('确定删除吗?',function(){
	 	Public.ajax(web_app.name + '/oaSetupAction!deleteUserGroupPersonOwner.ajax', {groupId:groupId}, function(){
			queryUserOwnerGroup();
		});
	});
}
function toUserGroupListDetail(){
	var url=web_app.name + '/oaSetupAction!toUserGroupListDetail.do';
	parent.addTabItem({ tabid: 'UserGroupListDetail', text: '自定义用户组', url:url});
}
/***************流程模板设置相关******************/
function initsetProcessTemplates(){
	var div=$('#setProcessTemplates');
	var flag=div.attr('isInit');//是否已初始化
	if(flag=='1'){
		return;
	}
	queryUserProcessTemplates(function(){
		div.attr('isInit',"1");
	});
}
//用户分组相关
var processTemplates={},processTemplatesMaxSequence=0;
function queryUserProcessTemplates(fn){
	Public.ajax(web_app.name + "/configurationAction!queryUserProcessTemplate.ajax",{},function(data){
		var html = [],handlerGroupId=null;
		$.each(data, function(i, o){
			handlerGroupId=o['handlerGroupId'];
			processTemplates[handlerGroupId]=o;
			html.push('<tr style="min-height:25px;">');
			html.push('<td class="title index" style="text-align:center;">',o['sequence'],'</td>');
			html.push('<td class="title" style="text-align:center;">',o['name'],'</td>');
			html.push('<td class="title" style="text-align:left;" id="groupDetail',handlerGroupId,'">');
			html.push(UICtrl.getProcessTemplateUsersHtml(o.details));//组合组织信息显示
			html.push('</td>');
			html.push('<td class="title" style="text-align:left;"><div class="operating">');
			html.push('<a href="javascript:void(null);" class="GridStyle" onclick="doProcessTemplate(',handlerGroupId,')"><span class="ui-icon ui-icon-edit">&nbsp;</span>编辑</a>&nbsp;');
			html.push('<a href="javascript:void(null);" class="GridStyle" onclick="deleteUserProcessTemplate(',handlerGroupId,')"><span class="ui-icon ui-icon-trash">&nbsp;</span>删除</a>&nbsp;');
			html.push('<a href="javascript:void(null);" class="GridStyle" onclick="showChooseHandlerDialog(',handlerGroupId,')"><span class="ui-icon ui-icon-folder">&nbsp;</span>设置用户</a>');
			html.push('</div></td>');
			html.push('</tr>');
			processTemplatesMaxSequence=o['sequence'];
        });
		$("#processTemplatesListTable>tbody").html(html.join(""));
		if($.isFunction(fn)){
			fn.call(window);
		}
	});
}

function doProcessTemplate(groupId){
	UICtrl.doProcessTemplate({groupId:groupId,callBack:function(){
		queryUserProcessTemplates();
	}});
}

function deleteUserProcessTemplate(handlerGroupId){
	 UICtrl.confirm('确定删除吗?',function(){
	 	Public.ajax(web_app.name + '/configurationAction!deleteUserProcessTemplate.ajax', {handlerGroupId:handlerGroupId}, function(){
			queryUserProcessTemplates();
		});
	});
}

function showChooseHandlerDialog(handlerGroupId){
	var params = {},processTemplatesObject=processTemplates[handlerGroupId];handlerArray=processTemplatesObject['details'];
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
			var _self=this;
			Public.ajax(web_app.name + '/configurationAction!saveUserProcessTemplateDetail.ajax',{handlerGroupId:handlerGroupId,detailData:encodeURI($.toJSON(handlerArray))},
				function(data) {
					processTemplatesObject['details']=handlerArray;
					//组合显示数据
					$('#groupDetail'+handlerGroupId).html(UICtrl.getProcessTemplateUsersHtml(handlerArray));
					_self.close();
				}
			);
        },
        cancelVal: '关闭',
        cancel: true
    });
}
function handlerArraySort(o1,o2){
	var g=o1['groupId']*100,q=o2['groupId']*100;
	var a=o1['sequence'],b=o2['sequence'];
	return (g+a)>(q+b)?1:-1
}
/***********
 * 客户端群维护
 * 相关通用方法定义在rtxGroupUtil.js
 * ************/
function initsetRtxGroup(){
	var div=$('#setRtxGroup');
	var flag=div.attr('isInit');//是否已初始化
	if(flag=='1'){
		return;
	}
	queryUserRTXGroup(function(){
		div.attr('isInit',"1");
	});
	initializeRTXUserGroupDetailGrid();//方法定义在rtxGroupUtil.js
	$('#rtxUserGroupList').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('a.GridStyle')){
			$('div.divChoose',this).removeClass('divChoose');
			var id=$clicked.attr('id'),name=$clicked.text();
			var isAd=parseInt($clicked.attr('isAd'),0);
			$('#rtxUserGroupId').val(id);
			$('#userRTXGroupLayout').find('.l-layout-center .l-layout-header').html('<font style="color:Tomato;font-size:13px;">['+name+']</font>成员列表');
			$clicked.parent().addClass('divChoose');
			UICtrl.gridSearch(rtxUserGroupDetailGridManager,{rtxGroupId:id});
			//是否为管理员控制按钮权限
			setRtxUserGroupToolbarEnabled(isAd>0);
		}
	});
	UICtrl.layout($('#userRTXGroupLayout'),{
	    leftWidth: '200', height: '100%',
		heightDiff:-6, 
	    onSizeChanged:function(){
	    	var middleHeight=$('#rtxUserGroupDetailCenter').height();
	    	 $('#rtxUserGroupList').height(middleHeight-38);
	    }
    });
    var middleHeight=$('#rtxUserGroupDetailCenter').height();
    $('#rtxUserGroupList').height(middleHeight-38);
}
function queryUserRTXGroup(fn){
	Public.ajax(web_app.name + "/rtxAction!queryUserRTXGroup.ajax",{},function(data){
		var html = [];
		var isAd=0;
		$.each(data, function(i, o){
			isAd=parseInt(o.isAd,10);
			html.push('<div class="list_view',(isAd>0?' user_group_list':''),'">');
			html.push('<a href="javascript:void(0);" id="',o.rtxGroupId,'" isAd="',isAd,'"  class="GridStyle">')
			html.push(o.name);
			html.push('</a>','</div>');
        });
        $('#rtxUserGroupList').html(html.join(''));
		if($.isFunction(fn)){
			fn.call(window);
		}
	});
}