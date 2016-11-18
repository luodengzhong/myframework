<%@ page language="java" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page import="com.brc.util.Constants" %>
<% 
Cookie[] cookies = request.getCookies();
String brcUserInfo = null;
if (cookies != null) {
    for (Cookie cookie : cookies) {
        if (cookie.getName().equals(Constants.BRC_USER_INFO)) {
            brcUserInfo = cookie.getValue();
            break;
        }
    }
}
if(brcUserInfo!=null){
%>
<div style="padding-left:5px ">控件无法使用请点击<a href="##" style="font-size: 14px;color:blue;" onclick="showFTPAppletHelp()">这里</a>!</div>
<div style="border:1px solid #AAAAAA;" id="uploadFileAppletDiv">
		<applet id="uploadFileApplet" alt="文件上传" width="400" height="400" code="com.brc.applet.FTPApplet.class"  archive="a.jar,net.jar,plugin.jar" codebase="<c:url value="/lib/ftpApplet/jar/"/>">
			<param name="readonly" value="<c:out value="${readonly}" />">
			<param name="canDelete" value="<c:out value="${canDelete}" />">
			<param name="host" value="<c:out value="${host}" />">
			<param name="port" value="<c:out value="${port}" />">
			<param name="userName" value="<c:out value="${userName}" />">
			<param name="password" value="<c:out value="${password}" />">
			<param name="serverUrl" value="<c:out value="${serverUrl}" />">
			<param name="bizCode" value="<c:out value="${bizCode}" />">
			<param name="bizId" value="<c:out value="${bizId}" />">
			<param name="attachmentCode" value="<c:out value="${attachmentCode}" />">
			<param name="saveFilePath" value="<c:out value="${saveFilePath}" />">
			<param name="isMore" value="<c:out value="${isMore}" />">
			<param name="isCheck" value="<c:out value="${isCheck}" />">
			<param name="sign" value="<%=brcUserInfo%>">
			<param name="fileNameExtension" value="<c:out value="${fileNameExtension}" />">
			<c:if test="${queryFileUrl!=null}">
			<param name="queryFileUrl" value="<c:out value="${queryFileUrl}" />">
			</c:if>
			<c:if test="${saveFileFileUrl!=null}">
			<param name="saveFileFileUrl" value="<c:out value="${saveFileFileUrl}" />">
			</c:if>
			<c:if test="${deleteFileUrl!=null}">
			<param name="deleteFileUrl" value="<c:out value="${deleteFileUrl}" />">
			</c:if>
		</applet>
</div>
<%} %>