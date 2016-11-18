<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
  	<script src='<c:url value="/biz/hr/talentschosen/speechscoreresult/SpeechScoreResultAduit.js"/>' type="text/javascript"></script>
   	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
   	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
      <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  </head>
  <body>
  <div class="ui-form" style="width: 99%;">
  <div class="subject"><td>${title}</td></div>
  <form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout/>
	     <tr>
		<x:hidden name="resultAduitId"/>
		<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="status"/>
		<x:hidden name="chosenCenterId"/>
		<x:inputTD name="organName" required="false" label="机构名称" maxLength="64"  disabled="true"/>		
		<x:inputTD name="fillinDate" required="false" label="填表日期"  wrapper="date" disabled="true"/>		
		<x:inputTD name="billCode" required="false" label="单据号码" disabled="true"/>
		</tr>
		<tr>			
		<x:inputTD name="deptName" required="false" label="部门名称" disabled="true"/>
		<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>		
		<x:inputTD name="personMemberName" required="false" label="申请人" disabled="true"/>	
		</tr>	
		<tr>
		<x:textareaTD name="desption" required="false" label="备注" maxLength="512"  colspan="5"  rows="4"/>		
	     </tr>
	</table>
		<x:fileList bizCode="speechScoreResult" bizId="resultAduitId" id="speechScoreResultFileList" />
		<div class="blank_div"></div>
			<x:title title="评分结果列表"  name="group"/>
			<div id="maingrid"  style="margin: 2px;"></div>
  </form>
  </div>
 </body>
</html>