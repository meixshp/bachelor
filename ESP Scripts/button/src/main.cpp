#include <Arduino.h>
#include <ezButton.h>
#include <WiFi.h>
#include <WebServer.h>

#define DEBOUNCE_TIME 50 // the debounce time in millisecond, increase this time if it still chatters

const char* ssid = "Uschi Glas 123";  // Enter SSID here
const char* password = "78114472401919641055";  //Enter Password here
const char* sensorName = "MaysZimmer";
ezButton button(21); // create ezButton object that attach to pin GIOP21

WebServer server(80);
int stateOfButton = 0;

void handle_OnConnect(void);
void handle_NotFound(void);

void setup() {
  Serial.begin(9600);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to  Wifi..");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.print("\nConnected");
  server.on("/", handle_OnConnect);
  server.onNotFound(handle_NotFound);
  server.begin();
  Serial.println("\nHTTP server started");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  button.setDebounceTime(DEBOUNCE_TIME); // set debounce time to 50 milliseconds
}

void loop() {
  button.loop(); // MUST call the loop() function first
  if (button.isPressed()) {
    Serial.println("1");
    stateOfButton = 1;
  }

  if (button.isReleased()) {
    Serial.println("0");
    stateOfButton = 0;
  }

  server.handleClient();  
}

void handle_OnConnect() {
  String json = "{\"location\":\""+String(sensorName)+"\",\"buttonPressed\":"+int(stateOfButton)+"}";
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.send(200, "application/json", json); 
  Serial.println("sent header");
}

void handle_NotFound(){
  server.send(404, "text/plain", "Not found");
  Serial.println("Error: Not found");
}