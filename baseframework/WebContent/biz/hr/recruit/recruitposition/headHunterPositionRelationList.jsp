<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>  
  	<script  src='<c:url value="/biz/hr/recruit/recruitposition/headHunterPositionRelationList.js"/>' type="text/javascript"></script>
	
  </head>  
  <body>
            <x:hidden name="jobPosId"/>
			<div id="maingrid" style="margin: 2px;" style="margin: 2px;"></div>
	

  </body>
</html>
