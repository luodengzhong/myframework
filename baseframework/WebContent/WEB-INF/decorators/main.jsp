<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator" prefix="decorator"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/page" prefix="page"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title><decorator:title default="蓝光协同"/></title>
		<meta http-equiv="expires" content="0">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<s:head/>
		<link href='<s:url value="/themes/default/style.css?a=1"/>' rel="stylesheet" type="text/css" />
		<link href='<s:url value="/themes/default/ui.css"/>' rel="stylesheet" type="text/css" />
		<script src='<s:url value="/javaScript/WEB_APP.js"/>' type="text/javascript"></script>
		<script src='<s:url value="/lib/jquery/jquery-1.7.2.min.js"/>' type="text/javascript"></script>
		<script src='<s:url value="/lib/jquery/jquery.json-2.4.min.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.maskinput.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.maxlength.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.spinner.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.dragEvent.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.tooltip.js"/>' type='text/javascript'></script>
		<script src='<s:url value="/lib/jquery/jquery.toolBar.js"/>' type="text/javascript"></script>
		<script src='<s:url value="/javaScript/chineseLetter.js"/>' type="text/javascript"></script>
		<script src='<s:url value="/javaScript/common.js?a=4"/>' type="text/javascript"></script>
		<decorator:head/>
		<script src='<s:url value="/common/OPpermission.jsp"/>' type="text/javascript"></script>
	    <script src='<s:url value="/javaScript/UICtrl.js?a=2"/>' type="text/javascript"></script>
	</head>
	<body>
		<div id='screenOverLoading' class='ui-tab-loading' style='display:block;top:0;'></div>
		<font color='#ff0000'><s:actionerror/><s:fielderror/></font>
		
		<decorator:body/>
		
	</body>
</html>