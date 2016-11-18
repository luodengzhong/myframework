
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
	  <x:base include="dialog,layout,grid,dateTime,combox"/>
	  <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script> 
    <script src='<c:url value="/biz/oa/task/adjust/EarlyWarningAdjustByList.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv"><!-- 4A\5A调整记录 -->
			<form method="post" action="" id="queryMainForm">
		<x:hidden name="projectId"/>  <!-- 时间,月份 -->
		<x:hidden name="warningTypeId"  value = "1" />
			</form>
			<div class="blank_div"></div>
			<div id="taskAdjustGrid"></div>
		</div> 
	</div>
  </body>
</html>
