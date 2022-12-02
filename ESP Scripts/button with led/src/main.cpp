#include <Arduino.h>

#define BUTTON_PIN 16  // ESP32 pin GIOP16, which connected to button
#define LED_PIN    18  // ESP32 pin GIOP18, which connected to led

// The below are variables, which can be changed
int button_state = 0;   // variable for reading the button status

void setup() {
  // initialize the LED pin as an output:
  pinMode(LED_PIN, OUTPUT);
  // initialize the button pin as an pull-up input:
  // the pull-up input pin will be HIGH when the button is open and LOW when the button is pressed.
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.println("Testing");
}

void loop() {
  // read the state of the button value:
  button_state = digitalRead(BUTTON_PIN);
  // control LED according to the state of button
  if (button_state == LOW) {     // if button is pressed
    digitalWrite(LED_PIN, HIGH);
    Serial.println("Button has been pressed.");
  } // turn on LED
  else                           // otherwise, button is not pressing
    digitalWrite(LED_PIN, LOW);  // turn off LED
}