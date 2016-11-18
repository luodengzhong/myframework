
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid,layout,combox,attachment,dialog" />
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/meeting/MeetingAttendanceNotice.js?version=111"/>' type="text/javascript"></script>
</head>
<body>
	<form method="post" action="" id="submitForm">
		<x:hidden name="meetingId" id="meetingId" />
		<x:hidden name="personMemberId" />
		<x:hidden name="isAttendance"/>
		<x:hidden name="meetingKindId" />
		<x:hidden name="taskId"/>
	</form>
<div class="mainPanel">
	<div id="mainWrapperDiv" style="width: 99%;height: 450px;overflow-y: auto;">
	<table class="tableInput" id="mainInfo" style="width: 99%;">
		<x:layout proportion="18%,32%,18%,32%"/>
	  <tr>
	    <x:inputTD name="subject" colspan="3" readonly="true" labelWidth="80" label="主题"/>
	  </tr>
	  <tr>
	    <x:inputTD name="meetingKindName" readonly="true" labelWidth="80" label="类型"/>
	    <x:inputTD name="billCode" readonly="true" labelWidth="80" label="单据编号"/>
	  </tr>
	  <tr>
	   	<x:inputTD name="meetingTime" colspan="3" readonly="true" labelWidth="80" label="时间"/>
	  </tr>
	  <tr>
	  	<x:textareaTD name="meetingPlace" colspan="3" readonly="true" rows="3" labelWidth="80" label="会议室"/>
	  </tr>
	  <tr>
	  	<x:selectTD name="signIn" readonly="true" label="签到" dictionary="yesorno"/>
	  	<x:selectTD name="signOut" readonly="true" label="签退" dictionary="yesorno"/>			
	  </tr>
	  <tr>
	  	<x:inputTD name="managerName" readonly="true" labelWidth="80" label="主持人"/>
	  	<x:inputTD name="dutyName" readonly="true" labelWidth="80" label="召集人"/>
	  </tr>
	  <tr id="chooseHandlerTd">
			<td class='title' colspan="1">
				<span>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我设置的参会人&nbsp;:
				</span>
			</td>
			<td class="title" colspan="2"><div id="handlerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
			<td class='title'><a href='##' class="GridStyle"  id="handlerChooseLink"  onclick='showChooseHandlerDialog("handler")'>选择</a>&nbsp;
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='##' class="GridStyle"  id="handlerClearLink"  onclick='clearChooseArray("handler")'>清空</a>
					<br>
					<a href='##' class="GridStyle"  id="handlerListLink"  onclick='viewMeetingPsm()'>查看所有参会人员</a>
					<br>
					<a href='##' class="GridStyle"  id="MeetingLeave"  onclick='createMeetingLeaveApply()'>当前会议请假</a>
			</td>
	  </tr>
	  <tr>
	  	 <x:textareaTD name="meetingTopic" colspan="3" readonly="true" rows="3" labelWidth="80" label="议题"/>
	  </tr>
	  <tr>
	  	 <x:textareaTD name="description" colspan="3" readonly="true" rows="3" labelWidth="80" label="会议说明"/>
	  </tr>
	</table>
	<x:fileList bizCode="OAMeeting" bizId="meetingId" id="meetingFileList"/>
	</div>
</div>
</body>
</html>