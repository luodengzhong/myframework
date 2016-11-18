<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div id='setDocumentAuthTab' style="width:<c:out value="${width}"/>px;min-height: 320px;">
	<div class="ui-tab-links">
		<h2>权限设置</h2>
		<ul style="left: 80px;">
			<c:forEach items="${documentAuthKindList}" var="obj">
				<li id="${obj.key}" class="auth">${obj.value}权限</li>
			</c:forEach>
		</ul>
	</div>
	<div class="ui-tab-content" style="padding: 2px;">
		<c:forEach items="${documentAuthKindList}" var="obj">
			<div class="layout" id="${obj.key}Div">
				<c:choose>
				<c:when  test="${isViewAuth=='true'}">
				<div id="${obj.key}AuthGrid"></div>
				</c:when>
				<c:otherwise>
				<div id="${obj.key}ViewAuthGrid"></div>
				</c:otherwise>
				</c:choose>
			</div>
		</c:forEach>
	</div>
</div>
<c:if test="${isViewAuth=='true'}">
<form method="post" action="" id="setDocumentAuthForm">
<div style="line-height: 25px;vertical-align: middle;">权限继承:&nbsp;&nbsp;
<x:checkbox name="isManagePermissions"  label="管理权限"/>&nbsp;&nbsp;
<x:checkbox name="isVisitPermissions"  label="访问权限"/>&nbsp;&nbsp;
<x:checkbox name="isAddPermissions"  label="新建权限"/>&nbsp;&nbsp;
<x:checkbox name="isEditPermissions"  label="编辑权限"/>&nbsp;&nbsp;
<x:checkbox name="isDeletePermissions"  label="删除权限"/>&nbsp;&nbsp;
<x:checkbox name="isDownloadPermissions"  label="下载权限"/>&nbsp;&nbsp;
</div>
</form>
</c:if>