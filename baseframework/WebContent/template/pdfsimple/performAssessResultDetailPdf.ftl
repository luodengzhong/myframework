<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>测评结果单</title>  
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
                size:  210mm 297mm;
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
<div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
 <br></br>
  <div align="center" style="font-weight:bold;font-size:20px;height:20px;">  
          <b>员工【${staffName}】测评结果分数</b>
   </div>
   <div style="height:15px;font-size:14px;"></div>
   <table  cellspacing="0px" cellpadding="0px"  style="border-width:1px;" >
    	<tr>
          <td width="15%" align="left" colspan="2">被考核对象姓名:${staffName}</td>
          <td width="15%" align="left" colspan="4">任务名称:${formName}</td>
        </tr>
         <tr>
          <td  align="left" colspan="2">年龄:${age}</td>
          <td  align="left" colspan="2">单位:${ognName}</td>
          <td  align="left" colspan="2" >现任岗位:${posName}</td>
        </tr>
         <tr>
          <td  align="left" colspan="2">入职时间:<@formatdate date=employedDate/></td>
          <td  align="left" colspan="2">性别:${sexTextView?default("")?html}</td>
          <td  align="left" colspan="2">学历:${educationTextView?default("")?html}</td>
        </tr>
         <tr>
         <td  style='height: 40px;text-align: center;'>测评内容</td>	
		<td  style='height: 40px;text-align: center;'>上级平均分</td>	
		<td   style='height: 40px;text-align: center;'>业务横向平均分</td>	
		<td style='height: 40px;text-align: center;'>下级平均分</td>	
		<td style='height: 40px;text-align: center;'>合计平均分</td>	
		<td style='height: 40px;text-align: center;'>自评分</td>		
        </tr>
        <tr>			
		<td  style='height: 40px;text-align: center;'>合计</td>	
		<td style='height: 40px;text-align: center;'>${upLevelAverageScore}</td>	
		<td style='height: 40px;text-align: center;'>${equelLevelAverageScore}</td>	
		<td style='height: 40px;text-align: center;'>${lowLevelAverageScore}</td>	
		<td style='height: 40px;text-align: center;'>${totalAverage}</td>	
		<td style='height: 40px;text-align: center;'>${scoreMyself}</td>		
		</tr>
        <tr>
		<td   rowspan="4"    style='text-align: center;'>素 质 测 评</td>
		 <td  style='height: 40px;text-align: center;'>参加测评人员</td>
		<td colspan="4" style='height: 40px;'>${personAnalyze}</td>
		
		</tr>
	   <tr>
	    <td style='height: 70px;text-align: center;'>指标得分排名前三项</td>
		<td colspan="4" style='height: 70px;'>${topAnalyze}</td>
		
		</tr>
		<tr>
		<td class="title" style='height: 70px;text-align: center;'>指标得分排名后三项</td>
		<td colspan="4" style='height: 70px;'>${lowAnalyze}</td>
		
		</tr>
   </table>
</body>  
</html>   