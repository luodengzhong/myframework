<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree" />
<script
	src='<c:url value="/biz/hr/paformMake/ManyPerformAssessFormBill.js"/>'
	type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">360度民主测评</div>
		<form method="post" action="" id="submitForm">
			<div class="bill_info">
				<span style="float: right;"> 单据号码：<strong><c:out
							value="${billCode}" /></strong> &nbsp;&nbsp;&nbsp; 填表日期：<strong><x:format
							name="fillinDate" type="date" /></strong> &nbsp;&nbsp; 经办人:<strong><c:out
							value="${personMemberName}" /></strong>
				</span>
			</div>
			<div class="blank_div"></div>
			<table class='tableInput' style="width: 99%;">
				<x:layout />
				<x:hidden name="formId" />
				<x:select name="scorePersonLevel" cssStyle="display:none;"
					id="scorePersonLevel" emptyOption="false" />



				<tr>
					<x:hidden name="assessId" />
					<x:inputTD name="assessName" required="true" label="被考评组织"
						wrapper="select" />
					<x:inputTD name="formName" required="true" label="考评表名称"
						colspan="3" />
				</tr>


				<tr>
					<x:hidden name="templetId" />
					<x:inputTD name="templetName" required="true" label="选择考评模板"
						wrapper="select" />
					<x:inputTD name="examBeginTime" required="true" label="考评开始时间"
						wrapper="date" />
					<x:inputTD name="examEndTime" required="true" label="考评结束时间"
						wrapper="date" />
				</tr>
			</table>
	    	
			<div class="blank_div"></div>
			<x:title title="考评指标" />
			<div id="maingrid"></div>
			
			<div class="blank_div"></div>
			<x:title title="该中心参与民主测评人员列表" />
			<div id="joinPersonId"></div>

		</form>
	</div>
</body>
</html>