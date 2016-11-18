<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div class="bill_info">
	<span style="float: left; margin-left: 10px;"> 
		单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;
		制单日期：<strong><x:format name="fillinDate" type="date"/></strong>
	</span> 
	<span style="float: right; margin-right: 10px;"> 
		发起人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
	</span>
</div>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="20%,30%,15%,35%" />
		<x:hidden name="weixinMessageSendId" id="detailWeixinMessageSendId" />
		<x:hidden name="organId" />
		<x:hidden name="deptId" />
		<x:hidden name="positionId" />
		<x:hidden name="personMemberId" />
		<x:hidden name="fullId" />
		<x:hidden name="organName" />
		<x:hidden name="fillinDate" type="date" />
		<x:hidden name="billCode" />
		<x:hidden name="status" />
		<x:hidden name="deptName" />
		<x:hidden name="positionName" />
		<x:hidden name="personMemberName" />
		<x:hidden name="status"  id="detailStatus"/>
		<tr>
			<x:hidden name="weixinMessageKindId"  id="detailWeixinMessageKindId"/>
			<x:inputTD name="weixinMessageKindName" required="true" label="发送类别" maxLength="30" wrapper="tree"/>
			<x:selectTD name="msgType"  label="发送类别" required="false" list="WeixinMsgTypeList" id="detailMsgType"/>
		</tr>
		<tr>
			<x:inputTD name="title" required="false" label="标题" maxLength="120" colspan="3" id="detailTitle" />
		</tr>
		<tr id="linkUrlTr">
			<x:inputTD name="linkUrl" required="false" label="连接地址" maxLength="120" colspan="3" id="detailLinkUrl"/>
		</tr>
		<tr>
			<x:textareaTD name="description" required="false" label="描述" maxLength="200" colspan="3" rows="3" id="detailRemark"/>
		</tr>
		<tr>
			<td class='title'><span class="labelSpan">消息接收人&nbsp;:&nbsp;</span></td>
			<td class="title" colspan="3"><div id="sendForShowDiv" style="min-height:25px;line-height:25px;"></div></td>
		</tr>
		<c:if test="${status==0}">
		<tr>
			<td class="title" colspan="4" style="text-align:right;line-height: 23px;">
				<a href='##' class="addLink"  onclick='showChooseOrgDialog()'>选择</a>&nbsp;&nbsp;
				<a href='##' class="clearLink"  onclick='clearChooseArray()'>清空</a>&nbsp;&nbsp;
				<a href='##' class="GridStyle"   onclick='checkChooseArray()'>验证接收人</a>
			</td>
		</tr>
		</c:if>
		<tr>
			<td class='title' style="line-height: 23px;"><span class="labelSpan">默认文件&nbsp;:&nbsp;</span></td>
			<td class="title" colspan="3"><div id="weixinMessageKindFileDiv"></div></td>
		</tr>
	</table>
</form>
<div class="blank_div"></div>
<x:fileList bizCode="weixinMessageSend" bizId="weixinMessageSendId" id="weixinMessageSendIdFileList"/>