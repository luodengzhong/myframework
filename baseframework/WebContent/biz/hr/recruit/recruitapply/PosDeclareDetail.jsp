<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:860px;">
	  <table class='tableInput' id='queryTable'>
				<x:layout proportion="80px,160px,80px,160px,80px,160px" />
		<x:hidden name="posDeclareId"/>
		<x:hidden name="recPosId"/>
		<x:hidden name="fullId"/>
		<tr>
		<x:inputTD name="recPosName" required="true" label="岗位名称" disabled="true" />		
		<x:inputTD name="heightReq" required="false" label="身高要求"/>		
		<x:inputTD name="ageReq" required="false" label="年龄要求" maxLength="32"/>	
		</tr>	
		<tr>
		<x:inputTD name="address" required="false" label="户籍属地要求" />
		<x:inputTD name="eduReq" required="false" label="最低学历" maxLength="32"  dictionary="education"  filter="a"/>		
		<x:inputTD name="yearReq" required="false" label="工作经验" maxLength="22"/>		
		</tr>
		<tr>
		<x:inputTD name="professionalReq" required="false" label="专业资格" colspan="5"/>		
		
		</tr>
		<tr>		
		<x:textareaTD name="posDesReq" required="false" label="岗位职责" rows="3" colspan="5"/>		
		</tr>
		<tr>	
		<x:textareaTD name="takeJobReq" required="false" label="任职要求" rows="3" colspan="5"/>	
		</tr>
		<tr>	
		<x:textareaTD name="otherReq" required="false" label="其他要求" rows="3" colspan="5"/>
		</tr>
		</table>
	</div>
</form>
