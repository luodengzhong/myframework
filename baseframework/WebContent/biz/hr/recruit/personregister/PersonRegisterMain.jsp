<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>招聘</title>
<link href='<c:url value="/themes/default/login.css"/>' rel="stylesheet" type="text/css" />
<link href='<c:url value="/themes/default/ui.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.md5.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.json-2.4.min.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.dragEvent.js"/>' type="text/javascript"></script>
<script src='<c:url value="/javaScript/common.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/recruit/personregister/PersonRegisterMain.js"/>'   type="text/javascript"></script>
<script src='<c:url value="/javaScript/WEB_APP.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="main">
		<div class="header">
			<div class="logo">
				<a href="http://www.brc.com.cn/" title="蓝光集团"></a>
			</div>
		</div>
		<div class="loginCon">
			<div class="loginLeft"></div>
			<div class="loginRight">
				<div class="loginMod">
					<div class="borderTit">
						<strong>欢迎您,应聘蓝光地产集团</strong>
					</div>
					<div class="borderCon">
						<div class="login" id="login">
							<form action="" method="post" name="logonForm" id="logonForm">
								 <p style="padding-left:50px;">
									<label
										style="margin: 0 20px 0 20px; padding: 10px; border: 1px solid #DDDDDD">
										<input type="radio" name="radio1"  id="radio10"   checked="checked"
										value="0" />社会招聘</label> 
										<label style="margin:0 20px 0 20px;padding:10px;border: 1px solid #DDDDDD">
										<input type="radio" name="radio1"  id="radio11" value="1"/>猎头推荐</label>
								</p> 
								<p class="loginText"  style="padding-left:50px;">
									<em>验证码：</em>
									<label>
										<input type="text" id="userCode" name="userCode" value="" style="width:80px;"/>
									</label>
									<!-- <label>
										<td  style="width:80px;">社会招聘人员首次登陆无需输入验证码!</td>
									</label> -->
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
				版权所有 <a href="#" target="_blank">蓝光地产</a>
			</p>
			<p class="footLink">
				<a href="" target="_blank">版权声明</a> | 
				<a href="" target="_blank">联系方法</a> | 
				<a href="" target="_blank">使用说明</a> | 
				<a href="" target="_blank">论坛</a>
			</p>
		</div>
	</div>
</body>
</html>
