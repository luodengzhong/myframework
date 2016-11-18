<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/biz/hr/pay/master/PayMain.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="工资主表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
				<x:inputL name="billCode" required="false" label="单据号码" maxLength="32"/>
				<x:inputL name="organName" required="false" label="公司名称" maxLength="32"/>
				<x:selectL name="status" list="payStatus" label="状态"/>
				<div class="clear"></div>
				<dl>
					<dt>业务年:</dt>
					<dd style="width:90px;">
						<x:input name="year" required="false" label="业务年" maxLength="4" cssStyle="width:80px;"/>&nbsp;
					</dd>
				</dl>
				<x:hidden name="periodId"/>
				<x:inputL name="periodName" label="业务期间" required="false" wrapper="select" width="220"/>
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
