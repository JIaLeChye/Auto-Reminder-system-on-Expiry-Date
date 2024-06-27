# AERIMS(Auto Expiry Reminder with Inventory Management System)
- Hi, Welcome to my project. this is my final year project for my Diploma.
- I'm taking Diploma in Electronics Engineering (Computer) at the Polytechnique of Kota Kinabalu Sabah.
- I build this project for my Diploma level final year project.
- The database is built on the local database.
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
- The ESP32 in the scanner will be connected to the MQTT Server online (EMQX is used in my case)
- The scanner (AERIMS Scanner) will send the NUID Scanned to the MQTT Server 
- The server machine (where all the data - The server machine will database is located) will receive NUID from the server
- After some process(Refer to server.js) it will display the data on the website (AERIMS WEB) 
*Most of the function is built in the server.js including calculating, categorising and sending notifications. 



<br> 
- For any Enquiry Feel Free to contact me via <a href="mailto:jailecjl2016@gmail.com" > Email </a> 
