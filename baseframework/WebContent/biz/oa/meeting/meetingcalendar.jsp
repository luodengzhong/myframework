<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<html>
<head>
<title>会议日程</title>
<x:base include="layout,date,combox,dialog,tree"/>
<link href='<c:url value="/themes/default/fullcalendar/fullcalendar.css"/>' rel='stylesheet' type='text/css'/>
<link href='<c:url value="/themes/default/fullcalendar/fullcalendar.print.css"/>' rel='stylesheet' type='text/css' />
<link href='<c:url value="/themes/default/fullcalendar/theme.css"/>' rel='stylesheet' type='text/css'/>
<link href='<c:url value="/system/personOwn/workcalendar/style.css"/>' rel="stylesheet" type="text/css" />
<script src='<c:url value="/lib/jquery/ui/jquery.ui.core.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.widget.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.mouse.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.draggable.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/ui/jquery.ui.resizable.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/fullcalendar.min.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/meeting/meetingcalendar.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
		<div id="layout">
				<div position="left" title="查询">
					<div  style="margin-left:10px">
						 <x:select list="meetingStatusList" emptyOption="false"
								id="meetingStatusId" cssStyle="display:none;" />
						<form method="post" action="" id="queryMainForm">
							<div class="row" style="padding-bottom:5px; ">
								<x:hidden name="meetingRoomId"/>
								<x:inputL name="meetingRoomName" label="会议室" width="180" wrapper="select"/>
							</div>
							<div class="row" style="padding-bottom:5px; ">
								<x:hidden name="meetingKindId"/>
								<x:inputL name="meetingKindName" id="selectViewMeetingKind" required="false" label="会议类型" width="180" wrapper="tree"/>
							</div>
							<div class="row" style="padding-bottom:5px; ">
								<x:inputL name="keywords" required="false" 	label="议题关键字" readonly="false" width="180" />
							</div>
							<div class="row" style="padding-bottom:5px; ">
								<x:hidden name="personId"/>
								<x:inputL name="personName" required="false" label="相关人员" width="180" wrapper="select"/>
							</div>
							<div class="row">
								<div style="text-align:center"><x:button value="查 询" id="btnQuery" onclick="doQuery()" /></div>
							</div>
							<div class="row">&nbsp;</div>
						</form>
					</div>
				</div>
				<div position="center" style="border:0px;overflow-y: auto">
    				<div id='calendarMain'>
				<div id='calendar'></div>
			</div>
		</div>
		</div>
	</div>
</div>
</body>
</html>
