<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/biz/hr/entry/teacherscore/TeacherScoreDetailList.js"/>' type="text/javascript"></script>  
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:hidden name="personMemberId"/>
	  		<x:hidden name="status"/>
			<div id="maingrDetailId"></div>
		</div> 
	</div>
  </body>
</html>
