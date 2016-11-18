
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,layout,grid,dateTime,combox,tree"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="biz/hr/attendance/baseInfo/WorkShift.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<div id="layout">
				<div position="left" title="排班组织" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="工作班次设置">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<x:hidden name="orgId" />
						<x:hidden name="schOrgId" />
						<x:hidden name="schOrgName" />
						<x:hidden name="schFullName" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<div class="row">
								<x:inputL name="workShiftName" required="false" label="班次名称" maxLength="64"/>
								<x:selectL name="workKind" label="工种类型" />
							</div>
							<div class="row">
								<x:inputL name="fullName" required="false" label="排班组织名称" width="455"/>
								<dl>
									<x:button value="查 询" onclick="query(this.form)" />
								</dl>
							</div>
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
