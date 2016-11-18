<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/permissionField/addPermissionField.js"/>' type="text/javascript"></script>
</head>
<body>
	<x:hidden name="functionId"/>
	<x:hidden name="mainFunctionFieldGroupId"/>
	<div class="mainPanel" style="padding-top:10px;">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="字段分组">
					<div id="typeToolBar" style="border-right:0px;border-left:0px;"></div>
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;height:290px;" id="groupList">
						<c:forEach items="${functionFieldGroup}" var="group" >
							 <div style="padding-left:10px;padding-top:2px;line-height:22px;">
								 <a href='javascript:void(null);' class="GridStyle"
								 	groupId="<c:out value="${group.functionFieldGroupId}"/>"
								 	code="<c:out value="${group.code}"/>"
								 >
								 	<c:out value="${group.name}"/>
								 </a>
							 </div>
					    </c:forEach>
					</div>
				</div>
				<div position="center" title="字段列表">
					<x:select name="fieldType" emptyOption="false" style="display:none;"/>
					<x:select name="fieldAuthority" emptyOption="false" style="display:none;"/>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
