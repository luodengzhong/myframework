 package com.brc.util;
 
 import java.io.ByteArrayInputStream;
 import java.io.ByteArrayOutputStream;
 import java.io.InputStream;
 import java.io.OutputStream;
 import java.io.PrintStream;
 import java.security.MessageDigest;
 import javax.crypto.Cipher;
 import javax.crypto.SecretKey;
 import javax.crypto.SecretKeyFactory;
 import javax.crypto.spec.PBEKeySpec;
 import javax.crypto.spec.PBEParameterSpec;
 import javax.mail.internet.MimeUtility;
 
 public class EncryptUrlPara
 {
   private static final int ITERATIONS = 20;
   private static final String KEY = "PBEWithMD5AndDES";
 
   public static byte[] encode(byte[] b)
     throws Exception
   {
     ByteArrayOutputStream baos = null;
     OutputStream b64os = null;
     try {
       baos = new ByteArrayOutputStream();
       b64os = MimeUtility.encode(baos, "base64");
       b64os.write(b);
       b64os.close();
       return baos.toByteArray();
     } catch (Exception e) {
       throw new Exception(e);
     } finally {
       try {
         if (baos != null) {
           baos.close();
           baos = null;
         }
       } catch (Exception e) {
       }
       try {
         if (b64os != null) {
           b64os.close();
           b64os = null;
         }
       } catch (Exception e) {
       }
     }
   }
 
   public static byte[] decode(byte[] b) throws Exception {
     ByteArrayInputStream bais = null;
     InputStream b64is = null;
     try {
       bais = new ByteArrayInputStream(b);
       b64is = MimeUtility.decode(bais, "base64");
       byte[] tmp = new byte[b.length];
       int n = b64is.read(tmp);
       byte[] res = new byte[n];
       System.arraycopy(tmp, 0, res, 0, n);
       return res;
     } catch (Exception e) {
       throw new Exception(e);
     } finally {
       try {
         if (bais != null) {
           bais.close();
           bais = null;
         }
       } catch (Exception e) {
       }
       try {
         if (b64is != null) {
           b64is.close();
           b64is = null;
         }
       }
       catch (Exception e)
       {
       }
     }
   }
 
   public static String encrypt(String key, String plainText)
     throws Exception
   {
     try
     {
       byte[] salt = new byte[8];
       MessageDigest md = MessageDigest.getInstance("MD5");
       md.update(key.getBytes());
       byte[] digest = md.digest();
       for (int i = 0; i < 8; i++) {
         salt[i] = digest[i];
       }
       PBEKeySpec pbeKeySpec = new PBEKeySpec(key.toCharArray());
       SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("PBEWithMD5AndDES");
       SecretKey skey = keyFactory.generateSecret(pbeKeySpec);
       PBEParameterSpec paramSpec = new PBEParameterSpec(salt, 20);
       Cipher cipher = Cipher.getInstance("PBEWithMD5AndDES");
       cipher.init(1, skey, paramSpec);
       byte[] cipherText = cipher.doFinal(plainText.getBytes());
       String saltString = new String(encode(salt));
       String ciphertextString = new String(encode(cipherText));
       return saltString + ciphertextString;
     } catch (Exception e) {
       e.printStackTrace();
       throw new Exception("Encrypt Text Error:" + e.getMessage(), e);
     }
   }
 
   public static String decrypt(String key, String encryptTxt)
     throws Exception
   {
     int saltLength = 12;
     try {
       String salt = encryptTxt.substring(0, saltLength);
       String ciphertext = encryptTxt.substring(saltLength, encryptTxt.length());
       byte[] saltarray = decode(salt.getBytes());
       byte[] ciphertextArray = decode(ciphertext.getBytes());
       PBEKeySpec keySpec = new PBEKeySpec(key.toCharArray());
       SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("PBEWithMD5AndDES");
       SecretKey skey = keyFactory.generateSecret(keySpec);
       PBEParameterSpec paramSpec = new PBEParameterSpec(saltarray, 20);
       Cipher cipher = Cipher.getInstance("PBEWithMD5AndDES");
       cipher.init(2, skey, paramSpec);
       byte[] plaintextArray = cipher.doFinal(ciphertextArray);
       return new String(plaintextArray);
     } catch (Exception e) {
       throw new Exception(e);
     }
   }
 
   public static void main(String[] args) {
     String encryptTxt = "";
     String plainTxt = "111110101010101";
     try {
       System.out.println(plainTxt);
       encryptTxt = encrypt("mypassword01", plainTxt);
 
       String urlencode = StringUtil.stringToAscii(encryptTxt);
       plainTxt = decrypt("mypassword01", encryptTxt);
       System.out.println(encryptTxt);
       System.out.println(urlencode);
       System.out.println(StringUtil.asciiToString(urlencode));
       System.out.println(plainTxt);
       String a = "xxin";
       String b = encrypt("encrypturlparakeyxx", a);
       System.out.println("dd::" + StringUtil.stringToAscii(b));
     } catch (Exception e) {
       e.printStackTrace();
       System.exit(-1);
     }
   }
 }

