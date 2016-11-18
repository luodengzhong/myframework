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
		<applet id="uploadFileApplet" alt="文件上传" width="400" height="100" code="com.brc.applet.FTPDownloadApplet.class"  archive="a.jar,net.jar,plugin.jar" codebase="<c:url value="/lib/ftpApplet/jar/"/>">
			<param name="readonly" value="true">
			<param name="host" value="<c:out value="${host}" />">
			<param name="port" value="<c:out value="${port}" />">
			<param name="userName" value="<c:out value="${userName}" />">
			<param name="password" value="<c:out value="${password}" />">
			<param name="remoteFileName" value="<c:out value="${remoteFileName}" />">
			<param name="remoteFilePath" value="<c:out value="${remoteFilePath}" />">
		</applet>
</div>
<%} %>