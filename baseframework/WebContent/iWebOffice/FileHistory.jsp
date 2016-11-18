<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<title>文档修改历史</title>
<x:base include="grid" />
<script src='<c:url value="/iWebOffice/FileHistory.js"/>' type="text/javascript"></script>
<style>html{overflow:hidden;}</style>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
	<iframe id="down_file_iframe" style="display:none;"></iframe>
</body>
</html>