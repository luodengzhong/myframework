<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/javaScript/swfobject.js"/>'type="text/javascript"></script>
<script src='<c:url value="/system/freeFlowDesigner/Designer.js"/>'type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'type="text/javascript"></script>
<style type="text/css">
	.fullflash{
	  position: absolute;
	  top: 80px;
	  left: 0px;
	  right: 0px;
	  bottom: 0px;
	}
</style>
</head>
<body>
	<div  id="toolBar" style="margin-top:10px;"></div>
	<div class='ui-form'  id="description" >
		<div class="row"  >
		   <x:inputL name="procDescription" label="流程标题"  labelWidth="60" width="500"/>
		</div>
	</div>
	<div class="fullflash">
		<div id="mainflash" ></div>
	</div>
</body>
</html>

