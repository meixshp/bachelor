#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "Uschi Glas 123";  // Enter SSID here
const char* password = "78114472401919641055";  //Enter Password here
const char* sensorName = "MaysZimmer";
WebServer server(90);

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

}

void loop() {
  // read analog X and Y analog values
  xValue = analogRead(VRX_PIN);
  yValue = analogRead(VRY_PIN);

  // converts the analog value to commands
  // reset commands
  command = COMMAND_NO;

  // check left/right commands
  if (xValue < LEFT_THRESHOLD)
    command = command | COMMAND_LEFT;
  else if (xValue > RIGHT_THRESHOLD)
    command = command | COMMAND_RIGHT;

  // check up/down commands
  if (yValue < UP_THRESHOLD)
    command = command | COMMAND_UP;
  else if (yValue > DOWN_THRESHOLD)
    command = command | COMMAND_DOWN;

  // NOTE: AT A TIME, THERE MAY BE NO COMMAND, ONE COMMAND OR TWO COMMANDS

  // print command to serial and process command
  if (command & COMMAND_LEFT) {
    Serial.println("COMMAND LEFT");
    // TODO: add your task here
  }

  if (command & COMMAND_RIGHT) {
    Serial.println("COMMAND RIGHT");
    // TODO: add your task here
  }

  if (command & COMMAND_UP) {
    Serial.println("COMMAND UP");
    // TODO: add your task here
  }

  if (command & COMMAND_DOWN) {
    Serial.println("COMMAND DOWN");
    // TODO: add your task here
  }

  server.handleClient(); 
}

void handle_OnConnect() {
  String json = "{\"location\":\""+String(sensorName)+"\",\"value\":"+int(command)+"}";
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.send(200, "application/json", json); 
  Serial.println("sent header");
}

void handle_NotFound(){
  server.send(404, "text/plain", "Not found");
  Serial.println("Error: Not found");
}