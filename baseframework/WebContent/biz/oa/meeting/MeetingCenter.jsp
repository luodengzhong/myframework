<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,combox,grid,dateTime,tree" />
<script src='<c:url value="/biz/oa/meeting/MeetingCenter.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<x:select list="meetingStatusList" emptyOption="false"
					id="meetingStatusId" cssStyle="display:none;" />
				<div position="left" title="会议" id="mainmenu" style="padding: 5px;">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<x:title title="我的会议" name="group" hideTable="#myselfMeetingSearch" />
						<div style="overflow-x: hidden; overflow-y: auto; width: 97%; background-color: #fafafa; border: #d0d0d0 1px solid;"
							id="myselfMeetingSearch">
							<div class="taskCenterSearch taskCenterChoose" meetingKind="1">
								<span class="ui-icon-next" style="margin-right: 2px;"></span>未完成会议
							</div>
							<div class="taskCenterSearch" meetingKind="2">
								<span class="ui-icon-next" style="margin-right: 2px;"></span>本人发起
							</div>
							<div class="taskCenterSearch" meetingKind="3">
								<span class="ui-icon-query" style="margin-right: 2px;"></span>结束会议
							</div>
							<div class="taskCenterSearch" meetingKind="4">
								<span class="ui-icon-query" style="margin-right: 2px;"></span>中止会议
							</div>
							<div class="taskCenterSearch" meetingKind="5">
								<span class="ui-icon-query" style="margin-right: 2px;"></span>所有会议
							</div>
						</div>
						<div class="blank_div"></div>
						<x:title title="会议搜索" hideTable="#divConditionArea"
							id="titleConditionArea" />
							<div style="padding-left: 10px; height: 250px;"
								id="divConditionArea">
							<form method="post" action="" id="queryMainForm">
								<div class="row" style="padding-bottom:5px; ">
									<x:inputL name="keywords" required="false" 	label="议题关键字" readonly="false" width="180" />
								</div>
								<div class="row" style="padding-bottom:5px; ">
									<x:inputL name="startDate" required="false"
											label="开始日期" wrapper="date" width="180" />
								</div>
								<div class="row" style="padding-bottom:5px; ">
									<x:inputL name="endDate" required="false"
										label="结束日期" wrapper="date" width="180" />
								</div>
								<div class="row" style="padding-bottom:5px; ">
									<x:hidden name="meetingRoomId"/>
									<x:inputL name="meetingRoomName" label="会议室" width="180" wrapper="select"/>
								</div>
								<div class="row" style="padding-bottom:5px; ">
									<x:hidden name="meetingKindId"/>
									<x:inputL name="meetingKindName" id="selectViewMeetingKind" required="false" label="会议类型" width="180" wrapper="tree"/>
								</div>
								<div class="row" style="padding-bottom:5px; ">
									<x:hidden name="personId"/>
									<x:inputL name="personName" required="false" label="相关人员" width="180" wrapper="select"/>
								</div>
								<div class="row">
									<div style="text-align:center">
										<x:button value="查 询" id="btnQuery" onclick="doQuery()" />
										<x:button value="重 置" onclick="resetForm(this.form)" />
									</div>
								</div>
								<div class="row">&nbsp;</div>
							</form>
						</div>
					</div>
				</div>
				<div position="center" title="详情列表" style="padding: 3px;">
					<div id="maingrid"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>