<%@page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<div id="show_error_info">
	<div class="error_top"></div>
	<div class="error_con">
		<div class="error_bg">
			<div class="error_tle">出现错误！</div>
			<div class="error_info font_str">以下为错误信息：</div>
			<div class="error_dtl font_r">
				<font color="red" style="font-size: 11pt; line-height: 16pt"> 
				 <s:actionerror />
				 <s:fielderror /> 
				 <c:out value="${tip}" default="查询数据时出错！" />
				</font>
			</div>
			<div class="error_block">
				如果还是出错，请联系管理员或者您可以在“<a href="javascript:parent.showSuggestionBox()" class="msg_subject"><span
					class="font_r">意见箱</span></a>”中提出您的问题，将得到满意的回答。
			</div>
		</div>
	</div>
	<div class="error_bot"></div>
</div>