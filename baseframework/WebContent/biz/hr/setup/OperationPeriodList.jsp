<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,layout,grid,date,tree,combox" />
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/setup/OperationPeriod.js"/>' type="text/javascript"></script>
  </head>
  <body>
  <div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="机构" id="mainmenu">
					<div style="margin: 5px;margin-left: 10px;"><a href="##" class="GridStyle" onclick="onFolderTreeNodeClick()">默认期间设置</a></div>
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="业务处理期间">
					<form method="post" action="" id="queryMainForm">
					<x:hidden name="organId" id="mainOrganId"/>
					<div class="ui-form" id="queryDiv" style="width: 900px;"><x:hidden name="organId" id="mainOrganId" />
						<dl>
							<dt style="width: 60px;">业务年&nbsp;<font color='red'>*</font>&nbsp;:</dt>
							<dd style="width: 80px;"><x:input name="year" required="true" label="业务年" maxLength="4" cssStyle="width:80px;" /></dd>
						</dl>
						<dl>
							&nbsp;&nbsp;<x:button value="初始化" onclick="initPeriod(this.form)"  id="initMainPeriod"/>
							&nbsp;&nbsp;<x:button value="按组织刷新日期" onclick="showUpdateOrgPeriod()"  id="updateOrgPeriod"/>
							&nbsp;&nbsp;<x:button value="查 询" onclick="query(this.form)" />
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
