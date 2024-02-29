# AERIMS(Auto Expiry Reminder with Inventory management System)
- Hi, Welcome to my project. this is my final year project for my Diploma.
- I'm taking Diploma in Electronics Engineering (Computer) at the Polytechnique of Kota Kinabalu Sabah.
- I build this project for my Diploma level final year project.
- The database is buid in local database.
- In my case MySQL with Xampp is used as my database container.

<br> 
///////////////////////////////////////// <br> 
------------DESCRIPTION------------   <br> 
//////////////////////////////////////// <br> 
<br>

- This project is an Auto Reminder System on the Expiry date. <br> 
- This project is based on ESP32. MQTT broker by EMQX and MySQL database <br> 
- This source code in this project might be in C language (Platform IO), js, HTML, CSS(For the Server Side) <br>


<br>
##############################<br>
--------How it works? -------<br>
##############################<br> 
- The ESP32 in the scanner wil be conected to the MQTT Server online (EMQX is used in my case)
- The scaner (AERIMS Scaner) will send the NUID Scanned to the MQTT Server 
- The server machine (wich all the dat- The server machine wil dataabase is located) will recive NUID from the server
- After some process(Refer to server.js) it wil display the datas on the website (AERIMS WEB) 
*Most of the function is build in the server.js including calculating, catogorise and send notification. 



<br> 
- For any Enquiry Feel Free to contact me via <a href="mailto:jailecjl2016@gmail.com" > Email </a> 
