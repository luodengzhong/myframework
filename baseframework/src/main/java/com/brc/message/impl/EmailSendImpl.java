 package com.brc.message.impl;
 
 import com.brc.exception.ApplicationException;
 import com.brc.message.EmailSend;
 import com.brc.util.LogHome;
 import com.brc.util.Singleton;
 import java.util.Date;
 import java.util.Enumeration;
 import java.util.Properties;
 import java.util.Vector;
 import javax.activation.DataHandler;
 import javax.activation.FileDataSource;
 import javax.mail.BodyPart;
 import javax.mail.Message;
 import javax.mail.Message.RecipientType;
 import javax.mail.MessagingException;
 import javax.mail.Multipart;
 import javax.mail.Session;
 import javax.mail.Transport;
 import javax.mail.internet.AddressException;
 import javax.mail.internet.InternetAddress;
 import javax.mail.internet.MimeBodyPart;
 import javax.mail.internet.MimeMessage;
 import javax.mail.internet.MimeMultipart;
 import org.apache.log4j.Logger;
 
 public class EmailSendImpl
   implements EmailSend
 {
   private String filename = "";
 
   public String getHost()
   {
     return (String)Singleton.getParameter("EMAIL_HOST", String.class);
   }
 
   public String getFromEmail() {
     return (String)Singleton.getParameter("EMAIL_FROMADDR", String.class);
   }
 
   public String getFromPassword() {
     return (String)Singleton.getParameter("EMAIL_FROMPASSWORD", String.class);
   }
 
   public void doSendEmail(String content, String title, String email)
     throws Exception
   {
     if ((getHost() == null) || (getHost().equals("")) || (getFromEmail() == null) || (getFromEmail().equals("")) || (getFromPassword() == null) || (getFromPassword().equals("")))
     {
       throw new ApplicationException("邮件发送需要信息不完整!");
     }
     if ((email == null) || (email.equals(""))) {
       throw new ApplicationException("邮箱地址为空，无法发送!");
     }
     Properties props = new Properties();
     props.setProperty("mail.smtp.auth", "true");
     props.setProperty("mail.transport.protocol", "smtp");
     Session session = Session.getInstance(props);
     Message msg = new MimeMessage(session);
     try {
       msg.setFrom(new InternetAddress(getFromEmail()));
       InternetAddress[] addressTo = { new InternetAddress(email) };
       msg.setRecipients(Message.RecipientType.TO, addressTo);
       msg.setSubject(title);
       Multipart multipart = new MimeMultipart();
       BodyPart contentPart = new MimeBodyPart();
       contentPart.setContent(content, "text/html;charset=GBK");
       multipart.addBodyPart(contentPart);
       msg.setContent(multipart);
       msg.setSentDate(new Date());
       try {
         Transport transport = session.getTransport();
 
         transport.connect(getHost(), getFromEmail(), getFromPassword());
 
         transport.sendMessage(msg, new InternetAddress[] { new InternetAddress(email) });
         transport.close();
       } catch (Exception e) {
         e.printStackTrace();
         doSendAsError(content, title, email);
       }
     } catch (MessagingException e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       throw new Exception(e);
     }
   }
 
   private void doSendAsError(String content, String title, String email)
     throws Exception
   {
     Properties p = new Properties();
     p.put("mail.smtp.host", getHost());
     p.put("mail.smtp.auth", "true");
     try {
       Session session = Session.getDefaultInstance(p);
       MimeMessage message = new MimeMessage(session);
       message.setFrom(new InternetAddress(getFromEmail()));
       InternetAddress[] addressTo = { new InternetAddress(email) };
       message.setRecipients(Message.RecipientType.TO, addressTo);
       message.setSubject(title);
       Multipart multipart = new MimeMultipart();
       BodyPart contentPart = new MimeBodyPart();
       contentPart.setContent(content, "text/html;charset=GBK");
       multipart.addBodyPart(contentPart);
       message.setContent(multipart);
       message.setSentDate(new Date());
       try {
         Transport.send(message, message.getAllRecipients());
       } catch (Exception e) {
         session.getProperties().remove("mail.smtp.auth");
         Transport.send(message, message.getAllRecipients());
       }
     } catch (AddressException e1) {
       e1.printStackTrace();
       throw new Exception(e1);
     } catch (MessagingException e1) {
       e1.printStackTrace();
       throw new Exception(e1);
     }
   }
 
   public void doSendEmailWithAttachment(String content, String title, String email, Vector file)
     throws Exception
   {
     if ((getHost() == null) || (getHost().equals("")) || (getFromEmail() == null) || (getFromEmail().equals("")) || (getFromPassword() == null) || (getFromPassword().equals("")))
     {
       throw new ApplicationException("邮件发送需要信息不完整!");
     }
     if ((email == null) || (email.equals(""))) {
       throw new ApplicationException("邮箱地址为空，无法发送!");
     }
     Properties props = new Properties();
     props.setProperty("mail.smtp.auth", "true");
     props.setProperty("mail.transport.protocol", "smtp");
     Session session = Session.getInstance(props);
     Message msg = new MimeMessage(session);
     try {
       msg.setFrom(new InternetAddress(getFromEmail()));
       InternetAddress[] addressTo = { new InternetAddress(email) };
       msg.setRecipients(Message.RecipientType.TO, addressTo);
       msg.setSubject(title);
       Multipart multipart = new MimeMultipart();
       BodyPart contentPart = new MimeBodyPart();
       contentPart.setContent(content, "text/html;charset=GBK");
       multipart.addBodyPart(contentPart);
 
       if (!file.isEmpty()) {
         Enumeration efile = file.elements();
         while (efile.hasMoreElements()) {
           contentPart = new MimeBodyPart();
           this.filename = efile.nextElement().toString();
           FileDataSource fds = new FileDataSource(this.filename);
           contentPart.setDataHandler(new DataHandler(fds));
           contentPart.setFileName(fds.getName());
           multipart.addBodyPart(contentPart);
         }
         file.removeAllElements();
       }
 
       msg.setContent(multipart);
       msg.setSentDate(new Date());
       try {
         Transport transport = session.getTransport();
 
         transport.connect(getHost(), getFromEmail(), getFromPassword());
 
         transport.sendMessage(msg, new InternetAddress[] { new InternetAddress(email) });
         transport.close();
       } catch (Exception e) {
         e.printStackTrace();
         doSendAsErrorWithAttachment(content, title, email, file);
       }
     } catch (MessagingException e) {
       e.printStackTrace();
       LogHome.getLog(this).error(e);
       throw new Exception(e);
     }
   }
 
   private void doSendAsErrorWithAttachment(String content, String title, String email, Vector file)
     throws Exception
   {
     Properties p = new Properties();
     p.put("mail.smtp.host", getHost());
     p.put("mail.smtp.auth", "true");
     try {
       Session session = Session.getDefaultInstance(p);
       MimeMessage message = new MimeMessage(session);
       message.setFrom(new InternetAddress(getFromEmail()));
       InternetAddress[] addressTo = { new InternetAddress(email) };
       message.setRecipients(Message.RecipientType.TO, addressTo);
       message.setSubject(title);
       Multipart multipart = new MimeMultipart();
       BodyPart contentPart = new MimeBodyPart();
       contentPart.setContent(content, "text/html;charset=GBK");
       multipart.addBodyPart(contentPart);
 
       if (!file.isEmpty()) {
         Enumeration efile = file.elements();
         while (efile.hasMoreElements()) {
           contentPart = new MimeBodyPart();
           this.filename = efile.nextElement().toString();
           FileDataSource fds = new FileDataSource(this.filename);
           contentPart.setDataHandler(new DataHandler(fds));
           contentPart.setFileName(fds.getName());
           multipart.addBodyPart(contentPart);
         }
         file.removeAllElements();
       }
 
       message.setContent(multipart);
       message.setSentDate(new Date());
       try {
         Transport.send(message, message.getAllRecipients());
       } catch (Exception e) {
         session.getProperties().remove("mail.smtp.auth");
         Transport.send(message, message.getAllRecipients());
       }
     } catch (AddressException e1) {
       e1.printStackTrace();
       throw new Exception(e1);
     } catch (MessagingException e1) {
       e1.printStackTrace();
       throw new Exception(e1);
     }
   }
 }

