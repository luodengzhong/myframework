<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<form method="post" action="" id="contactSubmitForm">
    <x:hidden name="bizCode"/>
    <x:hidden name="bizId"/>
    <x:hidden name="contactId"/>

    <table class='tableInput'>
        <x:layout proportion="30%,70%"/>
        <tr>
            <x:inputTD name="name" label="姓名" maxLength="100" required="true"></x:inputTD>
        </tr>
        <tr>
            <x:inputTD name="alias" label="称呼" maxLength="64"></x:inputTD>
        </tr>
        <tr>
            <x:inputTD name="address" label="地址" maxLength="256"></x:inputTD>
        </tr>
        <tr>
            <x:inputTD name="postCode" label="邮编" maxLength="10"></x:inputTD>
        </tr>
    </table>
    <div id="contactWayList"></div>
</form>