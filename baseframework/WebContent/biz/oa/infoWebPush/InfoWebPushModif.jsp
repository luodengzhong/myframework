<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div class="bill_info">
	<span style="float: left; margin-left: 10px;"> 
		单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp; 
		制单日期：<strong><x:format name="fillinDate" type="date" /></strong>
	</span> 
	<span style="float: right; margin-right: 10px;"> 
		发送人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
	</span>
</div>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout />
		<tr>
			<x:hidden name="webPushAuditId" />
			<x:inputTD name="subject" disabled="true" label="主题" maxLength="60" colspan="5" />
		</tr>
		<tr>
			<x:inputTD name="effectiveTime" label="开始时间" required="true" wrapper="date" />
			<x:inputTD name="invalidTime" label="作废时间" required="true" wrapper="date" />
			<x:inputTD name="sequence" label="优先级系数" required="true" mask="nnnn" />
		</tr>
		<tr>
			<x:hidden name="infoPromulgateId"  id="modifInfoPromulgateId"/>
			<x:inputTD name="infoSubject"  label="信息"  colspan="3"  required="true" wrapper="select" id="modifInfoSubject"/>
			<x:inputTD name="infoBillCode" label="信息编号" readonly="true"  id="modifInfoBillCode"/>
		</tr>
		<tr>
			<x:textareaTD name="remark" disabled="false" label="备注" rows="3" maxlength="200" colspan="5" />
		</tr>
		<tr>
			<td class='title'><span class="labelSpan">弹屏范围&nbsp;:</span></td>
			<td class="title" colspan="4"><div id="pushRangeShowDiv" style="min-height: 25px; line-height: 25px;"></div></td>
			<td class="title">
				<a href='##' class="addLink" id="pushRangeChooseLink" onclick='showChooseOrgDialog()'>选择</a>&nbsp;&nbsp;
				<a href='##' class="clearLink" id="pushRangeClearLink" onclick='clearChooseArray()'>清空</a>
			</td>
		</tr>
	</table>
</form>

