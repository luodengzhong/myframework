<%@ page contentType="text/html; charset=utf-8" language="java"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style type="text/css">

.myTable{
   
}
.myTable:td
{
    width:25%;
}

</style>
<title>个人信息</title>
</head>
<body>
<table class="myTable" cellspacing="0" border="1" cellpadding="0">
    <tr>
        <td>应聘职位：（岗位）</td><td><input type="text" name="position" /></td>  
        <td>希望待遇（税前收入）</td><td><input type="text" name="" /> </td>
    </tr>
    <tr>
        <td>姓名<input name="fullName" type="text" /></td>
        <td>曾用名<input name="pastName" type="text" /></td>
        <td>户口:<input type="radio" id="algraculture" name="algraculture" value="1" /><label for="algraculture">农村</label>&nbsp;
          <input type="radio" id="nonAlgraculture" name="nonAlgraculture" value="0" /><label for="nonAlgraculture">非农村</label> </td>
        <td>籍贯<input name="" type="text" /></td>
    </tr>
    <tr>
        <td>政治面貌<input name="" type="text" /></td>
        <td>英语程度<input name="" type="text" /></td>
        <td>所学专业<input name="" type="text" /></td>
        <td>技术职称<input name="" type="text" /></td>
    </tr>
    <tr>
        <td>身高<input name="" type="text" /></td>
        <td>体重<input name="" type="text" /></td>
        <td>宗教信仰<input name="" type="text" /></td>
        <td>职业资格<input name="" type="text" /></td>
    </tr>
    <tr>
        <td>血型<input name="" type="text" /></td>
        <td>毕业院校（系）<input name="" type="text" /></td>
        <td colspan="2" >毕业类型
          <input type="radio" id="combain" name="combain" value="1" /><label for="combain">普招</label>&nbsp;
          <input type="radio" id="audlt" name="audlt" value="0" /><label for="audlt">成人</label>&nbsp;
          <input type="radio" id="people" name="people" value="0" /><label for="people">民办</label>&nbsp;
                                  其它<input name="" type="text" />
        </td>
    </tr>
    <tr>
        <td colspan="2">户口所在地详细地址<input type="text" name="idcardAddress" /></td>  
        <td colspan="2">希现住所详细地址<input type="text" name="liveAddress" /> </td>
    </tr>
</table>
</body>
</html>