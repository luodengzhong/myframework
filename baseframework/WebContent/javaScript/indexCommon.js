//修改密码
function showResetPsw() {
	var html=['<div class="ui-form">','<form method="post" action="" id="updatePasswordForm">'],
		fields=[{id:'modifOldPassword',text:'原密码',type:'password'},
		        {id:'modifNewPassword',text:'新密码',type:'password'},
		        {id:'modifSurePassword',text:'确认密码',type:'password'}];
    var template=["<div class='row'><dl>"];
    template.push("<dt style='width:75px'>{text}<font color='#FF0000'>*</font>&nbsp;:</dt>");
    template.push("<dd style='width:140px'>");
    template.push("<input type='{type}' class='text' id='{id}' required='true' maxlength='20' value='{value}'/>");
    template.push("</dd>");
    template.push("</dl></div>");
	$.each(fields,function(i,o){
		html.push(template.join('').replace('{id}',o.id)
                .replace('{text}',o.text)
                .replace('{value}',o.value||'')
                .replace('{type}',o.type));
	});
	html.push("<div class='row'><dl>");
	html.push("<dt style='width:75px'>");
	html.push("密码强度:</dt>");
	html.push("<dd style='width:140px'>");
	html.push("<span class='passwordStrength' id='passwordStrength1'>弱</span>");
	html.push("<span class='passwordStrength' id='passwordStrength2'>中</span>");
	html.push("<span class='passwordStrength' id='passwordStrength3'>强</span>");
	html.push("</dd>");
	html.push("</dl></div>");
	html.push("<div class='row'><dl style='padding-left:10px;'>");
	html.push("<input type='radio' name='passwordType' id='passwordType1' value='1' checked/>");
	html.push("&nbsp;<label for='passwordType1'>","登陆密码","</label>","&nbsp;&nbsp;");
	html.push("<input type='radio' name='passwordType' id='passwordType2' value='2'/>");
	html.push("&nbsp;<label for='passwordType2'>","重要数据密码","</label>");
	html.push("<dl></div>","</form>");
	UICtrl.showDialog( {
		width:270,
		top:150,
		title : '修改密码',
		height:120,
		content:html.join(''),
		ok : resetPsw,
		init:function(){
			var input=$("#modifNewPassword");
			input.bind('blur',function(){
				pswStrength($(this).val());
			}).bind('keyup',function(){
				pswStrength($(this).val());
			});
		}
	});
}

function resetPsw(){
	var _self = this;
	var psw=$.trim($("#modifOldPassword").val());
    if( psw==""){
    	Public.tip('密码不能空！');
    	return ;
    }
    var newPsw=$.trim($("#modifNewPassword").val());
    if(newPsw ==""){
    	Public.tip('新密码不能空！');
    	return ;
    }
    if(newPsw.length < 6) {
    	Public.tip('密码长度应大于等于6位！');
    	return ;
    }
    var surePsw=$.trim($("#modifSurePassword").val());
	if(newPsw != surePsw){
		Public.tip('两次输入的密码不一致！');
		return ;
	}
	$('#updatePasswordForm').ajaxSubmit({url : web_app.name + '/orgAction!updatePassword.ajax',
		//param:{psw:$.md5(psw),newPsw:$.md5(newPsw)},
		param:{psw:$.base64.btoa(psw),newPsw:$.base64.btoa(newPsw)},
		success : function() {
			_self.close();	
		}
	});
}

function switchOperator(){
	var url = web_app.name + '/orgAction!queryPersonMembersByPersonId.ajax';
	Public.ajax(url, {}, function(data){
		showSwitchOperator(data);
	});
}

function showSwitchOperator(data){
	var html=[];
	html.push('<table width="100%" border=0 cellspacing=0 cellpadding=0 >','<thead>','<tr>');
	html.push('<th>机构</th>','<th>部门</th>','<th>岗位</th>','</tr>','</thead>');
	$.each(data, function(i, o){
	    	html.push('<tr class="list" psmId="',o['id'], '">');
	    	html.push('<td>',o['orgName'],'</td>');
	    	html.push('<td>',o['centerName'],'</td>');
	    	html.push('<td>',o['positionName'],'</td>');
	    	html.push('</tr>');
	});
	html.push('</table>');
	var options={
			title:'切换岗位',
			content:html.join(''),
			width: 400,
			opacity:0.1,
			onClick:function($el){
				if($el.is('td')){
					var psmId = $el.parent().attr('psmId');
					Public.ajax(web_app.name + '/switchOperator.ajax', { psmId: psmId }, function(data) {
						afterSwitchOperator();
					});
			    }
			},
			onMousemove:function($el){
				var $tr= $el.parent('tr'), table = $tr.parent();
				if($tr.length==0 || !$tr.hasClass('list') || $tr.hasClass('over') || $tr.hasClass('seleced')) return false;
				table.find('tr.over').removeClass('over');
				$tr.addClass('over');
			}
	};
	Public.dialog(options);
};

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
//意见箱
function showSuggestionBox(){
	UICtrl.showAjaxDialog({url: web_app.name + '/suggestionBoxAction!showInsert.load',
		width:500,title:'发表意见',
		ok: function(){
			var _self=this;
			$('#suggestionBoxForm').ajaxSubmit({url: web_app.name + '/suggestionBoxAction!insert.ajax',
				success : function(data) {
					_self.close();
				}
			});
		}
	});
}
//帮助
function showHelpBox(){
	var head=$('#indexNavigation');
	var of=head.offset(),height=head.height(),width=head.width();
	var top=of.top+height+3;
	height=$('#indexCenter').height();
	var code=getCurrentTabId();
	$.showHelpDialog({top:top,height:height-3,width:width/4,param:{code:code}});
}

//制度
function showInstitution(){
	var menus=$('#functionNavigation');
	var item = $('li.selected',menus);
	var code=item.attr('id');
	var name=item.text();
	var institutionTreeId = '';
	Public.syncAjax(web_app.name+'/oaInstitutionAction!findInstitutionTreeId.ajax', 
			{opfunctionCode:code},
			function(id){
				institutionTreeId=id;
	});
	if(institutionTreeId!=null&&institutionTreeId!=''){
		addTabItem({ tabid: 'Institution'+code, text: name+'制度', url: web_app.name+'/oaInstitutionAction!forwardInstitutionViewByModule.do?rootId='+institutionTreeId});
	}
	else{
		addTabItem({ tabid: 'InstitutionView', text: '制度阅读', url: web_app.name+'/oaInstitutionAction!forwardInstitutionRead.do'});
	}	
}

//打开用户控制面板
function showcontrolPanel(){
	addTabItem({ tabid: 'controlPanel', text: '控制面板 ', url: web_app.name+'/personOwnAction!forwardUsercontrol.do'});
}

//打开手机app下载对话框
function showAppDialog(){
	var html=$('#showAppDownDiv').html();
	UICtrl.showDialog( {width:350,top:150,title : '蓝光移动办公',content:html,ok : false});
}

function showDocumentPage(){
	var url = web_app.name + '/oaDocumentAction!forwardDocumentPage.do ';
	addTabItem({ tabid: 'OADocumentPage', text: '文档中心 ', url: url});
}