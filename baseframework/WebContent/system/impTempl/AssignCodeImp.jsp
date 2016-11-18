<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,attachment" />
<script src='<c:url value="/lib/jquery/jquery.toolBar.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/impTempl/AssignCodeImp.js"/>' type="text/javascript"></script>
</head>
<body>
	<div id="topToolbar" style="margin:2px;width:99%;"></div>
	<x:hidden name="templId"/>
	<x:hidden name="templCode"/>
	<x:hidden name="templetName"/>
	<x:hidden name="serialId"/>
	<div class="blank_div"></div>
    <div id="maingrid"></div>
	<iframe name="imp_main_iframe" style="display: none;" id='imp_main_iframe_id'></iframe>
</body>
</html>
