
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,dateTime,combox,tree" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script
	src='<c:url value="/biz/hr/salarysubject/BudgetsujbectOrgDetailList.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<!--  <div class="ui-form l-layout-header"  style="text-align: center;width:300px;margin-left:500px;margin-top:10px;">
	     <x:selectL name="wageAffiliation" required="true" label="归属" cssStyle="dd text-align: center;positio:center "/>
	</div>-->
	<div class="mainPanel">
		<x:hidden name="parentId" />
		<x:hidden name="setbookId" />
		<x:hidden name="budgetsubjectPersonId" />
		<div class="subject" id="showTitleDiv">维护对应组织</div>
		<table class='tableInput ' style="width: 100%;">
			<x:layout proportion="20%,20%,10%,14%,36%" />
			<tr>
				<td class="title">帐套：<strong>${setbookName}</strong></td>
				<td class="title">预算主体：<strong>${budgetSubject}</strong></td>
				<td class="title" colspan="4">负责人：<strong>${budgetsubjectPersonName}</strong></td> 
				<!--<x:inputTD name="budgetsubjectPersonName" required="true" label="负责人" width="260" wrapper="select"/>-->
			</tr>
		</table>
	    <div class="blank_div"></div>
		<div id="budgetSubjectDetailGrid"></div>		
	</div>
</body>
</html>
