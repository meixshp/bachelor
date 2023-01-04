#include <Arduino.h> 
#include <WebSocketsServer.h>
#include <ESPAsyncWebServer.h>

//const char* ssid = "Uschi Glas 123";                // fuwa zuhause
//const char* password = "78114472401919641055"; 
//const char* ssid = "FRITZ!Box 7412";                // spiellabor
//const char* password = "94639519706248825595";
const char* ssid = "WLAN-172715";                     // mom zuhause
const char* password = "78702967250420176341";

const char* sensorName = "MaysZimmer";

AsyncWebServer server(90);
WebSocketsServer webSocket = WebSocketsServer(1338);
char msg_buf[10];

unsigned long previousMillisGetHR = 0;  //--> will store the last time Millis (to get Heartbeat) was updated.
unsigned long previousMillisHR = 0;     //--> will store the last time Millis (to get BPM) was updated.

const long intervalGetHR = 10;          //--> Interval for reading heart rate (Heartbeat) = 10ms.
const long intervalHR = 10000;          //--> Interval for obtaining the BPM value based on the sample is 10 seconds.
   
const int PulseSensorHRWire = 0;        //--> PulseSensor connected to ANALOG PIN 0 (A0 / ADC 0).             
int LED13 = 2;                          //--> LED to detect when the heart is beating. The LED is connected to PIN D1 (GPIO5) on the NodeMCU ESP12E.

int Threshold = 550;                    //--> Determine which Signal to "count as a beat" and which to ignore.
int cntHB = 0;                          //--> Variable for counting the number of heartbeats.
boolean ThresholdStat = true;           //--> Variable for triggers in calculating heartbeats.
int BPMval = 0;                         //--> Variable to hold the result of heartbeats calculation.
int tempVal = 0;
bool trackingStart = false;
uint8_t clientnum;

void onWebSocketEvent(uint8_t client_num, WStype_t type, uint8_t * payload, size_t length) {
    clientnum = client_num;
    // figuring out which ws event is occuring
    switch(type) { 
        case WStype_DISCONNECTED:
            Serial.printf("[%u] Disconnected!\n", client_num);
            break;

        case WStype_CONNECTED:
            {
                IPAddress ip = webSocket.remoteIP(client_num);
                Serial.printf("[%u] Connection from ", client_num);
                Serial.println(ip.toString());
            }
            break;
        
        case WStype_TEXT:
            Serial.printf("[%u] Received text: %s\n", client_num, payload);
            if( strcmp((char *)payload, "getState") == 0) {
                sprintf(msg_buf, "%d", BPMval);
                Serial.printf("Sending to [%u]: %s\n", client_num, msg_buf);
                webSocket.sendTXT(client_num, msg_buf);
                trackingStart = true;
            } else {
                Serial.println("[%u] Message not recognized");
            }
            break;
        
        case WStype_BIN:
        case WStype_ERROR:
        case WStype_FRAGMENT_TEXT_START:
        case WStype_FRAGMENT_BIN_START:
        case WStype_FRAGMENT:
        case WStype_FRAGMENT_FIN:
        default:
            break;
    }
}

void trackCommand() {
    if (tempVal != BPMval) {
        sprintf(msg_buf, "%d", BPMval);
        Serial.printf("Sending to [%u]: %s\n", clientnum, msg_buf);
        webSocket.sendTXT(clientnum, msg_buf);
        tempVal = BPMval;
    }
}

void GetHeartRate() {
  // process for getting heartbeats
  unsigned long currentMillisGetHR = millis();

  if (currentMillisGetHR - previousMillisGetHR >= intervalGetHR) {
    previousMillisGetHR = currentMillisGetHR;

    int PulseSensorHRVal = analogRead(PulseSensorHRWire);

    if (PulseSensorHRVal < Threshold && ThresholdStat == true) {
      cntHB++;
      ThresholdStat = false;
      digitalWrite(LED13,LOW);
    }

    if (PulseSensorHRVal > Threshold) {
      ThresholdStat = true;
      digitalWrite(LED13,HIGH);
    }
  }

  // process for printing the BPM value every 10 sec
  unsigned long currentMillisHR = millis();

  if (currentMillisHR - previousMillisHR >= intervalHR) {
    previousMillisHR = currentMillisHR;

    BPMval = cntHB * 6; 
    Serial.print("BPM : ");
    Serial.println(BPMval);
    
    cntHB = 0;
  }
}

void setup() {
    pinMode(LED13,OUTPUT);     
    Serial.begin(9600);          

    WiFi.begin(ssid, password);
    Serial.print("Connecting to  Wifi..");

    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      Serial.print(".");
    }

    Serial.print("\nConnected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    server.begin();
    webSocket.begin();
    webSocket.onEvent(onWebSocketEvent);
}

void loop() {
    webSocket.loop();
    if (trackingStart)
        trackCommand();   
    GetHeartRate();
}