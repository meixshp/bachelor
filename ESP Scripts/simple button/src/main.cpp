#include <Arduino.h>
#include <ezButton.h>

#define DEBOUNCE_TIME 50 // the debounce time in millisecond, increase this time if it still chatters

ezButton button(21); // create ezButton object that attach to pin GIOP21
int stateOfButton = 0;

void setup() {
    Serial.begin(9600);
}

void loop() {
    button.loop(); // MUST call the loop() function first
    if (button.isPressed()) {
        stateOfButton = 1;
        Serial.println(stateOfButton);
    }

    if (button.isReleased()) {
        stateOfButton = 0;
        Serial.println(stateOfButton);
    }
}