
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid,layout,combox,attachment,dialog" />
<script src='<c:url value="/biz/oa/meeting/MeetingAttendanceDetermine.js"/>' type="text/javascript"></script>
</head>
<body>
	<x:hidden name="organId" />
<div class="mainPanel">
	<div id="mainWrapperDiv">
	<table class="tableInput" id="mainInfo" style="width: 99%">
		<x:layout proportion="12%,88%"/>
	  <tr>
	    <x:inputTD name="subject" readonly="true" labelWidth="80" label="会议主题"/>
	  </tr>
	  <tr>
	    <x:inputTD name="meetingKindName" readonly="true" labelWidth="80" label="类型"/>
	  </tr>
	  <tr>
	   	<x:inputTD name="meetingTime" readonly="true" labelWidth="80" label="时间"/>
	  </tr>
	  <tr>
	  	<x:inputTD name="meetingPlace" readonly="true" labelWidth="80" label="地点"/>
	  </tr>
	  <tr>
	  	<x:selectTD name="signIn" readonly="true" label="是否签到" dictionary="yesorno"/>			
	  </tr>
	  <tr>
	  	<x:selectTD name="signOut" readonly="true" label="是否签退" dictionary="yesorno"/>
	  </tr>
	  <tr>
	  	<x:inputTD name="managerName" readonly="true" labelWidth="80" label="主持人"/>
	  </tr>
	  <tr>
	  	<x:inputTD name="dutyName" readonly="true" labelWidth="80" label="召集人"/>
	  </tr>
	  <tr>
	    <x:inputTD name="recorderName" readonly="true" labelWidth="80" label="记录人"/>
	  </tr>
	  <tr>
	    <x:inputTD name="meetingParticipate" readonly="true" labelWidth="80" label="参会人员"/>
	  </tr>
	  <tr>
	    <x:inputTD name="meetingAttendance" readonly="true"  labelWidth="80" label="列席人员"/>
	  </tr>
	  <tr>
	  	 <x:textareaTD name="description" readonly="true" rows="3" labelWidth="80" label="会议描述"/>
	  </tr>
	</table>
	<div class="blank_div"></div>
	<div id="meetingTopicGrid"></div>
	<form method="post" action="" id="submitForm">
		<x:hidden name="planAttendanceId" />
		<x:hidden name="agentPersonMemberId" />
		<x:hidden name="agentPersonId" />
		<x:hidden name="taskId"/>
		<x:hidden name="meetingId" id="meetingId" />
		<x:hidden name="personMemberId" />
		<x:hidden name="personId" />
		<x:hidden name="personName" />
		<x:hidden name="sequence" />
		<x:hidden name="needSign" />
		<x:hidden name="attendanceKindId" />
		<x:hidden name="signInFlag" value="正常"/>
		<x:hidden name="signOutFlag" value="正常"/>
		<table class='tableInput' style="width: 99%;border-top-style:none">
			<tr>
				<x:selectTD name="attendanceFlag"  emptyOption="false" required="true" label="参会状态" list="attendanceFlgList"/>
				<x:inputTD name="agentPersonName" required="false" label="代理人" wrapper="select"/>
			</tr>
			<tr>
				<x:textareaTD name="refuseReason" required="false" readonly="true" label="不参会原因说明" maxLength="512" width="744" rows="4" colspan="3">
				</x:textareaTD>
			</tr>
		</table>
	</form>
	<x:fileList bizCode="OAMeeting" bizId="meetingId" id="meetingFileList"/>
	</div>
</div>
</body>
</html>