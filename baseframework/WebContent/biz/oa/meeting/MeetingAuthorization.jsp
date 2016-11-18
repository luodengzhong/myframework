<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,attachment" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/meeting/MeetingAuthorization.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">专委会会议授权委托书</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;">
			 单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;
			 制单日期：<strong><x:format name="fillinDate" type="date" /></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
			 制单人：
			 	<c:choose>
					<c:when test="${deputyFlag}">
						<strong><c:out value="${deputyName}" /></strong>
					</c:when>
					<c:otherwise>
						<strong><c:out value="${personMemberName}" /></strong>
					</c:otherwise>
				</c:choose>
			</span>
		</div>
		<form method="post" action="" id="submitForm">
			<x:hidden name="meetingLeaveId" />
			<x:hidden name="organId" />
			<x:hidden name="centerId" />
			<x:hidden name="centerName" />
			<x:hidden name="deptId" />
			<x:hidden name="positionId" />
			<x:hidden name="personMemberId" />
			<x:hidden name="agentPersonMemberId" />
			<x:hidden name="fullId" />
			<x:hidden name="organName" />
			<x:hidden name="fillinDate" type="date" />
			<x:hidden name="billCode" />
			<x:hidden name="meetingKindId" />
			<x:hidden name="deputyIdTemp" />
			<x:hidden name="deputyFullIdTemp" />
			<x:hidden name="deputyNameTemp" />
			<x:hidden name="isAuthorization"/>
			<table class='tableInput' style="width: 99%;">
				<x:layout proportion="12%,14%,20%,14%,20%,5%,15%" />
				<tr>
					<td class="title"><span class="labelSpan">委托人&nbsp;:</span></td>
					<x:inputTD name="personMemberName" required="true" label="姓名" wrapper="select" />
					<x:inputTD name="positionName" readonly="true" required="false" label="职务" />
					<x:selectTD name="isSecretary" list="#{'0':'委员','1':'执行主任委员/秘书委员','3':'主任委员'}" label="类别" required="true"/>
				</tr>
				<tr>
					<td class="title"><span class="labelSpan">受托人&nbsp;:</span></td>
					<x:inputTD name="agentPersonMemberName" required="true" label="姓名" maxLength="32" wrapper="select" />
					<x:inputTD name="agentPositionName" readonly="true" required="false" label="职务" />
					<td class="title" colspan="2">&nbsp;</td>
				</tr>
				<tr>	
					<x:inputTD name="meetingKindName" required="true" label="会议类型" wrapper="tree"/>
					<x:hidden name="meetingId" />
					<x:inputTD  name="subject" required="true" label="会议主题及时间"  readonly="true" colspan="2" wrapper="tree"/>
					<td class="edit" colspan="2"><x:input name="meetingDate" required="true" label="时间"  readonly="true" mask="date"/></td>
				</tr>
				<tr>
					<x:textareaTD name="remark" label="本次会议审议议案" required="true" maxlength="210" rows="3" colspan="4" />
					<td class="title" colspan="2">本次议案由受托人代表本人行使权利，由此产生的权利义务及责任均由本人享有和承担。</td>
				</tr>
			</table>
			 <x:title title="本人关于本次议案的专业意见及表决意见"  name="group"/>
			 <table class='tableInput' style="width: 99%;">
				<x:layout proportion="12%,88%" />
				<tr>
					<x:textareaTD name="recommendation" label="专业意见" required="true" maxlength="500" rows="5" />
				</tr>
				<tr>
					<x:textareaTD name="vote" label="表决意见" required="true" maxlength="500" rows="5"/>
				</tr>
			</table>
		</form>
		<div style="width: 99%;margin-top:5px; " id="approverList">
			<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve" bizId="bizId" />
		</div>
	</div>
</body>
</html>
