<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
	<script src='<c:url value="/biz/hr/training/TrainingLessonFee.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:title title="课时费" hideTable="queryDiv"/>
			<div class="ui-form" id="queryDiv" style="width:900px;">
			<form method="post" action="" id="queryMainForm">
					<x:hidden name="trainingLessonFeeId"/>
					<x:inputL name="trainingTeacherName" required="false" label="讲师姓名" maxLength="32"/>
					<x:selectL name="status" list="lessonFeeStatusValues" required="false" label="课时费状态"
							   maxLength="32"/>
					<div class="clear"></div>
					<x:selectL list="years" name="year" required="false" label="年度" maxLength="22"/>
					<x:selectL list="months" name="month" required="false" label="月度" maxLength="22"/>
					<x:select list="teacherLevels" name="teacherLevel" emptyOption="false" cssStyle="display:none"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			 </form>
			</div>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
  </body>
</html>
