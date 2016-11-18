<%@ page language="java" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="permission" value="${sessionScope.PermissionInterceptorSet}"/>
var permissionAuthority={};
<c:forEach items="${permission}" var="p" >
permissionAuthority['<c:out value="${p.fieldCode}"/>']={authority:'<c:out value="${p.fieldAuthority}"/>',type:'<c:out value="${p.fieldType}"/>'};
</c:forEach>
<c:remove var="PermissionInterceptorSet"  scope="session"/>