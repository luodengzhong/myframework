<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,tree,dialog,grid,dateTime,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="biz/hr/attendance/baseInfo/PeriodOnduty.js"/>' type="text/javascript"></script>
</head>
  <body>
  	  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<div id="layout">
				<div position="left" title="组织" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="期间特殊情况设置">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<x:hidden name="fullId" />
						<x:hidden name="positionId" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="year" label="业务年" required="true" cssStyle="width:80px;" width="60"/>
							<x:hidden name="periodId"/>
							<x:hidden name="organId"/>
							<x:inputL name="periodName" label="业务期间" required="true" wrapper="combo" width="220"/>
							<x:inputL name="positionName" label="组织岗位" wrapper="select"/>
							<x:inputL name="fullName" label="组织路径" width="430" labelWidth="70"/>
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
							</dl>
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

</html>
