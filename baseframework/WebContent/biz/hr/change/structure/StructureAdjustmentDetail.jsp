<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
  	<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  	<script src='<c:url value="/biz/hr/change/structure/StructureAdjustmentDetail.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<div class="subject">异动批量调整审批表</div>
	  		<div class="bill_info">
				<span style="float: left; margin-left: 10px;"> 
					单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;
					制单日期：<strong><x:format name="fillinDate" type="date"/></strong>
				</span> 
				<span style="float: right; margin-right: 10px;"> 
					制单人：<strong><c:out value="${personMemberName}" /></strong>
				</span>
			</div>
			<form method="post" action="" id="submitForm">
				<table class='tableInput'>
			        <x:layout />
			        <x:hidden name="auditId" />
			        <x:hidden name="status" value="0"/>
			        <x:hidden name="organId" />
					<x:hidden name="deptId" />
					<x:hidden name="positionId" />
					<x:hidden name="personMemberId" />
					<x:hidden name="fullId" />
					<x:hidden name="organName" />
					<x:hidden name="fillinDate" type="date" />
					<x:hidden name="billCode" />
					<x:hidden name="deptName" />
					<x:hidden name="centerId" />
					<x:hidden name="positionName" />
					<x:hidden name="personMemberName" />
			        <tr>
			            <x:inputTD name="effectiveDate" label="生效时间" required="true" wrapper="date"/>	
			            <!--  
			            <x:selectTD name="defaultIsHandoverNeeded"   dictionary="yesOrNo"  label="交接手续 "/>
			            -->
			            <td class="title" colspan="4"></td>
			            <x:select name="posLevel" id="mainPosLevel" cssStyle="display:none;" emptyOption="false"/>
			            <x:select name="unusualChangeType" id="mainUnusualChangeType" cssStyle="display:none;" emptyOption="false"/>
			             <x:select name="staffingPostsRank" id="staffingPostsRank" cssStyle="display:none;" emptyOption="false"/>
		            </tr>
		            <tr>
		               <x:textareaTD name="reason"  label="调整原因 " colspan="5" maxLength="256" rows="3" /> 
		            </tr>		            
		        </table>
			</form>
			<x:fileList bizCode="HRStructureAdjustment" bizId="auditId" id="structureAdjustmentFileList"/>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
	</div>
  </body>
</html>
