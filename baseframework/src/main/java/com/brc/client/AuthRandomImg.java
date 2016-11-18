 package com.brc.client;
 
 import com.brc.util.RandomString;
 import java.awt.Color;
 import java.awt.Font;
 import java.awt.Graphics;
 import java.awt.image.BufferedImage;
 import java.io.IOException;
 import java.util.Date;
 import java.util.Random;
 import javax.imageio.ImageIO;
 import javax.servlet.ServletException;
 import javax.servlet.http.HttpServlet;
 import javax.servlet.http.HttpServletRequest;
 import javax.servlet.http.HttpServletResponse;
 import javax.servlet.http.HttpSession;
 
 public class AuthRandomImg extends HttpServlet
 {
   private Font mFont = new Font("Arial Black", 0, 16);
 
   public void init() throws ServletException {
     super.init();
   }
 
   Color getRandColor(int fc, int bc) {
     Random random = new Random(new Date().getTime());
     if (fc > 255)
       fc = 255;
     if (bc > 255)
       bc = 255;
     int r = fc + random.nextInt(bc - fc);
     int g = fc + random.nextInt(bc - fc);
     int b = fc + random.nextInt(bc - fc);
     return new Color(r, g, b);
   }
 
   public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
   {
     response.setHeader("Pragma", "No-cache");
     response.setHeader("Cache-Control", "no-cache");
     response.setDateHeader("Expires", 0L);
     response.setContentType("image/jpeg");
     request.getSession().removeAttribute("rand");
 
     int width = 65; int height = 25;
     BufferedImage image = new BufferedImage(width, height, 1);
 
     Graphics g = image.getGraphics();
 
     g.setColor(new Color(14474460));
     g.fillRect(0, 0, width, height);
 
     g.setColor(Color.black);
     g.drawRect(0, 0, width - 1, height - 1);
     g.setFont(this.mFont);
     Random random = new Random(new Date().getTime());
 
     String rand = RandomString.getInstance().getRandomString(4, "iu");
 
     request.getSession().setAttribute("securityCode", rand);
 
     g.setColor(Color.black);
     g.setFont(new Font("Atlantic Inline", 0, 18));
     for (int i = 0; i < rand.length(); i++) {
       g.setColor(getRandColor(10, 150));
       g.drawString(rand.substring(i, i + 1), 12 * i + 7 + random.nextInt(5), 15 + random.nextInt(7));
     }
 
     for (int i = 0; i < 200; i++) {
       int x = random.nextInt(width);
       int y = random.nextInt(height);
       g.setColor(getRandColor(10, 250));
       g.drawOval(x, y, 0, 0);
     }
 
     g.dispose();
 
     ImageIO.write(image, "JPEG", response.getOutputStream());
   }
 }

