<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/biz/hr/archives/EntryArchivesList.js"/>' type="text/javascript"></script>
  	
  </head>
  <body>
  
  	<div class="mainPanel"  >
	  	<div id="mainWrapperDiv">
	  		<div position="center" title="入职员工列表">
	  		     <x:title title="入职员工列表" hideTable="queryDiv"/>
  	<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
		
		<x:inputL name="employDateBegin" required="false" label="入职时间(起)"  wrapper="date"/>					
		<x:inputL name="employDateEnd" required="false" label="入职时间(止)"  wrapper="date"/>					
									<div class="blank_div"></div>
				
		<x:inputL name="staffName" required="false" label="员工姓名" maxLength="32"/>			
		<x:checkbox  name="checkvalue"  label="查询即将入职员工"   checked="true" />
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
						<div class="blank_div"></div>
			<div id="maingrlistid"  style="margin: 2px;"></div>
			</div>
			</div>
		   </div> 
  </body>
</html>
