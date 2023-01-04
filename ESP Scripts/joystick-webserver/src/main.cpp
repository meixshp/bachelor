#include <Arduino.h>
#include <WebSocketsServer.h>
#include <ESPAsyncWebServer.h>

//const char* ssid = "Uschi Glas 123";              // fuwa zuhause
//const char* password = "78114472401919641055";  
//const char* ssid = "FRITZ!Box 7412";              // spiellabor
//const char* password = "94639519706248825595";
const char* ssid = "WLAN-172715";                   // mom zuhause
const char* password = "78702967250420176341";

AsyncWebServer server(90);
WebSocketsServer webSocket = WebSocketsServer(1338);
char msg_buf[10];

#define VRX_PIN  35 // Arduino pin connected to VRX pin
#define VRY_PIN  34 // Arduino pin connected to VRY pin

#define LEFT_THRESHOLD  1500
#define RIGHT_THRESHOLD 3000
#define UP_THRESHOLD    1500
#define DOWN_THRESHOLD  3000

#define COMMAND_NO     0x00
#define COMMAND_LEFT   0x01
#define COMMAND_RIGHT  0x02
#define COMMAND_UP     0x04
#define COMMAND_DOWN   0x08

int xValue = 0 ; // To store value of the X axis
int yValue = 0 ; // To store value of the Y axis
int command = COMMAND_NO;
int tempCommand = 0;
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
                sprintf(msg_buf, "%d", command);
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
    if (tempCommand != command) {
        sprintf(msg_buf, "%d", command);
        Serial.printf("Sending to [%u]: %s\n", clientnum, msg_buf);
        webSocket.sendTXT(clientnum, msg_buf);
        tempCommand = command;
    }
}

void setup() {
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
    // read analog X and Y analog values
    xValue = analogRead(VRX_PIN);
    yValue = analogRead(VRY_PIN);
   
    if (trackingStart)
        trackCommand();    
    
    // converts the analog value to commands
    // resetting commands 
    command = COMMAND_NO;

    // check left and right commands
    if (xValue < LEFT_THRESHOLD)
        command = command | COMMAND_LEFT;
    else if (xValue > RIGHT_THRESHOLD)
        command = command | COMMAND_RIGHT;

    // check up and down commands
    if (yValue < UP_THRESHOLD)
        command = command | COMMAND_UP;
    else if (yValue > DOWN_THRESHOLD)
        command = command | COMMAND_DOWN;
}