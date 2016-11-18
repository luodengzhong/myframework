<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/setup/UserGroupEditList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="我的分组" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="groupViewArea">
						<div style="margin: 5px;">
							<x:button value="新建用户组" onclick="doEditGroup()" />&nbsp;
							<x:button value="删除分组" onclick="doDelGroup()" />&nbsp;
						</div>
						<hr/>
						<div id="userGroupEditListDiv">
						<c:forEach items="${UserGroupEditList}" var="obj">
							<div class="list_view" style="margin: 5px;">
								<a href="javascript:void(0);" id="${obj.groupId}"  class="GridStyle">
									<c:out value="${obj.name}" />
								</a>
							</div>
						</c:forEach>
						</div>
					</div>
				</div>
				<div position="center" title="分组明细">
					<x:hidden name="groupId" id="mainGroupId" />
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv">
							<x:inputL name="keyCode" label="关键字" labelWidth="60" />
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
				<div position="right" title="组织查询条件">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
