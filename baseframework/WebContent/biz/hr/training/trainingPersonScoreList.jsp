<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="layout,tree,dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/training/trainingPersonScoreList.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  	    <div id="layout">
	  	    <div style="color: red;font-size: 25" align="center">员工[${personMemberName}]&nbsp;${year}年总培训学分&nbsp;[&nbsp;${totalGainCredit}&nbsp;]&nbsp;分 </div>
	  	    <div position="center" title="培训明细">
	  		<x:title title="培训明细" hideTable="queryDiv"/>
			<form method="post" action="" id="submitForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
			    <x:hidden name="year"/>
			     <x:hidden name="personId"/>
				<x:inputL name="startTime" required="false" label="开始日期" wrapper="date"/>	
				<x:inputL name="endTime" required="false" label="结束日期" wrapper="date"/>
			<dl>
				<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
				<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
			</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px"></div>
			</div>
			</div>
		</div> 
	</div>
  </body>
</html>
