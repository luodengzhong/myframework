<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,attachment" />
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/meeting/MeetingLeave.js?version=213"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">会 议 请 假 单</div>
		<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
			<form method="post" action="" id="submitForm">

				<x:hidden name="meetingLeaveId" id="meetingLeaveId" />
				<x:hidden name="organId" />
				<x:hidden name="centerId" />
				<x:hidden name="centerName" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="agentPersonMemberId" />
				<x:hidden name="positionName" />
				<x:hidden name="fullId" />
				<x:hidden name="status" value="0" />
				<x:hidden name="meetingKindId" />
				<x:hidden name="deputyIdTemp" />
				<x:hidden name="deputyFullIdTemp" />
				<x:hidden name="deputyNameTemp" />
				<table class='tableInput' style="width: 99%;">
					<x:layout proportion="14%,21%,12%,21%,10%" />
					<tr>
						<x:inputTD name="organName" disabled="true" required="false" label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" disabled="true" required="false" label="单据号码" maxLength="32" />
						<x:inputTD name="fillinDate" disabled="true" required="false" label="填表日期" maxLength="7" wrapper="dateTime" />
					</tr>
					<tr>
						<x:inputTD name="personMemberName" required="true" label="请假人" maxLength="32" wrapper="select"/>
						<x:inputTD name="deptName" required="false" label="部门" maxLength="32" />
						<x:inputTD name="deputyName" required="false" label="代填人" maxLength="32" readonly="true"/>
					</tr>
					<tr>
						<x:inputTD name="agentPersonMemberName" required="false" label="参会代理人" maxLength="32" wrapper="select" />
						<x:inputTD colspan="3" name="reason" required="true" label="请假原因" maxLength="64" />
					</tr>
					<tr>
						<x:selectTD name="isSystemMeeting" emptyOption="false" required="true" label="是否预订会议" dictionary="yesorno"/>
						<x:inputTD name="meetingKindName" required="true" label="会议类型" wrapper="select"/>
						<td class="title" colspan="2"></td>
					</tr>
				</table>
				<div style="display:none" id="systemMeeting">
					<table class='tableInput' style="width: 99%;" id="sMeeting">
						<x:layout proportion="14%,21%,12%,21%,10%" />
						<tr>
							<x:hidden name="meetingId" />
							<x:inputTD colspan="5" name="meetingName" required="false" label="会议名称" maxLength="32" wrapper="select"/>
						</tr>
						<tr>
							<x:inputTD name="startTime" required="false" label="会议开始时间" mask="dateTime" maxLength="7" readonly="true"/>
							<x:inputTD name="endTime" required="false" label="会议结束时间" maxLength="7" mask="dateTime" readonly="true"/>
							<td class="title" colspan="2"></td>
						</tr>
						<tr>
							<x:textareaTD name="meetingPlace" colspan="5" readonly="true" rows="3" labelWidth="80" label="会议室"/>
						</tr>
						<tr>
							<td class='title' colspan="1">
								<span class="labelSpan">
									加签审批人&nbsp;:&nbsp;
									<a href='##' class="GridStyle"  id="handlerChooseLink1"  onclick='showChooseHandlerDialog()'>选择</a>&nbsp;
									<a href='##' class="GridStyle"  id="handlerClearLink1"  onclick='clearChooseArray("handler")'>清空</a>
								</span>
							</td>
							<td class="title" colspan="5"><div id="handlerShowDiv1" style="min-height:25px;line-height:25px;"></div></td>
						</tr>
					</table>
				</div>
				<div style="display:none" id="noSystemMeeting">
					<table class='tableInput' style="width: 99%" id="nMeeting">
						<x:layout proportion="14%,21%,12%,21%,10%" />
						<tr>
							<x:inputTD colspan="5" name="subject" required="false" label="会议名称" maxLength="32"/>
						</tr>
						<tr>
							<td class='title' colspan="1">
								<span class="labelSpan">
									审批处理人&nbsp;:&nbsp;
									<a href='##' class="GridStyle"  id="handlerChooseLink2"  onclick='showChooseHandlerDialog()'>选择</a>&nbsp;
									<a href='##' class="GridStyle"  id="handlerClearLink2"  onclick='clearChooseArray("handler")'>清空</a>
								</span>
							</td>
							<td class="title" colspan="5"><div id="handlerShowDiv2" style="min-height:25px;line-height:25px;"></div></td>
						</tr>
					</table>
				</div>
				<table class='tableInput' style="width: 99%;" id="lMeeting">
					<x:layout proportion="14%,21%,12%,21%,10%" />
					<tr>
						<x:textareaTD name="remark" required="false" label="请假说明" maxLength="200" width="744" rows="3" colspan="5">
						</x:textareaTD>
					</tr>
				</table>
				
			</form>
			<div><x:fileList bizCode="OAMeetingLeave" bizId="meetingLeaveId" id="meetingLeaveFileList" /></div>
			<div class="blank_div"></div>
			<div style="width: 99%;" id="approverList">
				<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve" bizId="bizId" />
			</div>
		</div>
	</div>
</body>
</html>
