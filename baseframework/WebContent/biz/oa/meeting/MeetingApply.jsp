<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,attachment" />
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/meeting/MeetingApply.js?version=20160123"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div class="subject">会 议 申 请 单</div>
		<div class="ui-form" style="width: 100%; left: 0px; padding: 3px;">
			<form method="post" action="" id="submitForm">

				<x:hidden name="meetingId" id="meetingId" />
				<x:hidden name="organId" />
				<x:hidden name="centerId" />
				<x:hidden name="centerName" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="positionName" />
				<x:hidden name="fullId" />
				<x:hidden name="meetingKindId" />
				<x:hidden name="isStatistic" />
				<x:hidden name="dutyId" />
				<x:hidden name="managerId" />
				<x:hidden name="recorderId" />
				<x:hidden name="attManagerId" />
				<x:hidden name="freeFlow" />
				<x:select list="attendanceFlgList" emptyOption="false"
						id="attendanceFlg" cssStyle="display:none;" />
				<!-- 缓存类型字段，用于校验 -->
				<x:hidden name="aheadDays" />
				<table class='tableInput' style="width: 99%;">
					<x:layout proportion="10%,21%,12%,21%,10%" />
					<tr>
						<x:inputTD name="organName" disabled="true" required="false" label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" disabled="true" required="false" label="单据号码" maxLength="32" />
						<x:inputTD name="fillinDate" disabled="true" required="false" label="填表日期" maxLength="7" wrapper="dateTime" />
					</tr>
					<tr>
						<x:inputTD name="meetingKindName" required="true" label="会议类型" wrapper="select"/>
						<x:inputTD name="deptName" disabled="true" label="部门" maxLength="32" />
						<x:inputTD name="personMemberName" disabled="true" label="申请人" maxLength="32" />
					</tr>
					<tr>
						<x:inputTD colspan="5" name="subject" required="true" label="会议主题" maxLength="128" />
					</tr>
					<tr>
						<x:inputTD name="dutyName" required="true" label="会议召集人" wrapper="select"/>
						<x:inputTD name="managerName" required="true" label="主持人" wrapper="select"/>
						<x:inputTD name="recorderName" required="false" label="记录人" wrapper="select"/>
					</tr>
					<tr>
						<x:hidden name="nextMonthDate"/>
						<x:inputTD name="startTime" required="true" label="开始时间" mask="dateTime" maxLength="7" />
						<x:inputTD name="endTime" required="true" label="结束时间" maxLength="7" mask="dateTime" />
						<x:selectTD name="isVideo" emptyOption="false" required="true" label="是否视频会议" dictionary="yesorno"/>
					</tr>
					<tr>
						<x:selectTD name="signIn" emptyOption="false" required="true" label="是否签到" dictionary="yesorno"/>
						<x:selectTD name="signOut" emptyOption="false" required="true" label="是否签退" dictionary="yesorno"/>
						<td class="title" colspan="2"></td>
					</tr>
					<tr style="display:none" id="chooseLeaveHandlerTd">
						<td class='title' colspan="1">
							<span>
								&nbsp;&nbsp;&nbsp;请假审批人&nbsp;:<br>
								&nbsp;&nbsp;&nbsp;
								<a href='##' class="GridStyle"  id="leaveHandlerChooseLink"  onclick='showChooseHandlerDialog("leaveHandler")'>选择</a>&nbsp;
								<a href='##' class="GridStyle"  id="leaveHandlerClearLink"  onclick='clearChooseArray("leaveHandler")'>清空</a>
							</span>
						</td>
						<td class="title" colspan="5"><div id="leaveHandlerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					</tr>
					<tr style="display:none" id="chooseNoticeHandlerTd">
						<td class='title' colspan="1">
							<span>
								&nbsp;&nbsp;&nbsp;会议秘书&nbsp;:<br>
								&nbsp;&nbsp;&nbsp;
								<a href='##' class="GridStyle"  id="noticeHandlerChooseLink"  onclick='showChooseSecretaryDialog("noticeHandler")'>选择</a>&nbsp;
								<a href='##' class="GridStyle"  id="noticeHandlerClearLink"  onclick='clearChooseArray("noticeHandler")'>清空</a>
							</span>
						</td>
						<td class="title" colspan="5"><div id="noticeHandlerShowDiv" style="min-height:25px;line-height:25px;"></div></td>
					</tr>
					<tr>
						<x:textareaTD name="description" required="false" label="会议说明" maxLength="512" width="744" rows="3" colspan="5">
						</x:textareaTD>
					</tr>
				</table>
			</form>
			<div class="blank_div"></div>
							<table style="width:99%;" cellpadding='0' border='0' cellspacing='0'>
								<tr>
									<td width="45%" style="border:0">
										<div id="availableMeetingRoomGrid"></div>
									</td>
									<td width="10%" align="center" style="border:0">
										<div id="changeD" style="display:none">
											<div style="text-align:center"><x:button id="changeDate" value="时间变更" onclick="changeMeetingDate()"/></div>
											<div style="height:5px"></div>
										</div>
										<div style="text-align:center"><x:button id="addRoom" value="预订" onclick="chooseMeetingRoom()"/></div>
										<div style="height:5px"></div>
										<div style="text-align:center"><x:button id="cancelRoom" value="取消" onclick="unchooseMeetingRoom()"/></div>
									</td>
									<td width="45%" style="border:0">
										<div id="selectedMeetingRoomGrid"></div>
									</td>
								</tr>
							</table>
			<div class="blank_div"></div>		
			<div><x:fileList bizCode="OAMeeting" bizId="meetingId" id="meetingFileList" isClass="false" proportion="10%,90%"/></div>
			<div id="fileListTitle" style="display:none;padding-left:20px;color:red;"></div>
			
			<div id='meetingAttendanceTab' style="width:99%;margin: 0px;margin-top: 5px;">
				<div class="ui-tab-links">
					<h2 >设置</h2>
					<ul style="left:80px;">
						<li id="participate">参会人员</li>
						<li id="attendance">列席人员</li>
						<li id="meetingTopic">会议议题</li>
						<li id="meetingLeave">会议请假单</li>
						<li id="meetingCheck">会议打卡记录</li>
						<li id="meetingSummary">会议纪要</li>
					</ul>
				</div>
					<div class="ui-tab-content"  style="padding: 2px;">
						<div class="layout" id="showParticipate">
							<div id="participateGrid"></div>
						</div>
						<div class="layout" id="showAttendance" >
							<div id="attendanceGrid"></div>
						</div>
						<div class="layout" id="showMeetingTopic" >
							<div id="meetingTopicGrid"></div>
						</div>
						<div class="layout" id="showMeetingLeave" >
							<div id="meetingLeaveGrid"></div>
						</div>
						<div class="layout" id="showMeetingCheck" >
							<div id="meetingCheckGrid"></div>
						</div>
						<div class="layout" id="showMeetingSummary" >
							<div id="meetingSummaryGrid"></div>
						</div>
					</div>
				</div>
			<form method="post" action="" id="submitWfForm">
				<div style="width: 99%;margin-top:5px" id="approverList">
					<x:taskExecutionList procUnitId="Approve" defaultUnitId="Approve" bizId="bizId" />
				</div>
			</form>
		</div>
	</div>
</body>
</html>
