<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div class="ui-form" >
	<x:selectL name="dispatchKindId"  id="uictrlDispatchKindId" required="true" label="发文类别"  labelWidth="70" width="150" list="dispatchKindMap"/>		
</div>