<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	<script  src='<c:url value="/biz/hr/train/trainingEffectEva/TrainingEffectEvaluateIndex.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="培训效果评估指标明细" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:99%;">
			<table class='tableInput' id='queryTable'>			
		<x:hidden name="trainingClassCourseId"/>
		<x:inputTD name="trainingCourseName" required="false" label="课程名称" maxLength="64"/>					
		<x:inputTD name="teacherName" required="false" label="讲师姓名" maxLength="64"/>		
		</table>			
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"  style="margin: 2px"></div>
		</div> 
	</div>
  </body>
</html>
