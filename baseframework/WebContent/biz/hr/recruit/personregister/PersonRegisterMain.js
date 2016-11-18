var hunterType=4,commType=3;
$(document).ready(function() {
	initializeUI();
	
});


function initializeUI(){
	
	$("#btnLogin").click(function() {
		login();
	});
	
	$("#btnClose").click(function() {
		window.close();
	});
}

function login(){
	//type=0为社会招聘   type=1为猎头推荐
	var type=$('input[name="radio1"]:checked').val();
	var userCode=$('#userCode').val();
	if(type==1 ){
		if(userCode.length<1){
			Public.tip("请输入猎头验证码！");
			return ;
		}else{
			Public.ajax(web_app.name + '/personregisterAction!queryCodeIsExists.ajax', 
					{userCode:userCode},function(data) {
                     if(data!=0){
                    	 //表示该猎头存在
//                    	 window.location.href = web_app.name +'/personregisterAction!forwardListPersonRegisterByHeader.do?hunterId='+data+
//              			'&sourceType='+hunterType;
              			 window.location.href = web_app.name +'/personregisterAction!showHeadHunterPosListPage.do?hunterId='+data+
              			'&sourceType='+hunterType;
                     }else{
                    	 Public.tip("猎头验证码不存在或已终止合作!");
                     }
					});
            
		}
	}else{
		if(userCode.length<1){
			//无验证码，直接打开登记页面
			Public.tip("请输入验证码！");
			return ;
//			location.replace(web_app.name + '/personregisterAction!showInsertPersonRegister.do?sourceType='+commType );
//			 window.location.href =web_app.name + '/personregisterAction!showInsertPersonRegister.do?sourceType='+commType ;
		
		}else{
			//有验证码，查询验证码是否存在
//			 window.location.href =web_app.name + '/personregisterAction!queryPersonCodeIsExists.do?userCode='+userCode+
//					'&sourceType='+commType;
             
			 Public.ajax(web_app.name + '/personregisterAction!queryPersonCodeIsExists.ajax', 
						{userCode:userCode,sourceType:commType},function(data) {
	                     if(data==0){
	                    	 window.location.href = web_app.name +'/personregisterAction!forwardListPersonRegisterBySociety.do?userCode='+userCode;
	                     }else{
	                    	 Public.tip("验证码错误,请重新输入!");
	                     }
						});
	            
			 
		}
			
		}
	}

