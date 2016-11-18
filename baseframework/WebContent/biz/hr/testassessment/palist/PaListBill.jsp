<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<x:base include="dialog,grid,dateTime,combox,tree"/>
  	<script src='<c:url value="/biz/hr/testassessment/palist/PaListBill.js"/>'   type="text/javascript"></script>

</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">员工晋升/转正/履职/民主测评名单选择</div>
         <form method="post" action="" id="submitForm">
              <div class="bill_info">
			  <span style="float:right;">
			     	单据号码：<strong><c:out value="${billCode}"/></strong>
			     	&nbsp;&nbsp;&nbsp;
					填表日期：<strong><x:format name="fillinDate" type="date"/></strong>
				</span>
		</div>
		<div class="blank_div"></div>
				<x:hidden name="formId"/>
		
	<table class='tableInput' style="width: 99%;">
	<x:layout />
		<x:select name="scorePersonLevel" cssStyle="display:none;" id="scorePersonLevel" emptyOption="false"/>
		
		
		     <x:hidden name="organId" />
				<x:hidden name="deptId" />
				<x:hidden name="positionId" />
				<x:hidden name="personMemberId" />
				<x:hidden name="fullId" />
				<x:hidden name="organName" />
				<x:hidden name="billCode" />
				<x:hidden name="deptName" />
				<x:hidden name="positionName" />
				<x:hidden name="personMemberName" />
				<x:hidden name="fillinDate" type="date"/>
				
			<tr>
				    <x:hidden name="assessId" />
					<x:inputTD name="assessName" required="false" label="被考核人"  wrapper="select"/>
					<x:inputTD name="assessDeptName" required="false" label="被考核人所在部门"  />
					<x:inputTD name="assessPostionName" required="false" label="被考核人岗位"  />
				</tr>
				<tr>
					<x:hidden name="templetId" />
				    <x:inputTD name="templetName" required="true" label="选择考评模板"  wrapper="select"/>
				    						<td class="title" colspan="4"></td>

				</tr>	
				
	</table>
		<div class="blank_div"></div>
	   <x:title title="晋升/转正/履职/民主测评人员名单" />
	  <div id="personMaingrid" ></div>
	
</form>
</div>
</body>
</html>