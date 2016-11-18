<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="decorator" content="none">
<title>登录页面</title>
	<style>
		.loginText2 em {
			float: left;
			font-size: 14px;
			font-style: normal;
			width: 70px;
		}
		.loginText2 label {
			float: left;
			width: 230px;
		}
		.loginText2 img{
			position: relative;
			top:5px;
			_top:0px;
			*top:0px;
		}
		.loginText2 input {
			background: none repeat scroll 0 0 #F4F4F4;
			border: 1px solid #878787;
			line-height: 16px;
			padding: 5px;
			width: 120px;
			color:#999;
		}
	</style>
<link href='<c:url value="/themes/default/login.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/themes/default/ui.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.base64.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.md5.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.json-2.4.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.dragEvent.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/Login.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/WEB_APP.js"/>' type="text/javascript"></script>
</head>
<body class="JBbody">
	<div class="main">
		<div class="header"  style="height:90px;">
			<div class="logo" style="background: url(<c:url value="/themes/default/images/login/jbhead.png"/>) no-repeat scroll 0 0;width:250px;height:90px;">
				<a href="http://www.justbon.com.cn/" target="_blank" title="蓝光嘉宝"></a>
			</div>
		</div>
		<div class="loginCon">
		    <input type="hidden" id="operator" />
			<div class="loginLeft"></div>
			<div class="loginRight">
				<div class="loginMod">
					<div class="borderTit">
						<strong>欢迎使用蓝光嘉宝管理信息系统</strong>
					</div>
					<div class="borderCon">
						<div class="login" id="login">
							<form action="" method="post" name="logonForm" id="logonForm">
								<p class="loginText2">
									<em>用户名：</em>
									<label>
										<input type="text" id="userName" name="userName" value=""/><b> @brc.com.cn</b>
									</label>
								</p>
								<p class="loginText2">
									<em>密 &nbsp;码：</em>
									<label>
										<input type="password" id="password" name="password" value=""/>
									</label>

								</p>
								<!--
								<p class="loginText">
									<em>验证码：</em>
									<label>
										<input type="text" id="securityCode" name="securityCode"/>
										<img src='<c:url value="/random.img?timeStamp=1"/>' id='randimg' width='60' height='20' style='display:none;'/>
									</label>
									<span><a href="javascript:void(null);" id="changeSecurityCode" hidefocus>看不清?</a></span>
								</p>

								<p class="loginText">
									<em>选择岗位：</em>
									<label>
										<input type="text" id="selectPos" name="selectPos" value="" />
									</label>
								</p>
								-->
								<p class="loginState">
									<label>
										<input type="checkbox" name="remember" id="remember" /> 记住登录状态
									</label>
								</p>
								<p class="submitBut">
									<input type="button" id="btnLogin" name="button" value=" " class="btnLogin"/>&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="button" id="btnClose" name="button" value=" " class="btnClose"/>
								</p>
							</form>
						</div>
					</div>
					<div class="borderBottom"></div>
				</div>
			</div>
		</div>
		<div class="footer">
			<p class="copyright">
				版权所有 <a href="http://www.justbon.com.cn/" target="_blank">蓝光嘉宝</a>
			</p>
			<!--  <p class="footLink">
				<a href="" target="_blank">版权声明</a> |
				<a href="" target="_blank">联系方法</a> |
				<a href="" target="_blank">使用说明</a> |
				<a href="" target="_blank">论坛</a>
			</p>-->
		</div>
	</div>
</body>
</html>