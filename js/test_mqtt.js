const mqtt = require('mqtt');

// Connect to te MQTT server  
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const username = 'Web';
const password = 'web123';
const topic = 'aerims/nuid';
const qos =  2; 
const mqtt_URL =  'mqtts://j6ee141d.ala.us-east-1.emqxsl.com:8883/mqtt'

const mqtt_option  = 
{
    clientId,
    username, 
    password,
    //qos, 
}
const mqttClient = mqtt.connect(mqtt_URL, mqtt_option);




mqttClient.on('connect', () => 
{
    console.log('Connected to teh MQTT Broker'); 
   
});


mqttClient.subscribe(topic, { qos }, (error) => {
    if (error) {
      console.log('subscribe error:', error)
      return
    }
    console.log(`Subscribe to topic '${topic}'`)
  })


mqttClient.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
  })

mqttClient.on('error', (error) => 
{
    console.error('MQTT Connection ERROR', error);
}); 

