
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
	src='<c:url value="/biz/hr/salarysubject/SalarySubjectDetail.js"/>'
	type="text/javascript"></script>
</head>
<body>
	<!--  <div class="ui-form l-layout-header"  style="text-align: center;width:300px;margin-left:500px;margin-top:10px;">
	     <x:selectL name="wageAffiliation" required="true" label="归属" cssStyle="dd text-align: center;positio:center "/>
	</div>-->
	<div class="mainPanel">
		<x:hidden name="parentId" />
		<x:hidden name="setbookId" />
		<div class="subject" id="showTitleDiv">维护对应工资栏目</div>
		<table class='tableInput' style="width: 99%;">
			<x:layout proportion="20%,20%,10%,14%,36%" />
			<tr>
				<td class="title">帐套：<strong>${setbookName}</strong></td>
				<td class="title">科目：<strong>${subject}</strong>
				</td>
				<x:selectTD name="wageAffiliation" required="true" label="归属" />
				<td class="title">&nbsp;</td>
			</tr>
		</table>
		<div class="blank_div"></div>
		<table style="width: 100%;" border="0" >
			<tr>
				<td>
					<div id="addSalaryItem">
						<center>
							<strong>加项工资栏目</strong>
						</center>
						<div class="blank_div"></div>
						<div id="maingridAdd"></div>
					</div>
				</td>
				<td style="width: 5px;">&nbsp;</td>
				<td>
					<div id="excludeSalaryItem">
						<center>
							<strong>排除工资栏目</strong>
						</center>
						<div class="blank_div"></div>
						<div id="maingridMinus"></div>
					</div>
				</td>
			</tr>
		</table>

	</div>
</body>
</html>
