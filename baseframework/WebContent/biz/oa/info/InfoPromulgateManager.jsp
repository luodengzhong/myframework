<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/info/InfoManagerUtil.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/biz/oa/info/InfoPromulgateManager.js"/>' type="text/javascript"></script>
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
				<div position="center" title="信息列表">
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="billCode" required="false" label="单据号码" maxLength="32" />
							<x:inputL name="fillinBeginDate" required="false" label="填表日期起" wrapper="date" />
							<x:inputL name="fillinEndDate" required="false" label="填表日期止" wrapper="date" />
							<x:inputL name="keywords" required="false" label="关键字" maxLength="64" />
							<x:hidden name="infoKindId" />
							<x:inputL name="kindName" required="false" label="信息类别" maxLength="64" wrapper="tree"/>
							<x:inputL name="personMemberName" required="false" label="制单人" maxLength="64" />
							<x:inputL name="effectiveBeginDate" required="false" label="生效时间起" wrapper="date" />
							<x:inputL name="effectiveEndDate" required="false" label="生效时间止" wrapper="date" />
							<x:selectL name="priority" required="false" label="优先级"  list="infoPriority" />
							<div class="clear"></div>
							<x:selectL name="isFinalize" required="false" label="是否定稿" dictionary="yesorno"  width="100" labelWidth="50"/>
							<x:selectL name="status" label="状态" list="statusList"  width="70" labelWidth="50"/>
							<x:selectL name="hasFeedBack" required="false" label="反馈" dictionary="yesorno"  width="70" labelWidth="50"/>
							<dl style="padding-left:10px">
								<dd style="width:90px;"><x:checkbox name="isInvalid" label="失效信息" /></dd>
								<dd><x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
								</dd>
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
