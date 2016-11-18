<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,layout,grid,tree,combox" />
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/setup/OrgWageKindList.js"/>' type="text/javascript"></script>
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
				<div position="center" title="机构工资类别">
				  		<x:title title="" />
						<form method="post" action="" id="queryMainForm">
							<div class="ui-form" id="queryDiv" style="width:900px;">
							<x:hidden name="organId" id="mainOrganId"/>
							<x:hidden name="organName" id="mainOrganName"/>
							<x:hidden name="wageKindId" id="wageKindId"/>
							<x:inputL name="wageKind" required="true" label="工资类别标识" wrapper="select" />
							</div>
						</form>
						<div class="blank_div"></div>
						<div id="maingrid" style="margin: 2px;"></div>
					</div> 
				</div>
		  </div>
	</div>
  </body>
</html>
