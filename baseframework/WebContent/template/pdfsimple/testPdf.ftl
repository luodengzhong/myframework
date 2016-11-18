<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>${title}</title>  
  <style>  
     body { font-family: SimSun;}
     table {  
         width:100%;
     }  
     td {  
            border: 1px solid #000000;
            word-wrap:break-word; 
            word-break:break-all;
     }  
     @page {    
              size: 8.5in 11in;   
              @bottom-right {  
                    content: "page " counter(page) " of  " counter(pages);  
              }  
     }  
  </style>  
</head>  
<body>  

      <div align="center" style="page-break-after:always">  
      	  <h1>测试001</h1>  
          <h1>${title}</h1>  
      </div>  
      <table style="table-layout:fixed; word-break:break-strict;">  
         <tr>  
            <td style="width:100px;"><b>Name</b></td>  
            <td style="width:200px;"><b>Age</b></td>  
            <td style="width:200px;"><b>Sex</b></td>  
         </tr>  
         <#list userList as user>  
            <tr>  
                <td>${user.name}测试测试测试测试测试测试测试测试测试测试测试</td>  
                <td>${user.age}</td>  
                <td>  
                   <#if user.sex = 1>  
                         male  
                   <#else>  
                         female  
                   </#if>  
                </td>  
            </tr>  
         </#list>  
      </table>  

</body>  
</html>   