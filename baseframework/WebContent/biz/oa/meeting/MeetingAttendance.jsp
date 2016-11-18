
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,layout,grid,dateTime,combox,tree"/>
  	<script src='<c:url value="/biz/oa/meeting/MeetingAttendance.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="参会人员查看">
					<form method="post" action="" id="queryMainForm">
					<div class="ui-form" id="queryDiv" style="width:900px;">
						<x:hidden name="meetingId"/>	
						<x:hidden name="fullId" />								
						<x:inputL name="personName" required="false" label="姓名" maxLength="64"/>											
						<dl>
							<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						</dl>
					</div>
					</form>
					<x:select list="attendanceFlgList" emptyOption="false"
								id="attendanceFlg" cssStyle="display:none;" />
					<div id='meetingAttendanceTab' style="width:99%;margin: 0px;margin-top: 5px;">
						<div class="ui-tab-links">
							<ul style="left:10px;">
								<li id="participate">参会人员</li>
								<li id="attendance">列席人员</li>
							</ul>
						</div>
						<div class="ui-tab-content"  style="padding: 2px;">
							<div class="layout" id="showParticipate">
								<div id="participateGrid"></div>
							</div>
							<div class="layout" id="showAttendance" >
								<div id="attendanceGrid"></div>
							</div>
						</div>
					</div>
				</div> 
			</div>
		<div>
	</div>
  </body>
</html>
