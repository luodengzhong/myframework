<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
   <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
   <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
   <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/hr/performanceassess/updateAssessTask/PerformanceAssessProgress.js"/>' type="text/javascript"></script> 
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<div class="subject">跟踪绩效考核表更新进度</div>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	    <tr>
		<x:hidden name="progressId"/>
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
		<x:select name="tempArchivesState" list="archivesState" cssStyle="display:none;"/>
		<x:inputTD name="fillinDate" required="false" label="填表日期" maxLength="7"  wrapper="date"  disabled="true"/>		
		<x:inputTD name="personMemberName" required="false" label="经办人" maxLength="32"  disabled="true"/>		
		<x:inputTD name="billCode" required="false" label="单据编号" maxLength="32"  disabled="true"/>	
		</tr>
		<tr>	
		<x:inputTD name="year" required="true" label="考核年" maxLength="4"  />		
		<x:selectTD  name="periodCode"   list="period"  required="true" label="考核周期" maxLength="64"/>		
		<x:inputTD name="periodCodeName" required="true" label="考核时间" />
	     </tr>
	</table>
	<div class="blank_div"></div>
	  <div id="maingrid" style="margin: 2px;"></div>
 </form>
	</div>
</body>
</html>