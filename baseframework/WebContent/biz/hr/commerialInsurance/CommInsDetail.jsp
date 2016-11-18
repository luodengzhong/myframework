<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout/>
		<tr>
		<x:hidden name="commInsId"/>
		<x:hidden name="archivesId"/>
		<x:hidden name="posId"/>
		<x:inputTD name="name" required="true" label="姓名"  wrapper="select"/>	
		<x:selectTD name="posTier" required="true" label="层级" />		
		<x:inputTD name="buyCompany" required="true" label="商业保险购买单位" />		
		</tr>
		<tr>
		<x:selectTD  name="buyType" required="true" label="购买类型"  value="1"/>	
		<x:inputTD name="familyName" required="false" label="家属姓名" />	
		<x:inputTD name="insCompany" required="false" label="保险公司" />		
		</tr>
		<tr>
		<x:inputTD name="buyPlace" required="true" label="购买地点" />		
		<x:inputTD name="planType" required="false" label="参保计划种类" />	
		<td  colspan="2"  class="title">
			
		</tr>	
		<tr>
		<x:inputTD name="ginsengStandard" required="true" label="参保金额标准"  mask="nnn"/>	
		<x:inputTD name="effectiveDate" required="true" label="保险生效日期"  wrapper="date"/>		
		<x:inputTD name="finishDate" required="true" label="保险终止日期"  wrapper="date"/>		
		</tr>
		<tr>	
		<x:inputTD name="insStatus" required="false" label="参保状态" />	
		<x:inputTD name="reduceTime" required="false" label="终止购买时间"  wrapper="date"/>		
		<x:inputTD name="desption" required="false" label="出险记录描述" />		
	</tr>
	<tr>
			<x:inputTD name="remark" required="false" label="备注"  colspan="5"/>
	
	</tr>
	</table>
</form>
