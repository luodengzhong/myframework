<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>费用立项申请单</title>  
        <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    border-bottom: 1px solid #000000;
            }
            
            table.print{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
            }
            
            table.print tr{  
               height: 35px;text-align: left;
            } 
                        
            table.print td{
               border-right: 1px solid #000000;height:25px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word;
            }
            table.print td.center{
                width:100px;
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table.print td.left{
                width:100px;
            	text-align: left;
            	padding-left:5px;
            	word-break: break-all;word-wrap: break-word;
            }
            table.tableInput{
				font-size:9pt;
				width:100%;
				table-layout:fixed;
				word-wrap:break-word; 
                word-break:break-all;
			    border: 1px solid #000000;
			    border-width: 1px 0 0 1px;
			}
			
			table.tableInput td{
				border: 1px solid #000000;
			    border-width: 0 1px 1px 0;
			    height:auto;
			    min-height:15px;
			    vertical-align:middle;
				word-break:break-all;
				word-wrap:break-word;
			}
			table.tableInput td div.textLabel{
				padding-left:5px;
			}
            @page {    
              size:  210mm 297mm;
              @bottom-right {  
                    content: "KJ-A04-01[A/0版]";  
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
	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <div align="center" style="font-weight:bold;">  
          <#if kind == 'management'>
          	<h2>管理费用立项</h2>
          <#elseif kind == 'hrfee'>
           	<h2>人力费用立项</h2>
          <#elseif kind == 'mmfee'>
           	<h2>行政费用立项</h2>
          <#else>
          	<h2>营销费用立项</h2>
          </#if>
      </div>
      <div>
			<span style="float: left; margin-left: 10px;font-weight:bold;"> 
				单据号码：<strong>${billCode}</strong> &nbsp;&nbsp;
				制单日期：<strong><@formatdate date=fillinDate/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				制单人：<strong>${organName}.${deptName}.${personMemberName}</strong>
			</span>
      </div>
      <br></br>
      <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr>  
            <td class="center">立项编号</td>  
            <td class="left">${code}</td>  
            <td class="center">主题</td>  
            <td class="left" colspan="3">${summary}</td>  
         </tr>  
         <tr>  
            <td class="center">立项类别</td>  
            <td class="left">${setupProjectKindName}</td>  
            <td class="center">费用账套</td>  
            <td class="left">${accountName}</td>  
            <td class="center">立项年月</td>  
            <td class="left">${period}</td>  
         </tr>
         <tr>  
            <td class="center">是否增补</td>  
            <td class="left"><#if isAdditional == '0'>否<#else>是</#if></td>  
            <td class="center">主立项名称</td>  
            <td class="left">${parentSetupProjectName}</td>  
            <td class="center">签订合同日期</td>  
            <td class="left"><@formatdate date=signContractDate/></td>  
         </tr>
         <tr>  
            <td class="center">确定单位日期</td>  
            <td class="left"><@formatdate date=determineSupplierDate/></td>  
            <td class="center">是否定向</td>  
            <td class="left"><#if isDirectional == '0'>否<#else>是</#if></td>  
            <td class="center">合作方式</td>  
            <td class="left" >${cooperationKindName}</td>  
         </tr>
         <tr>  
            <td class="center">乙方单位</td>  
            <td class="left">${supplierName}</td>  
            <td class="center">开工日期</td>  
            <td class="left"><@formatdate date=startDate/></td>  
            <td class="center">完工日期</td>  
            <td class="left"><@formatdate date=completeDate/></td>  
         </tr>
         <tr>  
         	<#if kind == 'management'>
				<td class="center">立项金额</td>  
	            <td class="left">${setupProjectAmount}</td>  
	            <td class="center" colspan="4"></td>  
			<#else>
				<td class="center">媒体类别</td>  
	            <td class="left">${mediaKindName}</td>  
				<td class="center">立项金额</td>  
	            <td class="left">${setupProjectAmount}</td>  
	            <td class="center" colspan="2"></td>  
			</#if>
           
           
         </tr>
      </table>
      <br/>
      <#if budgetDetail?? && budgetDetail?size gt 0> 
    <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>分摊明细</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>
      		<td class="center" style="width:5px;"><b>序号</b></td> 
            <td class="center" style="width:30px;"><b>立项期间</b></td>  
            <td class="center" style="width:200px;"><b>预算指标项</b></td>
            <td class="center" style="width:120px;"><b>使用人</b></td>
            <td class="center" style="width:40px;"><b>分摊金额</b></td>
      		<td class="center" style="width:115px;"><b>备注</b></td> 
         </tr>
		<#list budgetDetail as detail>
			<tr >
				<td class="center">${detail_index?if_exists+1}</td>
				<td class="center">${detail.xbizName}</td>
				<td class="center">${detail.oname}/${detail.ybizName}</td>
				<td class="center">${detail.feeUserName}</td>
				<td class="center">${detail.amount}</td>
				<td class="center">${detail.remark}</td>
			</tr> 
		</#list>
      </table>
      <br/>
      <#else>
	  </#if>
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   