<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>四川蓝光和骏实业有限公司应聘人员登记表</title>  
   <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    position: absolute;
                top:0px;
                left:0px;
            }
            table{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
               border:solid 2px;
            }
           
            table tr{  
               text-align: left;
            } 
                        
            table td{
               border-right: 1px solid #000000;height:35px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word; 
               padding-left:1px;
            }
            table td.center{
                width:100px;
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table td.left{
                width:200px;
            	text-align: left;
            	padding-left:20px;
            }
           
            @page {    
              size:  420mm 297mm;
           }    
        </style> 
</head>  
<body>
   <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
   <div align="center" style="font-weight:bold;font-size:20px;height:20px;"><h1><b>四川蓝光和骏实业有限公司应聘人员登记表</b></h1></div>
   <div align="right" style="font-size:16px;height:25px;">填表日期:&nbsp;&nbsp;${registerDate}</div>
   <table  cellspacing="0px" cellpadding="0px"  style="border-width:3px;">
  <tr>
    <td colspan="2" ><div style="height:15px; overflow:hidden"> 应聘职位(岗位)&nbsp;${applyPosName}</div></td>
    <td colspan="2">希望待遇(税前年收入)&nbsp;${expecteSalary}万</td>
    <td style="width:10%" rowspan="5"> （免冠照片）</td>
    <td  rowspan="4" style="width:50%;border-bottom:none;border-right:none;" >
    <table  cellspacing="0px" cellpadding="0px"  style="border-top:none;border-bottom:none;border-left:none;border-right:none;" >
        <tr>
          <td width="7%" rowspan="5"><p>工作主要经历</p></td>
          <td width="10%" align="center">开始时间</td>
          <td width="10%" align="center">结束时间</td>
          <td width="23%" align="center">工作单位</td>
          <td width="20%" align="center">担任职位</td>
          <td width="30%" align="center">证明人及联系电话</td>
        </tr>
        <tr>
          <td>${resumeBeginDate_0?default("")?html}</td>
          <td>${resumeEndDate_0?default("")?html}</td>
          <td>${resumeCompany_0?default("")?html}</td>
          <td>${resumePos_0?default("")?html}</td>
          <td>${linkmainPerson_0?default("")?html}&nbsp; ${linkmainPhone_0?default("")?html} </td>
        </tr>
        <tr>
          <td>${resumeBeginDate_1?default("")?html}</td>
          <td>${resumeEndDate_1?default("")?html}</td>
          <td>${resumeCompany_1?default("")?html}</td>
          <td>${resumePos_1?default("")?html}</td>
          <td>${linkmainPerson_1?default("")?html}&nbsp; ${linkmainPhone_1?default("")?html} </td>
        </tr>
        <tr>
          <td>${resumeBeginDate_2?default("")?html}</td>
          <td>${resumeEndDate_2?default("")?html}</td>
          <td>${resumeCompany_2?default("")?html}</td>
          <td>${resumePos_2?default("")?html}</td>
          <td>${linkmainPerson_2?default("")?html}&nbsp; ${linkmainPhone_2?default("")?html} </td>
        </tr>
     </table>
   </td>
  </tr>
  <tr>
    <td style="width:10%">姓名&nbsp;${staffName}</td>
    <td style="width:10%">曾用名&nbsp;</td>
    <td style="width:10%">出生日期&nbsp;${birthdate}</td>
    <td style="width:10%">最高学历&nbsp;${educationTextView?default("")?html}</td>
  </tr>
  <tr>
    <td >性别&nbsp; ${sexTextView?default("")?html}</td>
    <td>民族&nbsp;${nationTextView?default("")?html}</td>
    <td>户口&nbsp;${registeredKindTextView?default("")?html}</td>
    <td>籍贯&nbsp;${nativePlace}</td>
  </tr>
  <tr>
    <td >政治面貌&nbsp; ${politicsStatusTextView?default("")?html}</td>
    <td>英语程度&nbsp;${englishLevel} </td>
    <td>专业&nbsp;${specialty}</td>
    <td>技术职称&nbsp;${jobTitle}</td>
  </tr>
  <tr>
    <td >身高&nbsp;${height} cm</td>
    <td>体重&nbsp;${weight} kg</td>
    <td>宗教&nbsp;${religion}</td>
    <td>驾照类别&nbsp;${driverLicense}</td>
    <td  rowspan="8" style="border-bottom:none;border-right:none;">
	<table  cellspacing="0px" cellpadding="0px"  style="border-top:none;border-bottom:none;border-left:none;border-right:none;">
      <tr>
        <td width="7%" rowspan="8">最后两家单位的详细情况</td>
        <td  colspan="2">所在企业全称 &nbsp; ${resumeCompanyLast_0?default("")?html}</td>
        <td width="43%">本人下属员工数量 &nbsp; ${fellowStaffNumLast_0?default("")?html}</td>
      </tr>
      <tr>
        <td width="25%">最初岗位及工资&nbsp; ${firstPos_0?default("")?html}&nbsp; ${firstWage_0?default("")?html}</td>
        <td width="25%">最终岗位及工资&nbsp; ${lastPos_0?default("")?html}&nbsp; ${lastWage_0?default("")?html}</td>
        <td >离职原因&nbsp; ${leaveReasonLast_0?default("")?html}</td>
      </tr>
      <tr>
        <td colspan="3">人力资源部/行政部工作人员及其办公电话：&nbsp; ${telephoneLast_0?default("")?html}</td>
        </tr>
      <tr>
        <td colspan="3" valign="top" style="height:110px;">主要工作经历及业绩&nbsp;${mainDetailLast_0?default("")?html}</td>
        </tr>
      
      <tr>
        <td colspan="2">所在企业全称&nbsp; ${resumeCompanyLast_1?default("")?html}</td>
        <td>本人下属员工数量 &nbsp; ${fellowStaffNumLast_1?default("")?html}</td>
      </tr>
      <tr>
        <td>最初岗位及工资&nbsp; ${firstPos_1?default("")?html}&nbsp; ${firstWage_1?default("")?html}</td>
        <td>最终岗位及工资&nbsp; ${lastPos_1?default("")?html}&nbsp; ${lastWage_1?default("")?html}</td>
        <td>离职原因&nbsp; ${leaveReasonLast_1?default("")?html}</td>
      </tr>
      <tr>
        <td colspan="3">人力资源部/行政部工作人员及其办公电话：&nbsp; ${telephoneLast_1?default("")?html}</td>
        </tr>
      <tr>
        <td colspan="3" valign="top" style="height:100px">主要工作经历及业绩&nbsp;${mainDetailLast_1?default("")?html}</td>
        </tr>
      
    </table>
	
	</td>

  </tr>
  <tr>
    <td >血型&nbsp; ${bloodTextView?default("")?html}</td>
    <td colspan="3">毕业院校(系)&nbsp;${university}</td>
    <td>毕业类型&nbsp; ${eduformTextView?default("")?html}</td>
  </tr>
  <tr>
    <td  colspan="2">婚姻状况&nbsp; ${maritalStatusTextView?default("")?html}</td>
    <td colspan="3">身份证号码&nbsp;${idCardNo}</td>
    
  </tr>
  <tr>
    <td  colspan="5">户口所在地详细地址&nbsp;${registeredPlace}</td>
  </tr>
  <tr>
    <td  colspan="4">现住所详细地址&nbsp;${residence}</td>
    <td>现住所性质&nbsp;${residenceKindTextView?default("")?html}</td>
  </tr>
  <tr>
    <td >移动号码&nbsp;${phoneNumber}</td>
    <td colspan="2">邮箱&nbsp;${email}</td>
    <td colspan="2">办公号码&nbsp;${workPhone}</td>
   
  </tr>
   <tr>
    <td colspan="2">紧急联系人姓名&nbsp;${linkman}</td>
    <td colspan="3">紧急联系人号码&nbsp;${otherPhoneNumber}</td>
   </tr>
  <tr>
    <td colspan="5"  style="border-bottom:none;border-right:none;" >
    <table  cellspacing="0px" cellpadding="0px"  style="border-top:none;border-bottom:none;border-left:none;border-right:none;">
       <tr>
           <td width="7%" rowspan="5"><p>高中及以后的学习经历</p></td>
          <td width="10%" align="center">开始时间</td>
          <td width="10%" align="center">结束时间</td>
          <td width="23%" align="center">毕业学校</td>
          <td width="17%" align="center">专业</td>
          <td width="23%" align="center">学历，学位</td>
          <td width="10%" align="center">备注</td>
        </tr>
        <tr>
          <td>${enrollingDate_0?default("")?html}</td>
          <td>${graduationDate_0?default("")?html}</td>
          <td>${university_0?default("")?html}</td>
          <td>${specialty_0?default("")?html}</td>
          <td>${educationTextView_0?default("")?html}&nbsp;${degreeTextView_0?default("")?html}</td>
          <td>${remark_learn_0?default("")?html}</td>
        </tr>
        <tr>
          <td>${enrollingDate_1?default("")?html}</td>
          <td>${graduationDate_1?default("")?html}</td>
          <td>${university_1?default("")?html}</td>
          <td>${specialty_1?default("")?html}</td>
          <td>${educationTextView_1?default("")?html}&nbsp;${degreeTextView_1?default("")?html}</td>
          <td>${remark_learn_1?default("")?html}</td>
        </tr>
        <tr>
          <td>${enrollingDate_2?default("")?html}</td>
          <td>${graduationDate_2?default("")?html}</td>
          <td>${university_2?default("")?html}</td>
          <td>${specialty_2?default("")?html}</td>
          <td>${educationTextView_2?default("")?html}&nbsp;  ${degreeTextView_2?default("")?html}</td>
          <td>${remark_learn_2?default("")?html}</td>

        </tr>
       <tr>
          <td>${enrollingDate_3?default("")?html}</td>
          <td>${graduationDate_3?default("")?html}</td>
          <td>${university_3?default("")?html}</td>
          <td>${specialty_3?default("")?html}</td>
          <td>${educationTextView_3?default("")?html}&nbsp;${degreeTextView_3?default("")?html}</td>
          <td>${remark_learn_3?default("")?html}</td>
        </tr>
      </table>

   </td>
  </tr>
  
  <tr>
    <td colspan="5" style="border-bottom:none;border-right:none;" >
 <table  cellspacing="0px" cellpadding="0px"  style="border-top:none;border-bottom:none;border-left:none;border-right:none;">
        <tr>
           <td width="7%" rowspan="5"><p>工作以后培训经历</p></td>
          <td width="10%" align="center">开始时间</td>
          <td width="10%" align="center">结束时间</td>
          <td width="23%" align="center">举办单位</td>
          <td width="40%" align="center">培训内容及证书获取情况</td>
          <td width="10%" align="center">备注</td>
        </tr>
        <tr>
          <td>${writeTime_0?default("")?html}</td>
          <td>${endTime_0?default("")?html}</td>
          <td>${forCompany_0?default("")?html}</td>
          <td>${trainContent_0?default("")?html}&nbsp;${getCertificate_0?default("")?html}</td>
          <td>${remark_train_0?default("")?html}</td>

        </tr>
        <tr>
         <td>${writeTime_1?default("")?html}</td>
          <td>${endTime_1?default("")?html}</td>
          <td>${forCompany_1?default("")?html}</td>
          <td>${trainContent_1?default("")?html}&nbsp;${getCertificate_1?default("")?html}</td>
          <td>${remark_train_1?default("")?html}</td>
        </tr>
        <tr>
           <td>${writeTime_2?default("")?html}</td>
          <td>${endTime_2?default("")?html}</td>
          <td>${forCompany_2?default("")?html}</td>
          <td>${trainContent_2?default("")?html}&nbsp;${getCertificate_2?default("")?html}</td>
          <td>${remark_train_2?default("")?html}</td>
        </tr>
        <tr>
         <td>${writeTime_3?default("")?html}</td>
          <td>${endTime_3?default("")?html}</td>
          <td>${forCompany_3?default("")?html}</td>
          <td>${trainContent_3?default("")?html}&nbsp;${getCertificate_3?default("")?html}</td>
          <td>${remark_train_3?default("")?html}</td>
        </tr>
      </table>


    </td>

    <td style="border-bottom:none;border-right:none;">
   <table cellspacing="0px" cellpadding="0px" style="height:175px;border-top:none;border-bottom:none;border-left:none;border-right:none;">
		  <tr>
           <td  width="7%">技术业务专长及业绩</td>
           <td width="93%" >${expertise}</td>
		  </tr>
		</table>

  </td>
  </tr>
  
  <tr>
    <td  rowspan="4"  colspan="5" style="border-bottom:none;border-right:none;" >
     <table  cellspacing="0px" cellpadding="0px"  style="border-top:none;border-bottom:none;border-left:none;border-right:none;">
        <tr>
          <td width="7%" rowspan="5"><p>家庭及社会主要成员</p></td>
          <td width="10%" align="center">姓名</td>
          <td width="10%" align="center">关系</td>
          <td width="40%" align="center">工作单位及职务</td>
		   <td width="23%" align="center">住址</td>
          <td width="10%" align="center">联系方式</td>
        </tr>
        <tr>
          <td>${familyName_0?default("")?html}</td>
          <td>${familyRelationTextView_0?default("")?html}</td>
          <td>${familyFirm_0?default("")?html} ${occupation_0?default("")?html}</td>
          <td>${address_0?default("")?html}</td>
          <td>${familyPhone_0?default("")?html}</td>
        </tr>
        <tr>
          <td>${familyName_1?default("")?html}</td>
          <td>${familyRelationTextView_1?default("")?html}</td>
          <td>${familyFirm_1?default("")?html}  ${occupation_1?default("")?html}</td>
          <td>${address_1?default("")?html}</td>
          <td>${familyPhone_1?default("")?html}</td>
        </tr>
        <tr>
          <td>${familyName_2?default("")?html}</td>
          <td>${familyRelationTextView_2?default("")?html}</td>
          <td>${familyFirm_2?default("")?html}  ${occupation_2?default("")?html}</td>
          <td>${address_2?default("")?html}</td>
          <td>${familyPhone_2?default("")?html}</td>
        </tr>
        <tr>
          <td>${familyName_3?default("")?html}</td>
          <td>${familyRelationTextView_3?default("")?html}</td>
          <td>${familyFirm_3?default("")?html} ${occupation_3?default("")?html}</td>
          <td>${address_3?default("")?html}</td>
          <td>${familyPhone_3?default("")?html}</td>
        </tr>
      </table>
   </td>
   
  <td style="border-bottom:none;border-right:none;" >
   <table cellspacing="0px" cellpadding="0px" style="border-top:none;border-bottom:none;border-left:none;border-right:none;">
      <tr>
        <td colspan="3">个人特长:&nbsp;${strength}</td>
        </tr>
      <tr>
        <td colspan="3">业务爱好:&nbsp;${hobby}</td>
        </tr>
      <tr>
        <td width="45%">首选工作地点:&nbsp;${workPalceTextView?default("")?html}</td>
        <td  width="30%">工作地点是否接受公司安排:&nbsp;${choiceTextView?default("")?html}</td>
        <td  width="25%">到岗时间：${employedDate}</td>
      </tr>
      <tr>
       <td rowspan="2" colspan="3"><p><strong style="font-size:13px">本人谨此承诺：</strong>以上所填内容(学历及工作背景)不含虚假成分，所提供的相关资料真实合法，同意用人单位进行相关调查。</p>
    <p><strong style="font-size:13px">承诺人</strong>(签字)：</p></td>
        </tr>
      
    </table>      
 </td>
  </tr>
</table>
  <table  cellspacing="0px" cellpadding="0px" style="border-top:none;border-bottom:none;border-left:none;border-right:none;">
  <tr>
    <td align="right" style="border-top:none;border-bottom:none;border-left:none;border-right:none;">经办人：</td>
    <td align="right" style="border-top:none;border-bottom:none;border-left:none;border-right:none;">档案审核人：</td>
    <td align="right" style="border-top:none;border-bottom:none;border-left:none;border-right:none;">人力资源中心制</td>
	<td align="right" style="border-top:none;border-bottom:none;border-left:none;border-right:none;">HJBD-RL</td>
  </tr>
</table>
</body>  
</html>   