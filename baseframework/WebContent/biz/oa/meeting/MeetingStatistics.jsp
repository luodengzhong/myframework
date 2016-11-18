
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,tree,combox"/>
  	<script src='<c:url value="/biz/oa/meeting/MeetingStatistics.js?version=20151218"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:select list="meetingStatusList" emptyOption="false"
				id="meetingStatusId" cssStyle="display:none;" />
	  		<x:title title="会议统计查询" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">	
				<x:hidden name="meetingRoomId"/>
				<x:inputL name="meetingRoomName" label="会议室" width="180" labelWidth="60" wrapper="select"/>
				<x:hidden name="meetingKindId"/>
				<x:inputL name="meetingKindName" id="selectViewMeetingKind" labelWidth="60" required="false" label="会议类型" width="180" wrapper="tree"/>
				<x:hidden name="personId"/>
				<x:inputL name="personName" required="false" label="相关人员" labelWidth="60" width="180" wrapper="select"/>
				<x:inputL name="keywords" required="false" 	label="主题" labelWidth="60" readonly="false" width="180" />
				<x:inputL name="startDate" required="false" label="开始日期" labelWidth="60" width="140" wrapper="date" />
				<x:inputL name="endDate" required="false" label="结束日期" labelWidth="60" width="140" wrapper="date" />
				<dl>
					<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
					<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
				</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
	</div>
  </body>
</html>
