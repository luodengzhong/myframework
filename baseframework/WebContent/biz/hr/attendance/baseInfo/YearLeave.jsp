
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,layout,grid,dateTime,combox,tree"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="biz/hr/attendance/baseInfo/YearLeave.js"/>' type="text/javascript"></script>
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
				<div position="center" title="截止年底年假查询">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<x:hidden name="orgId" />
						<x:hidden name="personId" />
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<div class="row">
								<x:inputL name="year" label="业务年" required="true" cssStyle="width:80px;" width="60"/>
								<x:inputL name="personName" required="false" label="姓名" wrapper="select"/>
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
