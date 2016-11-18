<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="grid"/>
  	<script src='<c:url value="/biz/hr/pay/master/Paydetail.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<table class='tableInput' style="width: 99%;margin-top:5px;" id="detailTable">
			<x:layout proportion="90px,250,90px,250px"/>
		     <tr>
				<x:hidden name="serialId"/>
				<x:hidden name="isSimple"/>
				<x:hidden name="periodId"/>
				<x:hidden name="archivesId"/>
				<x:hidden name="operationCode"/>
				<x:inputTD name="year" label="业务年" disabled="true"/>		
				<x:inputTD name="periodName" label="期间" disabled="true"/>
			 </tr>	
			 <tr>	
				<x:inputTD name="periodBeginDate" disabled="true" label="期间时间起" maxLength="32" mask="date"/>	
				<x:inputTD name="periodEndDate" disabled="true" label="期间时间止" maxLength="22" mask="date"/>		
			</tr>
		</table>
		<div class="blank_div"></div>
		<div id="maingrid"></div>
	</div>
  </body>
</html>
