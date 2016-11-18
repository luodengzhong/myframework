<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<x:base include="dialog,grid,dateTime,combox,tree"/>
  	<script src='<c:url value="/biz/hr/paformMake/OnePerformAssessFormBill.js"/>'   type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">员工晋升/转正/履职测评</div>
         <form method="post" action="" id="submitForm">
              <div class="bill_info">
			  <span style="float:right;">
			     	单据号码：<strong><c:out value="${billCode}"/></strong>
			     	&nbsp;&nbsp;&nbsp;
					填表日期：<strong><x:format name="fillinDate" type="date"/></strong>
					&nbsp;&nbsp;
					经办人:<strong><c:out value="${personMemberName}"/></strong>
				</span>
		</div>
		<div class="blank_div"></div>
	<table class='tableInput' style="width: 99%;">
	<x:layout />
		<x:hidden name="formId"/>
		<x:select name="scorePersonLevel" cssStyle="display:none;" id="scorePersonLevel" emptyOption="false"/>
		
				
				<tr>
				    <x:hidden name="assessId" />
					<x:inputTD name="assessName" required="true" label="被考评人"  wrapper="select"/>
					<x:selectTD name="sex" required="false" label="性别"  />
					<x:inputTD name="age" required="false" label="年龄"  />
				</tr>
				<tr>
				<x:inputTD name="employedDate" required="false" label="入职时间"  wrapper="date"/>
				<x:inputTD name="ognName" required="false" label="单位"  />
				<x:inputTD name="posName" required="false" label="现任职务"  />
				
				</tr>
				<tr>
				<x:hidden name="assessPosId"/>
				<x:inputTD name="assessPosName" required="false" label="拟任职位"  wrapper="select"/>
				<x:inputTD name="formName" required="true" label="考评表名称"  colspan="3"/>
				</tr>
				<tr>
					<x:hidden name="templetId" />
					<x:hidden name="paType"/>
				    <x:inputTD name="templetName" required="true" label="选择考评模板"  wrapper="select"/>
					<x:inputTD name="examBeginTime" required="true" label="考评开始时间"  wrapper="date"/>
					<x:inputTD name="examEndTime" required="true" label="考评结束时间" wrapper="date" />
				</tr>		
				
		<%-- <tr>
		<x:inputTD name="resaon" required="false" label="备注" maxLength="512"/>
	     </tr> --%>
	</table>
		<div class="blank_div"></div>
	  <div id="maingrid" ></div>
	
</form>
</div>
</body>
</html>