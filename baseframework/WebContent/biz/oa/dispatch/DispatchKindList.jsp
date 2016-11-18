<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,date,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/dispatch/DispatchKindList.js"/>' type="text/javascript"></script>
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
				<div position="center" title="文件编号类别">
					<x:hidden name="organId" id="mainOrganId"/>
					<x:hidden name="organName" id="mainOrganName"/>
					<x:hidden name="fullId" id="mainFullId"/>
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="code" required="false" label="编码"   labelWidth="60"/>
							<x:inputL name="name" required="false" label="名称"  labelWidth="50"/>	
							<x:hidden name="dispatchKindTypeId" id="mainDispatchKindTypeId"/>
							<x:inputL name="dispatchKindTypeName" required="false" label="类别"  labelWidth="50" wrapper="tree"/>
							<div class="clear"></div>
							<x:selectL name="loopRule" required="false" label="循环规则"  labelWidth="60" list="dispatchLoopRule"/>	
							<x:selectL name="status" required="false" label="状态"  labelWidth="50" list="#{1:'启用',-1:'停用'}"/>	
							<dl>
								<dd style="width:100px;"><x:checkbox name="isAllShow" label="下级规则" /></dd>
								<dd><x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
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
