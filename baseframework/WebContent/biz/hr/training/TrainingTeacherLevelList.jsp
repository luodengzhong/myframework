<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	<script  src='<c:url value="/biz/hr/training/TrainingTeacherLevel.js"/>' type="text/javascript"></script>
  </head>
  <body>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="培训讲师级别" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
		     <x:hidden name="levelId"/>
		     <x:inputL name="teacherLevelName" required="false" label="讲师级别" maxLength="64"/>					
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px"></div>
		</div> 
	</div>
  </body>
</html>
