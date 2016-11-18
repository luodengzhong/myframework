<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<title>资源清查</title>
	<link rel="shortcut icon"  type="image/icon" href="favicon.ico" />
	<link rel="icon"  type="image/icon" href="favicon.ico" />
	<link rel="bookmark"  type="image/icon" href="favicon.ico" />
	<link href='<c:url value="/css/logon.css"/>' rel="stylesheet" type="text/css">
	<script src='<c:url value="/js/jquery.js"/>' type='text/javascript'></script>
	<script src='<c:url value="/js/WEB_APP.js"/>' type='text/javascript'></script>
	<script src='<c:url value="/js/myMask.js"/>' type='text/javascript'></script>
	<script src='<c:url value="/js/myAjax.js"/>' type='text/javascript'></script>
	<script src='<c:url value="/js/doLogon.js"/>' type="text/javascript"></script>
</head>
<body topmargin="0" leftmargin="0" bgcolor="#F5F5F5"  onkeydown="if(event.keycode==78 && event.ctrlkey) return false;" >
<noscript>
<div style=" position:absolute; z-index:100000; height:2046px;top:0px;left:0px; width:100%; background:white; text-align:center;">
    <img src='<s:url value="/images/noscript.gif"/>' alt='抱歉，请开启脚本支持！' />
</div></noscript>
<div class='user_apply_main'>
	<div style='text-align:center;'>
	    <div class='user_apply_title'>
		   <div class="float_left">
		   		<span class='message'>IP地址受限</span>
		  		 - 您的IP地址被禁止访问
		  	</div>
		   <div class="float_right" style='padding-top:8px;'><a href="<c:url value="/LogonDialog.jsp"/>" class="btn"><span>返回登陆页</span></a></div>
		   <div class='clear:both;'></div>
		</div>
		<div class='log_right' style='height:500px;' align='left'>
		  <input type='hidden' id='userid' value='<c:out value="${userid}"/>'>
		   <div class="log_prompt" style="display:inline-block;">
		 	  <div class="float_left" style="width:600px;">
		 	   	  对不起，你的 IP 地址不在被允许的范围内，无法访问本站点。
			    <div class='log_style1'>您可通过以下方式访问:</div>
	             <ul class='log_ul'>
				   <li><a href='##' onclick='getVisitAuthority(1)'>为当前IP申请登陆许可</a></li>
				   <li><a href='##' onclick='getVisitAuthority(2)'>通过短信获取登陆密码</a></li>
				   <li><a href='##' onclick='getVisitAuthority(3)'>通过邮件获取登陆密码</a></li>
				 </ul>
			  </div>
			  <div class="float_right" style="width:300px;text-align:left;padding-top:50px;">
			 	<div>请输入验证码：<span style="width:70px;height:100%;"><input name="rand" id='rand' type="text" size="10"></span></div>
			 	<div style="padding-left:85px;padding-top:10px;">
			 		<img src='<c:url value="/random.img?timeStamp=1"/>' id='randimg' width='60' height='20' style='display:none;'/>&nbsp;&nbsp;
			 		<a href='#' id='reRandimg'>看不清?</a>
			 	</div>
			  </div>
		   </div>
		  <div class="log_prompt log_prompt_info" id="mail_info_div">
		     <div>您的信息已经成功提交，登陆密码已发送到您的邮箱<font color='red'> <c:out value="${email}"/></font>.</div>
		     <div>登录邮箱，按照邮件中给定密码登陆系统，注意密码<font color='red'>有效期为<c:out value="${due_time}"/>分钟</font>。</div>
		  </div>
		  <div class="log_prompt log_prompt_ask" id='mail_ask_div'>
		     <div>确认邮件是否被您提供的邮箱系统自动拦截，或被误认为垃圾邮件放到垃圾箱了。</div>
		     <div>如果您确认邮箱地址正确，可以请求再次发送登陆密码。</div>
		  </div>
		   <div class="log_prompt log_prompt_info" id="note_info_div">
		     <div>您的信息已经成功提交，登陆密码已发送到您的手机<font color='red'> <c:out value="${mobtel}"/></font>.</div>
		     <div>按照短信中给定密码登陆系统，注意密码<font color='red'>有效期为<c:out value="${due_time}"/>分钟</font>。</div>
		  </div>
		  <div class="log_prompt log_prompt_ask" id='note_ask_div'>
		     <div>确认短信是否被您手机自动拦截，或被误认为垃圾短信放到垃圾箱了。</div>
		     <div>如果您确认手机号码正确，可以请求再次发送登陆密码。</div>
		  </div>
		   <div class="log_prompt log_prompt_info" id="ip_info_div">
		     <div>您的登陆申请已提交系统管理员。</div>
		     <div>请耐心等待管理员审核。</div>
		  </div>
		</div>
	</div>
	<div class='division'><span style='width:197px;background-color:#9ec5e6;'>&nbsp;</span><span style='width:781px;background-color:#c3dcf0;'>&nbsp;</span></div>
</div>
</body>
</html>