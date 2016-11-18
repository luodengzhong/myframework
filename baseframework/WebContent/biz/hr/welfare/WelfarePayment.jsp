
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="layout,dialog,grid,dateTime,tree,combox,attachment"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/welfare/WelfarePayment.js"/>' type="text/javascript"></script>
  </head>
  <body>
   	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  	    <div id="layout">
	  	     <div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
			</div>
	  	
	  	    <div position="center" title="福利发放">
	  		<x:title title="搜索" hideTable="queryDiv"/>
			<form method="post" action="" id="submitForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
			     <x:hidden name="fullId" id="mainFullId"/>
				 <div style="display: none;">
                     <x:selectTD list="welfareCommodity" name="welfareCommodityId" cssStyle="display:none" emptyOption="false"  label="福利卡"/>	
			    </div>
			    <dl>
				    <dt style="width: 60px;">业务年&nbsp;<font color='red'>*</font>&nbsp;:</dt>
				    <dd style="width: 80px;"><x:input name="year" required="true" label="业务年" maxLength="4" cssStyle="width:80px;" /></dd>
				    <dt style="width: 80px;">员工姓名&nbsp;:</dt>
				    <dd style="width: 120px;"><x:input name="staffName" required="false" label="员工姓名" maxLength="4" cssStyle="width:120px;" /></dd>
			    </dl>
				<dl>
				    <x:selectL list="welfareType" name="welfareTypeId" emptyOption="true"  label="福利类型"/>
				    <x:selectL name="status" dictionary="welfarePaymentStatus" emptyOption="true" label="福利状态"/>	
				</dl>    
			    <dl>
				    <x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
				    <x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
			    </dl>
			</div>
			</form>
	        <div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px"></div>
			</div>
			
			</div>
		</div> 
	</div>
  </body>
</html>
