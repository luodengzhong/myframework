<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="shareDocumentForm">
	<table class='tableInput' style="width: 99.9%;">
		<x:layout proportion="20%,80%"/>
		<tr>
			<td class="title"><span class="labelSpan">共享给<font color="#ff0000">*</font>&nbsp;:</span></td>
			<td class="edit">	
				<div id="sharePersonShowDiv" style="min-height:25px;line-height:23px;" class="textSearch"></div>
			</td>
		</tr>
		<tr>
			<x:radioTD list="#{'visit':'仅在线查看','download':'可下载','edit':'编辑'}" name="authorityKind"  value="visit"  label="文件权限" labelWidth="80" width="350"/>
		</tr>
		<tr>
			<td class="title"><span class="labelSpan">发送通知&nbsp;:</span></td>
			<td class="title" style="min-height:25px;line-height:23px;">	
				<x:checkbox name="isSendNotice" value="1" label="发送通知"/>
			</td>
		</tr>		
		<tr>
			<x:textareaTD name="remark" required="false" label="邀请文字" maxLength="100" rows="3" labelWidth="80" width="350"/>	
		</tr>
	</table>
</form>