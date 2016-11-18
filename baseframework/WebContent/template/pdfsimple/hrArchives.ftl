<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
        <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    border-bottom: 1px solid #000000;
            }
            
            table.print{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 3px solid #000000;border-top: 2px solid #000000;border-right: 2px solid #000000;
               background:#c6d9f1;
            }
            
            table.print tr{  
               height: 40px;text-align: left;
            } 
                        
            table.print td{
               border-right: 1px solid #000000;height:25px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word;
            }
            table.print td.center{
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table.print td.left{
            	text-align: left;
            }
            table.print td.blueColor{
                 background-color:#c6d9f1;
                 font-weight:bold;
            }
            @page {   
            	size:  420mm ;
              @bottom-right {  
                    content: "RL-B09-09[A/1版]";  
              } 
           }   
        </style> 
</head>  
<#-- 定义宏formatdate-->
<#macro formatdate date>
<#if date??&&date?string!=''>
${date?string("yyyy-MM-dd")}
</#if>
</#macro> 
<body>  
  <div style="page-break-after:always"> 
  	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <div align="center" style="font-weight:bold;">  
          <h2>蓝光集团员工个人信息管理一览表（${staffName}）</h2>
      </div>
      <table cellspacing="0" cellpadding="0" class="print" style="border-top: 3px solid #000000;"> 
         <tr> 
         	<td class="left blueColor" rowspan='4' style="width:160px;"><b>一、基本信息</b></td>  
            <td class="center blueColor"><b>姓名</b></td>  
            <td class="center blueColor"><b>所属公司</b></td>  
            <td class="center blueColor"><b>中心</b></td>  
            <td class="center blueColor"><b>岗位名称</b></td>  
            <td class="center blueColor"><b>行政级别</b></td>
            <td class="center blueColor"><b>年预期薪酬(元)</b></td>
            <td class="center blueColor"><b>出生日期</b></td>  
         </tr>  
         <tr style="background:#ffffff;"> 
            <td class="center">${staffName}</td>  
            <td class="center">${ognName}</td>  
            <td class="center">${centreName}</td>  
            <td class="center">${posName}</td>  
            <td class="center">${posLevelTextView?default("")}</td>
            <td class="center">${wageStandard}</td>
            <td class="center"><@formatdate date=birthdate/></td>  
         </tr>
         <tr>  
            <td class="center blueColor"><b>年龄</b></td>  
            <td class="center blueColor"><b>性别</b></td>  
            <td class="center blueColor"><b>到司时间</b></td>  
            <td class="center blueColor"><b>集团工龄</b></td>
            <td class="center blueColor"><b>从业年限</b></td>
            <td class="center blueColor"><b>最高学历</b></td>
            <td class="center blueColor"><b>资格证书</b></td>
         </tr>
          <tr style="background:#ffffff;"> 
            <td class="center">${age}</td>  
            <td class="center">${sexTextView?default("")}</td>  
            <td class="center"><@formatdate date=employedDate/></td>  
            <td class="center">${CWorkTime}</td>
            <td class="center">${workTime}</td>
            <td class="center">${educationTextView?default("")}</td>
            <td class="center">${jobCertificate}</td>
         </tr>                                                                         
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:160px;" rowspan="${contractLength+1}"><b>二、劳动合同情况</b></td>  
            <td class="center blueColor" style="width:40px;"><b>序号</b></td>  
            <td class="center blueColor"><b>合同期限</b></td>  
            <td class="center blueColor"><b>劳动合同甲方</b></td>
            <td class="center blueColor"><b>合同起始时间</b></td>
            <td class="center blueColor"><b>合同终止时间</b></td>
         </tr>
        <#if contractDetail?? && contractDetail?size gt 0> 
		<#list contractDetail as contract>
			<tr style="background:#ffffff;">
				<td class="center">${contract_index?if_exists+1}</td>
				<td class="center">${contract.contracLimit}</td>
				<td class="center">${contract.contracCompany}</td>
				<td class="center"><@formatdate date=contract.contracBeginDate/></td>
				<td class="center"><@formatdate date=contract.contracEndDate/></td>
			</tr> 
		</#list>
		<#else>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:160px;" rowspan="${familyLength+1}"><b>三、家庭成员情况</b></td>  
            <td class="center blueColor" style="width:40px;"><b>序号</b></td>  
            <td class="center blueColor"><b>成员姓名</b></td>  
            <td class="center blueColor"><b>与本人的关系</b></td>
            <td class="center blueColor"><b>工作单位</b></td>
            <td class="center blueColor"><b>联系方式</b></td>
         </tr>
        <#if familyDetail?? && familyDetail?size gt 0> 
		<#list familyDetail as family>
			<tr style="background:#ffffff;">
				<td class="center">${family_index?if_exists+1}</td>
				<td class="center">${family.familyName}</td>
				<td class="center">${family.familyRelationTextView?default("")}</td>
				<td class="center">${family.familyFirm}</td>
				<td class="center">${family.familyPhone}</td>
			</tr> 
		</#list>
		<#else>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:160px;" rowspan="${educationLength+1}"><b>四、学历情况</b></td>  
            <td class="center blueColor" style="width:40px;"><b>序号</b></td>  
            <td class="center blueColor" style="width:90px;"><b>入学时间</b></td>  
            <td class="center blueColor" style="width:90px;"><b>毕业时间</b></td>
            <td class="center blueColor"><b>学历</b></td>
            <td class="center blueColor"><b>毕业学校</b></td>
            <td class="center blueColor"><b>专业</b></td>
         </tr>
        <#if educationDetail?? && educationDetail?size gt 0> 
		<#list educationDetail as education>
			<tr style="background:#ffffff;">
				<td class="center">${education_index?if_exists+1}</td>
				<td class="center"><@formatdate date=education.enrollingDate/></td>
				<td class="center"><@formatdate date=education.graduationDate/></td>
				<td class="center">${education.educationTextView?default("")}</td>
				<td class="center">${education.university}</td>
				<td class="center">${education.specialty}</td>
			</tr> 
		</#list>
		<#else>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:160px;" rowspan="${resumeLength+1}"><b>五、工作经历</b></td>  
            <td class="center blueColor" style="width:40px;"><b>序号</b></td>  
            <td class="center blueColor" style="width:90px;"><b>起始时间</b></td>  
            <td class="center blueColor" style="width:90px;"><b>终止时间</b></td>
            <td class="center blueColor"><b>所在单位</b></td>
            <td class="center blueColor"><b>最终岗位</b></td>
         </tr>
        <#if resumeDetail?? && resumeDetail?size gt 0> 
		<#list resumeDetail as resume>
			<tr style="background:#ffffff;">
				<td class="center">${resume_index?if_exists+1}</td>
				<td class="center"><@formatdate date=resume.resumeBeginDate/></td>
				<td class="center"><@formatdate date=resume.resumeEndDate/></td>
				<td class="center">${resume.resumeCompany}</td>
				<td class="center">${resume.resumeDuty}</td>
			</tr> 
		</#list>
		<#else>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:160px;" rowspan="${reshuffleLength+1}"><b>六、调动及任免管理</b></td>  
            <td class="center blueColor" style="width:40px;"><b>序号</b></td>  
            <td class="center blueColor" style="width:90px;"><b>变动日期</b></td>  
            <td class="center blueColor" style="width:90px;"><b>变化前行政级别</b></td>
            <td class="center blueColor" style="width:90px;"><b>变化后行政级别</b></td>
            <td class="center blueColor" style="width:90px;"><b>变动类型</b></td>
            <td class="center blueColor"><b>变动前描述</b></td>
            <td class="center blueColor"><b>变动后描述</b></td>
            <td class="center blueColor"><b>变动原因</b></td>
         </tr>
        <#if reshuffleDetail?? && reshuffleDetail?size gt 0> 
		<#list reshuffleDetail as reshuffle>
			<tr style="background:#ffffff;">
				<td class="center">${reshuffle_index?if_exists+1}</td>
				<td class="center" ><@formatdate date=reshuffle.effectiveDate/></td>
				<td class="center">${reshuffle.fromPosLevelTextView}</td>
				<td class="center">${reshuffle.posLevelTextView}</td>
				<td class="center">${reshuffle.reshuffleTypeTextView?default("")}</td>
				<td class="center">${reshuffle.fromPosDesc}</td>
				<td class="center">${reshuffle.posDesc}</td>
				<td class="center">${reshuffle.reason}</td>
			</tr>
		</#list>
		<#else>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr>
		</#if>
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:80px;" rowspan="${payChangeLength+3}"><b>七、薪酬管理</b></td>
            <td class="left blueColor" style="width:80px;" rowspan="${payChangeLength+1}"><b>薪酬变动</b></td>  
            <td class="center blueColor" style="width:40px;"><b>序号</b></td>  
            <td class="center blueColor" style="width:90px;"><b>工资变动时间</b></td>  
            <td class="center blueColor"><b>原年预期标准(元)</b></td>
            <td class="center blueColor"><b>增减后年预期标准(元)</b></td>
            <td class="center blueColor"><b>工资增减事由</b></td>
            <td class="center blueColor"><b>工资变动类型</b></td>
            <td class="center blueColor"><b>薪酬结构</b></td>
         </tr>
        <#if payChangeDetail?? && payChangeDetail?size gt 0> 
		<#list payChangeDetail as payChange>
			<tr style="background:#ffffff;">
				<td class="center">${payChange_index?if_exists+1}</td>
				<td class="center" ><@formatdate date=payChange.executionTime/></td>
				<td class="center">${payChange.oldWageStandard}</td>
				<td class="center">${payChange.newWageStandard}</td>
				<td class="center">${payChange.cause}</td>
				<td class="center">${payChange.wageChangeKindTextView?default("")}</td>
				<td class="center">${payChange.wageKindTextView?default("")}</td>
			</tr> 
		</#list>
		<#else>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr>
		</#if>
		<tr>
			<td class="left blueColor" rowspan="2" style="width:80px;"><b>社保、公积金基数</b></td>  
            <td class="center blueColor" colspan="4"><b>社保基数</b></td>  
            <td class="center blueColor" colspan="3"><b>公积金基数</b></td> 
         </tr> 
         <tr style="background:#ffffff;">
            <td class="center" colspan="4">${socialSecurityBase}</td>  
            <td class="center" colspan="3">${providentFundBase}</td> 
         </tr> 
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:160px;" rowspan="${trainLength+1}"><b>八、培训管理</b></td>  
            <td class="center blueColor" style="width:40px;"><b>序号</b></td>  
            <td class="center blueColor"><b>培训内容</b></td>  
            <td class="center blueColor"><b>培训开始时间</b></td>
            <td class="center blueColor"><b>培训结束时间</b></td>
            <td class="center blueColor"><b>培训协议金额</b></td>
         </tr>
		<#if trainDetail?? && trainDetail?size gt 0> 
		<#list trainDetail as train>
			<tr style="background:#ffffff;">
				<td class="center">${train_index?if_exists+1}</td>
				<td class="center">${train.applicationContent}</td>
				<td class="center"><@formatdate date=train.startTime/></td>
				<td class="center"><@formatdate date=train.endTime/></td>
				<td class="center">${train.predictFee}</td>
			</tr> 
		</#list>
		<#else>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr>
		</#if>
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:160px;" rowspan="${businessRegistrationLength+1}"><b>九、工商变更管理</b></td>  
            <td class="center blueColor" style="width:40px;"><b>序号</b></td>  
            <td class="center blueColor"><b>所属公司</b></td>  
            <td class="center blueColor"><b>担任职务</b></td>
            <td class="center blueColor"><b>任职时间</b></td>
         </tr>
		<#if businessRegistrationDetail?? && businessRegistrationDetail?size gt 0> 
		<#list businessRegistrationDetail as businessRegistration>
			<tr style="background:#ffffff;">
				<td class="center">${businessRegistration_index?if_exists+1}</td>
				<td class="center">${businessRegistration.companyName}</td>
				<td class="center">${businessRegistration.jobs}</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#list>
		<#else>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr>
		</#if>
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:160px;" rowspan="2"><b>十、股权激励管理</b></td>  
            <td class="center blueColor" style="width:40px;"><b>序号</b></td>  
            <td class="center blueColor"><b>购股时间</b></td>  
            <td class="center blueColor"><b>持有股份</b></td>
            <td class="center blueColor"><b>购股金</b></td>
            <td class="center blueColor"><b>持股公司</b></td>
         </tr>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
      </table>
      <table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
            <td class="left blueColor" style="width:160px;" rowspan="2"><b>十一、离职时间</b></td>  
            <td class="center blueColor" style="width:150px;"><b>离职时间</b></td>  
            <td class="center blueColor"><b>离职时岗位</b></td>  
            <td class="center blueColor"><b>离职手续办理情况</b></td>
            <td class="center blueColor"><b>是否结算</b></td>
         </tr>
			<tr style="background:#ffffff;">
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
      </table>
      <table cellspacing="0" cellpadding="0" style="margin-left:12px;margin-top:2px;width:100%;table-layout:fixed; word-break:break-strict;">
      <tr>
      			<td class="center">编制：${currentPersonMemberName}</td>
				<td class="center">审核：</td>
				<td class="center">审批：</td>
				<td class="center"> 编制单位：</td>
				<td class="center"> 编制时间：${currentCreateDate}</td>
      </tr>
      </table>
   </div> 
</body>  
</html>   