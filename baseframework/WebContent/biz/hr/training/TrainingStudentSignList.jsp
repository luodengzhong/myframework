<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,attachment"/>
  	<script  src='<c:url value="/biz/hr/training/TrainingStudentSign.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="培训签到记录表" hideTable="queryDiv"/>
	  		<x:hidden name="trainingClassCourseId"/>
	  		<div class="ui-form" id="queryDiv" style="width:900px;">
			<form method="post" action="" id="queryMainForm">
				<x:hidden name="trainingStudentSignId"/>
				<x:hidden name="taskId"/>
				<x:inputL name="trainingStudentName" required="false" label="姓名" />					
				<x:selectL name="isSign" required="false" label="是否签到"  dictionary="yesorno"/>					
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<x:fileList bizCode="trainingStudentSign" bizId="trainingClassCourseId" id="trainingStudentSignFileList"  title="上传纸质培训签到表"/>
			<div>
			<span style="color:red;font-size: 14px;font-weight: normal;">同步学员列表：当培训签到表人数少于班级学员人数时，点击同步学员列表，培训签到表人员将和班级学员保持一致</span>
			</div>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px"></div>
		</div> 
	</div>
  </body>
</html>
