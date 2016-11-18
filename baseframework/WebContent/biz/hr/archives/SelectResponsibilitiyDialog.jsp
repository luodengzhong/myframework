<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <x:base include="layout,dialog,grid,dateTime,tree"/>
    <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/hr/archives/SelectResponsibilitiyDialog.js"/>' type="text/javascript"></script>
    <style>html{overflow:hidden;}</style>
</head>
<body>
<div id="mainPanel">
    <div id="divMain" style="margin-top: 10px;">
    	<x:hidden name="archivesId" id="archivesId" />
        <table cellpadding="0" cellspacing="0">
            <tr>
                <td style="font-size: 13px; font-weight: bold; padding-bottom: 4px;">
                    可选职能分类：
                </td>
                <td></td>
                <td style="font-size: 13px; font-weight: bold; padding-bottom: 4px;">已选职能分类：</td>
            </tr>
            <tr>
                <td valign="top" style="width: 250px;">
                	<div id="chooseByDiv" >
	                    <div style="width: 250px; height: 290px; border: 1px #eaeaea solid; overflow-y: auto; overflow-x: hidden;">
	                            <ul id="responsibilitiyTree"></ul>
	                    </div>
                    </div>
                </td>
                <td style="width: 60px;text-align: center;">
                    <div style="padding-left: 5px;text-align: center;">
                        <x:button value="=>" cssStyle="min-width:50px;text-align: center;"  onclick="addData()"/>
                        <br/> <br/>
                        <x:button value="<=" cssStyle="min-width:50px;text-align: center;"  onclick="deleteData()"/>
                    </div>
                </td>
                <td valign="top" style="width: 240px;">
                    <div style="width: 240px; height: 290px; overflow: hidden;">
                        <div id="responsibilitiyGrid"></div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>