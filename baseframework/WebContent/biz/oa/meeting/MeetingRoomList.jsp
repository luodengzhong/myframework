
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,tree,grid,dateTime,combox"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/oa/meeting/MeetingRoom.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="会议室资源定义" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="meetingRoomId"/>									
		<x:inputL name="name" required="false" label="名称" maxLength="64"/>											
		<x:hidden name="ownerId"/>
		<x:inputL name="ownerNameQ" required="false" label="所有者" labelWidth="60" width="180" wrapper="tree"/>
		<x:selectL name="supportVideo" required="false" label="是否支持视频" dictionary="yesorno"/>														
		<x:selectL name="status" required="false" label="是否启用" dictionary="yesorno"/>
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
