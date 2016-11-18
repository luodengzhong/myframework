if(self!=top){top.location=self.location;}

var LoginStatus = {
	UNKOWN_ERROR : 0,
	SUCCESS : 1,
	USER_NOT_EXIST : 2,
	PASSWORD_ERROR : 3,
	USER_DSIABLED : 4,
	USER_LOGIC_DELETE : 5
};

var gridManager = null;

var LoginSetting = function(options) {
	this.cookieName = "brc-login";
	this.data = $.evalJSON($.cookie(this.cookieName) || "{}") || {};
	this.init();
};

LoginSetting.prototype = {
	init : function (){
		var _self = this;
		// 保存用户名
		this.rememberEl = $("#remember").click(function() {
			_self.set("remember", this.checked);
		});
		// 其他设置 ...
	},
	load : function() {
		this.rememberEl.get(0).checked = !!this.data["remember"];
		if (this.rememberEl.get(0).checked) {
			$('#userName').val(this.data["userName"]);
		}
	},
	set : function(name, value) {
		if (this.data[name] != value) {
			this.data[name] = value;
			this.save();
		}
	},
	get : function(name) {
		return this.data[name];
	},
	save : function() {
		$.cookie(this.cookieName, $.toJSON(this.data), {expires : 7,path : '/'});
	}
};

var loginSetting;

$(function() {
	loginSetting = new LoginSetting();
	loginSetting.load();
	bindEvents();
});

function bindEvents() {
	$("#btnLogin").click(function() {
		login();
	});
	$("#btnClose").click(function() {
		closeWebPage();
	});
	$("#userName").blur(function(){
		if(this.value==''){
			this.value='请输入用户名';
			this.style.color='#999';
		}else{
			this.style.color='#000';
		}
	}).focus(function(){
		if(this.value=='请输入用户名'){
			this.value='';
			this.style.color='#000';
		}
	});
//	$('#randimg').show();
//	$('#changeSecurityCode').click(function(e){
//		var url=web_app.name+'/random.img?timeStamp='+new Date().getTime();
//		$('#randimg').attr('src',url);
//		$('#securityCode').val('');
//	});
	$(document).bind('keydown',function(e){
		var k =e.charCode||e.keyCode||e.which;
		if(k=='13'){
			login();
		}
	});
}

function login() {
	var params = {
		userName:$.trim($('#userName').val()),
		password:$.trim($('#password').val())
		//securityCode:$.trim($('#securityCode').val())
	};
	if (params.userName.length < 1) {
		Public.tip("请输入用户名！");
		$("#userName").focus();
		return;
	}
	if (params.password.length < 1) {
		Public.tip("请输入密码！");
		$("#password").focus();
		return;
	}
//	if (params.securityCode.length < 1) {
//		Public.tip("请输入验证码！");
//		$("#securityCode").focus();
//		return;
//	}

	params.password = $.md5(params.password);
	//params.password = $.base64.btoa(params.password);
	Public.ajax(web_app.name + '/devLogin.ajax',params,function(result){
		if (result) {
			switch (result.status) {
			case LoginStatus.UNKOWN_ERROR:
			case LoginStatus.USER_NOT_EXIST:
			case LoginStatus.USER_DSIABLED:
			case LoginStatus.USER_LOGIC_DELETE:
				//$('#changeSecurityCode').triggerHandler('click');
				Public.tips({type:1, content : result.message});
				$("#userName").focus();
				break;
			case LoginStatus.SUCCESS:
				if (loginSetting.get("remember")) {
					loginSetting.set("userName", params.userName);
				} else {
					loginSetting.set("userName", "");
				}
				window.location.href = web_app.name +'/Index.jsp';
//				if (result.personMembers &&  result.personMembers.length == 1){
//					var orgId = result.personMembers[0].id;
//					Public.ajax(web_app.name + '/setOperatorOrgInfo.ajax', { id: orgId }, function(data) {
//						window.location.href = web_app.name +'/Index.jsp';
//					});					
//				}else{
//					$('#changeSecurityCode').triggerHandler('click');
//					Public.showPosDialog(result.personMembers);
//				}
				break;
			case LoginStatus.PASSWORD_ERROR:
				$('#changeSecurityCode').triggerHandler('click');
				Public.tips({type:1, content : result.message});
				$("#password").focus();
				break;
			}
		} else {
			$('#changeSecurityCode').triggerHandler('click');
			Public.tips({type:1, content : '未知错误，请联系管理员！'});
			$("#userName").focus();
		}
	},function(){
		$('#changeSecurityCode').triggerHandler('click');
	});
}
function closeWebPage(){
	if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null; window.close();
        }
        else {
            window.open('', '_top'); window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank ';
    }
    else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}
function onSelectPos(){

}