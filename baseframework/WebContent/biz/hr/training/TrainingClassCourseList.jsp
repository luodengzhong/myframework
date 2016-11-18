<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree"/>
  	  	<script  src='<c:url value="/biz/hr/training/TrainingClassCourse.js"/>' type="text/javascript"></script>
  	  	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  		<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  		<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="班级课程" hideTable="queryDiv"/>
	  		<x:hidden name="trainingSpecialClassId"/>	
	  		<x:hidden name="trainingLevel"/>	
	  		<x:hidden name="classStatus"/>	
	  		<x:hidden name="isNewStaffTrain"/>				
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
		    <x:hidden name="trainingClassCourseId"/>
		    <x:inputL name="courseName" required="false" label="课程名称" maxLength="22"/>					
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"  style="margin: 2px"></div>
		</div> 
	</div>
  </body>
</html>
