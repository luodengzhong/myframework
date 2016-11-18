<%@ page language="java" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="opr" value="${sessionScope.sessionOperatorAttribute}"/>
var ContextOperator={};
ContextOperator['fullId']='<c:out value="${opr.fullId}"/>';
ContextOperator['fullName']='<c:out value="${opr.fullName}"/>';
ContextOperator['fullCode']='<c:out value="${opr.fullCode}"/>';
ContextOperator['orgId']='<c:out value="${opr.orgId}"/>';
ContextOperator['orgCode']='<c:out value="${opr.orgCode}"/>';
ContextOperator['orgName']='<c:out value="${opr.orgName}"/>';
ContextOperator['centerId']='<c:out value="${opr.centerId}"/>';
ContextOperator['centerCode']='<c:out value="${opr.centerCode}"/>';
ContextOperator['centerName']='<c:out value="${opr.centerName}"/>';
ContextOperator['deptId']='<c:out value="${opr.deptId}"/>';
ContextOperator['deptCode']='<c:out value="${opr.deptCode}"/>';
ContextOperator['deptName']='<c:out value="${opr.deptName}"/>';
ContextOperator['positionId']='<c:out value="${opr.positionId}"/>';
ContextOperator['positionCode']='<c:out value="${opr.positionCode}"/>';
ContextOperator['positionName']='<c:out value="${opr.positionName}"/>';
ContextOperator['personMemberId']='<c:out value="${opr.personMemberId}"/>';
ContextOperator['personMemberCode']='<c:out value="${opr.personMemberCode}"/>';
ContextOperator['personMemberName']='<c:out value="${opr.personMemberName}"/>';
ContextOperator['orgAdminKind']='<c:out value="${opr.orgAdminKind}"/>';
ContextOperator['ondutyTime']='<c:out value="${opr.ondutyTime}"/>';
ContextOperator['id']='<c:out value="${opr.id}"/>';