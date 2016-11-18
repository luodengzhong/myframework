<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,layout,grid,tree,combox" />
	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
	<script src='<c:url value="/javaScript/PersonalPasswordAuth.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/archives/DecemberBonusList.js"/>' type="text/javascript"></script>
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
				<div position="center" title="员工信息">
				  		<x:title title="搜索" hideTable="queryDiv"/>
						<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width:950px;">
							<x:inputL name="staffName" label="姓名" maxLength="16" labelWidth="80" />
							<%-- <x:selectL name="wageKind" label="薪酬类别" labelWidth="80" /> --%>
							<x:selectL list="wageKindList" id="wageKind" name="wageKind" label="薪酬类别"  labelWidth="80" />
							<x:select name="tempArchivesState" list="archivesState" cssStyle="display:none;"/>
							<x:inputL name="state" label="状态" />
							<x:inputL name="orgInfo" label="组织信息" maxLength="16" labelWidth="80" />
							<dl>
								<dd style="width:220px;">&nbsp;&nbsp;
									<x:checkbox name="isProbationCheck" label="试用期员工" value="1"/>&nbsp;&nbsp;
									<x:checkbox name="isLeaveCheck" label="离职办理中" value="1"/>
								</dd>
							</dl>
							<x:inputL name="year" label="业务年" cssStyle="width:80px;" />
							<div class="clear"></div>
							<x:hidden  name="wageOrgId" />
							<x:inputL name="wageOrgName" label="工资主体单位"  wrapper="select" labelWidth="80"/>
								<dl>
									<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
									<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
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
