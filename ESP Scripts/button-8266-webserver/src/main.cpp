#include <Arduino.h>
#include <WebSocketsServer.h>
#include <ESPAsyncWebServer.h>
#include <ezButton.h>

#define DEBOUNCE_TIME 50 // the debounce time in millisecond, increase this time if it still chatters

const char* ssid = "Uschi Glas 123";  // Enter SSID here
const char* password = "78114472401919641055";  //Enter Password here
const char* sensorName = "MaysZimmer";
ezButton button(2); // create ezButton object that attach to pin GIOP21

AsyncWebServer server(80);
WebSocketsServer webSocket = WebSocketsServer(1337);
char msg_buf[10];
int stateOfButton = 0;


void onWebSocketEvent(uint8_t client_num, WStype_t type, uint8_t * payload, size_t length) {

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
                sprintf(msg_buf, "%d", stateOfButton);
                Serial.printf("Sending to [%u]: %s\n", client_num, msg_buf);
                webSocket.sendTXT(client_num, msg_buf);
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

void setup() {
    Serial.begin(9600);
    WiFi.begin(ssid, password);
    Serial.print("Connecting to  Wifi..");

    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }

    Serial.print("\nConnected");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    server.begin();
    webSocket.begin();
    webSocket.onEvent(onWebSocketEvent);
}

void loop() {
    webSocket.loop();
    // put your main code here, to run repeatedly:
    button.loop(); // MUST call the loop() function first
    if (button.isPressed()) {
        Serial.println("1");
        stateOfButton = 1;
    }

    if (button.isReleased()) {
        Serial.println("0");
        stateOfButton = 0;
    }
}
