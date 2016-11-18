<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/JSTLFunction.tld" prefix="f"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="i" value="${requestScope.EASY_SEARCH_DATA.intPage}" />
<c:set var="s" value="${requestScope.EASY_SEARCH_DATA.sumPage}" />
<c:set var="c" value="${requestScope.EASY_SEARCH_DATA.count}" />
<c:set var="headCount" value="0" />
<table id="easySearchTableListData" width="99%" class="<c:out value="${requestScope.EASY_SEARCH_DATA.headLength>1?'':'noBorder'}"/>"
	border=0 cellspacing=0 cellpadding=0 pageWidth="<c:out value="${requestScope.EASY_SEARCH_DATA.width}"/>" dataCount='<c:out value="${c}"/>'
	pageCount='<c:out value="${s}"/>'>
	<c:choose>
	<c:when test="${requestScope.EASY_SEARCH_DATA.headLength>1}">
		<thead>
			<tr>
				<c:if test="${requestScope.isMultipleSelect}">
					<th width='20px'>&nbsp;</th><c:set var="headCount" value="${headCount+1}" />
				</c:if>
				<!-- 输出标题 -->
				<c:forEach items="${requestScope.EASY_SEARCH_DATA.headList}" var="obj">
					<c:if test="${obj.type!='hidden'}">
						<th width='<c:out value="${obj.width}"/>px'><c:out value="${obj.name}" /></th><c:set var="headCount" value="${headCount+1}" />
					</c:if>
				</c:forEach>
			</tr>
		</thead>
	</c:when>
	<c:otherwise>
		<c:set var="headCount" value="1" />
		<c:if test="${requestScope.isMultipleSelect}"><c:set var="headCount" value="${headCount+1}" /></c:if>
	</c:otherwise>
	</c:choose>
	<c:forEach items="${requestScope.EASY_SEARCH_DATA.datas}" var="data">
		<tr class='list'>
			<c:if test="${requestScope.isMultipleSelect}">
				<td width='20px'><input type='checkbox' /></td>
			</c:if>
			<c:forEach items="${requestScope.EASY_SEARCH_DATA.headList}" var="obj">
				<c:if test="${obj.type!='hidden'}">
					<td style='text-align:<c:out value="${obj.align}"/>' title='<c:out value="${data[obj.code]}"/>' width='<c:out value="${obj.width}"/>px'>
						<c:out value="${f:format(data[obj.code],obj.type)}" />
					</td>
				</c:if>
				<input type='hidden' flag='<c:out value="${obj.type!='hidden'?'1':'0'}"/>' name='<c:out value="${obj.code}"/>'
					value='<c:out value="${data[obj.code]}"/>' />
			</c:forEach>
		</tr>
	</c:forEach>
	<c:if test="${s>1}">
		<tr class='pager'>
			<td colspan="<c:out value="${headCount}"/>" style="text-align: center;" nowrap="nowrap" class="pager-td">
				<span intpage='1' <c:if test="${s>1&&i>1}">class='doPage'</c:if>>首页</span>&nbsp;
				<span intpage='<c:out value="${i-1}"/>' <c:if test="${s>1&&i>1}">class='doPage'</c:if>>上一页</span>&nbsp; 
				<span intpage='<c:out value="${i+1}"/>' <c:if test="${s>1&&i+1<=s}">class='doPage'</c:if>>下一页</span>&nbsp; 
				<span intpage='<c:out value="${s}"/>' <c:if test="${s>1&&i!=s}">class='doPage'</c:if>>末页</span>
			</td>
		</tr>
		<tr>
			<td colspan="<c:out value="${headCount}"/>" style="text-align: center;" class="pager-td">
				第<b style='color: #ff0000'><c:out value="${i}" /></b>页&nbsp;&nbsp;
				共<b style='color: #ff0000'><c:out value="${s}" /></b>页
			</td>
		</tr>
	</c:if>
	<c:if test="${c==0}">
		<tr>
			<td colspan="100" style="text-align: center;"><b style='color: #333333;'><span class='tips'>没有需要展现的数据...</span></b></td>
		</tr>
	</c:if>
</table>
