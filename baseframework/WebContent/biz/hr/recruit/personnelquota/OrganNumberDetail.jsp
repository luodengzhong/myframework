<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<table class='tableInput' style="width: 99%;">
		<x:layout proportion="110px,140px,120px,140px"/>
		<tr>
		<x:hidden name="organNumberId"/>
		<x:hidden name="dptId"/>
		<x:hidden name="parentId"/>
		<x:hidden name="orgKindId"/>
		<x:hidden name="isCenter"/>
		<x:inputTD name="fullName" required="false" label="单位路径" disabled="true" colspan="3"/>
		</tr>
		<tr>
	   <x:inputTD name="name" required="false" label="单位名称"  disabled="true"/>
	   <x:selectTD  name="staffingLevel"   required="false" label="编制类别" />
		</tr>	
		<tr>
		<x:inputTD name="num" required="false" label="定员人数" mask="nnnn"/>	
		<x:inputTD name="upRanage" required="false" label="上浮幅度(%)"  mask="nnn"/>	
			</tr>
			<tr>
		<x:inputTD name="hrExistNum" required="false" label="已有人数(人力)"  disabled="true" />	
		<x:inputTD name="yxExistNum" required="false" label="已有人数(营销)"  disabled="true" />	
		
			</tr>
		<tr>
		<x:textareaTD name="remark" required="false" label="备注"  rows="2"  colspan="3" maxLength="64"/>
		</tr>
	</table>
</form>
