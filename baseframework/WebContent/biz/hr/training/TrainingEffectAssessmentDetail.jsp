<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="submitForm">
    <table class='tableInput' style="width: 100%;">
        <x:layout/>
        <tr>
            <x:hidden name="trainingEffectAssessmentId"/>
            <x:inputTD name="content" required="false" label="培训内容" maxLength="1024"/>
            <x:inputTD name="trainingDate" required="false" label="培训日期" maxLength="7" wrapper="date"/>
        </tr>
        <tr>
            <x:hidden name="archivesId"/>
            <x:hidden name="teacherId"/>
            <x:inputTD name="staffName" required="false" label="学员姓名" maxLength="64"/>
            <x:inputTD name="teacherName" required="false" label="讲师姓名" maxLength="64"/>
        </tr>
        <tr>
            <td colspan="4">
                <table class="table-view" style="width: 100%">
                    <tr>
                        <td colspan="2">
                            课程内容<input type="hidden" name="topTitle[0]" value="课程内容">
                        </td>
                    </tr>
                    <tr>
                        <td>课程适合我的工作和个人发展需要 <input type="hidden" name="content.title[0]" value="课程适合我的工作和个人发展需要"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="content.item[0]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>课程内容深度适中、易于理解 <input type="hidden" name="content.title[1]" value="课程内容深度适中、易于理解"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="content.item[1]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>课程内容切合实际、便于应用  <input type="hidden" name="content.title[2]" value="课程内容切合实际、便于应用"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="content.item[2]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>课程时间安排 <input type="hidden" name="content.title[3]" value="课程时间安排"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="content.item[3]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>课程中的互动环节 <input type="hidden" name="content.title[4]" value="课程中的互动环节"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="content.item[4]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>课件的呈现效果 <input type="hidden" name="content.title[5]" value="课件的呈现效果"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="content.item[5]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="4">
                <table class="table-view" style="width: 100%">
                    <tr>
                        <td colspan="2">
                            内训师<input type="hidden" name="topTitle[1]" value="内训师">
                        </td>
                    </tr>
                    <tr>
                        <td>内训师的仪表标准、个人形象 <input type="hidden" name="teacher.title[0]" value="内训师的仪表标准、个人形象"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="teacher.item[0]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>内训师有充分的准备 <input type="hidden" name="teacher.title[1]" value="内训师的仪表标准、个人形象"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="teacher.item[1]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>内训师表达清楚、态度友善 <input type="hidden" name="teacher.title[2]" value="内训师表达清楚、态度友善"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="teacher.item[2]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>内训师对培训内容有独特精辟见解 <input type="hidden" name="teacher.title[3]" value="内训师对培训内容有独特精辟见解"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="teacher.item[3]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>内训师课堂气氛和吸引力 <input type="hidden" name="teacher.title[4]" value="内训师课堂气氛和吸引力"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="teacher.item[4]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <td>培训方式生动多样、鼓励参与 <input type="hidden" name="teacher.title[5]" value="培训方式生动多样、鼓励参与"></td>
                        <td>
                            <c:forEach begin="1" end="10" var="i" step="1">
                                <input name="teacher.item[5]" value="${i}" type="radio"><span>${i}</span>&nbsp;&nbsp;
                            </c:forEach>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
        <tr>
            <td colspan="4">
                <table class="table-view" style="width: 100%">
                    <tr>
                        <td colspan="2">参加此次培训的收获有（可多选）<input type="hidden" name="topTitle[2]" value="参加此次培训的收获有"></td>
                    </tr>
                    <tr>
                        <td>
                            <input name="gain[0]" type="checkbox" value="A.获得了适用的新知识">
                        </td>
                        <td>
                            A.获得了适用的新知识。
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input name="gain[1]" type="checkbox" value="B.理顺了过去工作中的一些模糊概念">
                        </td>
                        <td>
                            B.理顺了过去工作中的一些模糊概念。
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input name="gain[2]" type="checkbox" value="C.获得了可以在工作上应用的一些有效的技巧或技术">
                        </td>
                        <td>
                            C.获得了可以在工作上应用的一些有效的技巧或技术。
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input name="gain[3]" type="checkbox" value="D.促进客观地观察自己以及自己的工作，帮助对过去的工作进行总结与思考">
                        </td>
                        <td>
                            D.促进客观地观察自己以及自己的工作，帮助对过去的工作进行总结与思考。
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input name="gain[4]" type="checkbox" value="E.其它">
                        </td>
                        <td>
                            E.其它（请填写）:<textarea name="other"></textarea>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <x:inputTD name="score" required="false" label="总体评分" maxLength="22"/>
            <x:textareaTD name="suggestion" required="false" label="建议" maxLength="1024"/>
        </tr>
    </table>
</form>
