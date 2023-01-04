#include <Arduino.h> 

//int Signal;                           // holds the incoming raw data. Signal value can range from 0-1024

unsigned long previousMillisGetHR = 0;  //--> will store the last time Millis (to get Heartbeat) was updated.
unsigned long previousMillisHR = 0;     //--> will store the last time Millis (to get BPM) was updated.

const long intervalGetHR = 10;          //--> Interval for reading heart rate (Heartbeat) = 10ms.
const long intervalHR = 10000;          //--> Interval for obtaining the BPM value based on the sample is 10 seconds.

//int PulseSensorPurplePin = 0;    
const int PulseSensorHRWire = 0;        //A0; //--> PulseSensor connected to ANALOG PIN 0 (A0 / ADC 0).
//const int LED_D1 = D1;                //--> LED to detect when the heart is beating. The LED is connected to PIN D1 (GPIO5) on the NodeMCU ESP12E.
int LED13 = 2;    

//int Threshold = 550;                  // Determine which Signal to "count as a beat", and which to ingore.
int Threshold = 550;                    //--> Determine which Signal to "count as a beat" and which to ignore.
int cntHB = 0;                          //--> Variable for counting the number of heartbeats.
boolean ThresholdStat = true;           //--> Variable for triggers in calculating heartbeats.
int BPMval = 0;                         //--> Variable to hold the result of heartbeats calculation.


void GetHeartRate() {

  // This subroutine is for reading the heart rate and calculating it to get the BPM value.
  // To get a BPM value based on a heart rate reading for 10 seconds.

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

  // process for getting the BPM value.
  unsigned long currentMillisHR = millis();

  if (currentMillisHR - previousMillisHR >= intervalHR) {
    previousMillisHR = currentMillisHR;

    BPMval = cntHB * 6; //--> The taken heart rate is for 10 seconds. So to get the BPM value, the total heart rate in 10 seconds x 6.
    Serial.print("BPM : ");
    Serial.println(BPMval);
    
    cntHB = 0;
  }
}


void setup() {
    pinMode(LED13,OUTPUT);         // pin that will blink to your heartbeat!
    Serial.begin(9600);         // Set's up Serial Communication at certain speed.
    //Serial.begin(115200);
}


void loop() {
/*
    BPMval = analogRead(PulseSensorHRWire);  // Read the PulseSensor's value.
    // Assign this value to the "Signal" variable.
    Serial.println(BPMval);                    // Send the Signal value to Serial Plotter.

    if(BPMval < Threshold){                    
        digitalWrite(LED13,LOW);
    } else {
        digitalWrite(LED13,HIGH);      
    }

    delay(10);
*/
    GetHeartRate();

}