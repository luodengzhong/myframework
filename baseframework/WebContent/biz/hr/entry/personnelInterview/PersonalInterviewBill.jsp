<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,layout,tree" />
<script
	src='<c:url value="/biz/hr/entry/personnelInterview/PersonalInterviewBill.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
          <div class="subject">转正面谈</div>
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;">
					<x:layout proportion="80px,160px,100px,160px,100px,160px" />
					<tr>
						<x:hidden name="id" />
						<x:hidden name="taskId"/>
						<x:inputTD name="staffName" required="false" label="被面谈人姓名"
							maxLength="22"  readonly="true"/>
						<x:inputTD name="centreName" required="false" label="员工所属中心"
						readonly="true" />
							<x:inputTD name="posName" required="false" label="员工所在岗位"
						readonly="true" />
						
					</tr>
					<tr>
						
						
						<x:inputTD name="invTime" required="true" label="面谈时间"
							maxLength="7"  wrapper="date"/>
						<x:inputTD name="invPlace" required="true" label="面谈地点"
							maxLength="64" />
						<x:selectTD name="invType" required="false" label="面谈类型"
							maxLength="1"  disabled="true"/>
					</tr>
					<tr>
						<x:textareaTD name="invContent" required="true" label="面谈内容"
							maxLength="1024"  rows="5" colspan="5"/>
						
					</tr>
				</table>
			</form>

		</div>
</body>
</html>

