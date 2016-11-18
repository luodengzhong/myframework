<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,date,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/PayPublic.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/staffwelfare/SocialSecurityList.js"/>' type="text/javascript"></script>
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
				<div position="center" title="社保明细">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="createBeginDate" required="false" label="导入日期起" wrapper="date"/>	
							<x:inputL name="createEndDate" required="false" label="导入日期止" wrapper="date"/>
							<x:inputL name="personMemberName" required="false" label="导入人" maxLength="64" />
							<x:selectL name="isEffect" label="是否执行" dictionary="yesorno"/>
							<x:inputL name="archivesName" required="false" label="姓名" maxLength="64" />
						    <x:hidden name="orgUnitId"/>
							<x:inputL name="orgUnitName" label="工资主体单位" required="false"  wrapper="tree"/>
							<x:inputL name="year" required="false" label="业务年"  width="80" spinner="true"/>
							<x:hidden name="periodId"/>
							<x:inputL name="periodName" label="业务期间" required="false" wrapper="select"/>
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
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
