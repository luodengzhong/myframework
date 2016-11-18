<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>登录页面</title>
<link href='<c:url value="/themes/default/login.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/themes/default/ui.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.md5.js"/>' type="text/javascript"></script>
<%--<script src='<c:url value="/lib/jquery/jquery.base64.js"/>' type="text/javascript"></script>--%>
<script src='<c:url value="/lib/jquery/jquery.json-2.4.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.dragEvent.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
<script src='<c:url value="/testLogin.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/WEB_APP.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="main">
		<div class="header">
			<div class="logo">
				<a href="http://www.brc.com.cn/" target="_blank" title="蓝光集团"></a>
			</div>
		</div>
		<div class="loginCon">
		    <input type="hidden" id="operator" />
			<div class="loginLeft"></div>
			<div class="loginRight">
				<div class="loginMod">
					<div class="borderTit">
						<strong>欢迎使用蓝光综合管理信息系统</strong>
					</div>
					<div class="borderCon">
						<div class="login" id="login">
							<form action="" method="post" name="logonForm" id="logonForm">
								<p class="loginText">
									<em>用户名：</em>
									<label>
										<input type="text" id="userName" name="userName" value=""/>
									</label>
								</p>
								<p class="loginText">
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
				版权所有 <a href="http://www.brc.com.cn/" target="_blank">蓝光地产</a>
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