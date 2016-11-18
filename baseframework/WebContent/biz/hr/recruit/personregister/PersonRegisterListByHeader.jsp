<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree,layout"/>
  	  	<script src='<c:url value="/biz/hr/recruit/personregister/PersonRegisterListByheader.js?a=1"/>'   type="text/javascript"></script>
  		 <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
  	  		<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="简历列表" hideTable="queryDiv"/>
	  		<x:hidden name="writeId"/>
			<x:hidden name="hunterId"/>		
			<x:hidden name="sourceType"/>
			<x:select name="recruitWay" id="recruitWay" cssStyle="display:none;" emptyOption="false"/>
			<x:select name="choicePlace" id="choicePlace" cssStyle="display:none;" emptyOption="false"/>
			
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
		<x:inputL name="staffName" required="false" label="姓名" maxLength="32"/>					
		<x:inputL name="idCardNo" required="false" label="身份证号" maxLength="20"/>					
	     <x:selectL name="recruitResult" required="false" label="应聘结果" />		
	     <x:inputL name="registerDate" required="false" label="填表时间"  wrapper="date"/>		
	     
	
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
		</div>
  </body>
</html>
