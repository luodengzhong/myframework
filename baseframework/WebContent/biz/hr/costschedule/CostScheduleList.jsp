<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,layout,tree"/>
  	<script src='<c:url value="/biz/hr/costschedule/CostSchedule.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
			<div position="center" title="人力编制和成本情况列表">
	  		<x:title title="人力编制和成本情况一览表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
		     <x:hidden name="costScheduleId"/>
		     <x:inputL name="year" required="false" label="年" maxLength="4"   labelWidth="30"  width="120" mask="nnnn"/>					
		     <x:inputL name="month" required="false" label="月份"  labelWidth="38"  maxLength="22" width="120"  mask="nn"/>					
		     <x:inputL name="dptName" required="false" label="组织名称" maxLength="32"/>
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
  </body>
</html>
