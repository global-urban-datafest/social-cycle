#include "FastLED.h"
#include <SoftwareSerial.h>

// How many leds in your strip?
#define NUM_LEDS 132
// For led chips like Neopixels, which have a data line, ground, and power, you just
// need to define DATA_PIN.  For led chipsets that are SPI based (four wires - data, clock,
// ground, and power), like the LPD8806 define both DATA_PIN and CLOCK_PIN
#define DATA_PIN 6

// Define the array of leds
CRGB leds[NUM_LEDS];

const int rxPin = 2; //SoftwareSerial RX pin, connect to JY-MCY TX pin
const int txPin = 3; //SoftwareSerial TX pin, connect to JY-MCU RX pin
SoftwareSerial mySerial(rxPin, txPin); // RX, TX

const bool debugging = true;

//indicator LED on Arduino
const int ledPin = 13;

//IDs for each LED sequence
const char moving = '0';
const char braking = '1';
const char leftOn = '2';
const char leftOff = '3';
const char rightOn = '4';
const char rightOff = '5';
//Current lighting mode [going, left, right]
bool modesActive[3] = {true, false, false};
//keep track of when a change has happened
bool modesJustSwitched[3] = {false, false, false};
//Current states of each lighting mode sequence
int modesState[3] = {0,0,0};
//Timestamps for next transitions in lighting mode sequences
long modesNextTransition[3] = {0,0,0};

//Placeholder variables for adding periodic accelerometer checking
long nextOutput = 0;
int interval=2000;

void setup() {
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
  //Start static lights
  for(int i=62;i<70;i++)
    leds[i] = CRGB::Red;
  FastLED.show();
  // sets the pins as outputs:
  pinMode(ledPin, OUTPUT);
  //Begin all serial connection for bluetooth and console or whatever
  mySerial.begin(9600);
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  digitalWrite(ledPin, LOW); // LED is initially off
}

void loop() {
  
  //Do something periodically every x seconds. interval is timeout
  //Could be used to read accelerometer in final version
  if(millis() > nextOutput)
  {
    nextOutput+=interval;
    mySerial.println("Hello World"); 
  }
  
  //If a character is sent from phone over bluetooth, read it
  //If it is a different to the last character received and between the allowed max/min values
  //then pass it to the modeSwitch() function
  if(mySerial.available() > 0){
    char temp = (char)mySerial.read();
    if(temp >= '0' && temp <= '5')
    {
      modeSwitch(temp);
    } 
  }
  
  //If a character is sent from computer, read it
  //If it is a different to the last character received and between the allowed max/min values
  //then pass it to the modeSwitch() function
  if(debugging && (Serial.available() > 0)){
    char temp = (char)Serial.read();
    if(temp >= '0' && temp <= '5')
    {
      modeSwitch(temp);
    }
  }
  
  //Call ledUpdate() function to update LEDs if necessary
  ledUpdate();
}

void modeSwitch(char temp)
{
  if(debugging){
    //print out the received command
    Serial.print(temp);
  }

  //filter to see if a change is required
  //compare the order received to the available settings and then
  //update the variables to that this setting is saved
  if(temp == moving)
  {
    if(!modesActive[0]){
      if(debugging)
        Serial.println("BrakeOff");
      modesActive[0]=true;
      modesJustSwitched[0]=true;
    }
  }
  else if(temp == braking)
  {
    if(modesActive[0]){
      if(debugging)
        Serial.println("BrakeOn");
      modesActive[0]=false;
      modesJustSwitched[0]=true;
    }
  }  
  else if(temp == leftOn)
  {
    if(!modesActive[1]){
      if(debugging)
        Serial.println("LeftOn");
      modesActive[1]=true;
      modesJustSwitched[1]=true;
    }
  }
  else if(temp == leftOff)
  {
    if(modesActive[1]){
      if(debugging)
        Serial.println("LeftOff");
      modesActive[1]=false;
      modesJustSwitched[1]=true;
    }
  }
  else if(temp == rightOn)
  {
    if(!modesActive[2]){
      if(debugging)
        Serial.println("RightOn");
      modesActive[2]=true;
      modesJustSwitched[2]=true;
    }
  }
  else if(temp == rightOff)
  {
    if(modesActive[2]){
      if(debugging)
        Serial.println("RightOff");
      modesActive[2]=false;
      modesJustSwitched[2]=true;
    }
  }
  if(modesJustSwitched[0] || modesJustSwitched[1] || modesJustSwitched[2])
  {
    //if any changes have happened, register this change
    for(int i=0; i<3; i++)
    {
      modesState[i]=0;
      modesNextTransition[i]=0;
    }
  }
  if(debugging){
    Serial.println((String)modesActive[0] + " " + (String)modesActive[1] + " " +(String)modesActive[2]);
  }
}

void ledUpdate()
{
  //The timing sequences for each mode are enforced here
  //The switching of the LEDs is performed by the functions called here

  for(int i=0; i<3; i++)
  {
    //Check if we need to do anything yet
    if(millis()>=modesNextTransition[i])
    {
      if(debugging){
        Serial.print(i);
        Serial.println(" JustSwitched:"+(String)modesJustSwitched[i]+" State:"+modesState[i]+" "+millis());
      }
      if(i==0)
        flash();
      else if(i==1)
        left();
      else if(i==2)
        right();
    }
  }
}

//Delegates all operations required for switching between brake lights and
//regular flashing light
void flash(){
  if(modesJustSwitched[0])
  {
    if(modesActive[0])
      brakeOff();
    else
      brakeOn();
  }
  else
  {
    if(modesActive[0])
      defaultFlash();
    else
      brakeFlash();
  }
}

void brakeOff(){
  //Sequence for when you start moving again after being stopped
  //After this the default flashing sequence is restarted
  if(modesState[0]==0){
    modesNextTransition[0]=millis()+50;
    modesState[0]++;
    for(int i=53;i<79;i++)
      leds[i] = CRGB::Red;
    leds[79] = CRGB::Black;    // Here Dave, I had put 80 here instead of 79. That was the problem.
    leds[52] = CRGB::Black;
    leds[78] = CRGB::Black;
    leds[53] = CRGB::Black;
    FastLED.show();
  }
  else if(modesState[0]==1){
    modesNextTransition[0]=millis()+50;
    modesState[0]++;
    leds[77] = CRGB::Black;
    leds[54] = CRGB::Black;
    FastLED.show();
  }
  else if(modesState[0]==2){
    modesNextTransition[0]=millis()+100;
    modesState[0]++;
    leds[76] = CRGB::Black;
    leds[55] = CRGB::Black;
    FastLED.show();
  }
  else if(modesState[0]==3){
    modesNextTransition[0]=millis()+150;
    modesState[0]++;
    leds[75] = CRGB::Black;
    leds[56] = CRGB::Black;
    FastLED.show();
  }   
  else if(modesState[0]==4){
    modesNextTransition[0]=millis()+150;
    modesState[0]++;
    leds[74] = CRGB::Black;
    leds[57] = CRGB::Black;
    FastLED.show();
  }   
  else if(modesState[0]==5){
    modesNextTransition[0]=millis()+200;
    modesState[0]++;
    leds[73] = CRGB::Black;
    leds[58] = CRGB::Black;
    FastLED.show();
  }   
  else if(modesState[0]==6){
    modesNextTransition[0]=millis()+250;
    modesState[0]++;
    leds[72] = CRGB::Black;
    leds[59] = CRGB::Black;
    FastLED.show();
  }   
  else if(modesState[0]==7){
    modesNextTransition[0]=millis()+250;
    modesState[0]++;
    leds[71] = CRGB::Black;
    leds[60] = CRGB::Black;
    FastLED.show();
  }   
  else if(modesState[0]==8){
    modesNextTransition[0]=millis()+300;
    leds[70] = CRGB::Black;
    leds[61] = CRGB::Black;
    FastLED.show();
    modesJustSwitched[0]=false;
    modesState[0]=0;
  }   
}

void brakeOn()
{
  //Sequence for when brakes engaged, before spine flashing sequence is engaged
  //brake light, these lights animate up the spine like carnival strong man hammer thing, if you can imagine
  if(modesState[0]==0){
    modesNextTransition[0]=millis()+50;
    modesState[0]++;
    for(int i=53;i<79;i++)
      leds[i] = CRGB::Black;
    for(int i=62;i<70;i++)
      leds[i] = CRGB::Red;
    leds[70] = CRGB::Red;
    leds[61] = CRGB::Red;
    FastLED.show();
  }
  else if(modesState[0]==1){
    modesNextTransition[0]=millis()+50;
    modesState[0]++;
    leds[60] = CRGB::Red;
    leds[71] = CRGB::Red;
    FastLED.show();
  }
  else if(modesState[0]==2){
    modesNextTransition[0]=millis()+100;
    modesState[0]++;
    leds[72] = CRGB::Red;
    leds[59] = CRGB::Red;
    FastLED.show();
  }
  else if(modesState[0]==3){
    modesNextTransition[0]=millis()+150;
    modesState[0]++;
    leds[73] = CRGB::Red;
    leds[58] = CRGB::Red;
    FastLED.show();
  }
  else if(modesState[0]==4){
    modesNextTransition[0]=millis()+150;
    modesState[0]++;
    leds[74] = CRGB::Red;
    leds[57] = CRGB::Red;
    FastLED.show();
  }
  else if(modesState[0]==5){
    modesNextTransition[0]=millis()+20;
    modesState[0]++;
    leds[75] = CRGB::Red;
    leds[56] = CRGB::Red;
    FastLED.show();
  }
  else if(modesState[0]==6){
    modesNextTransition[0]=millis()+250;
    modesState[0]++;
    leds[76] = CRGB::Red;
    leds[55] = CRGB::Red;
    FastLED.show();
  }
  else if(modesState[0]==7){
    modesNextTransition[0]=millis()+250;
    modesState[0]++;
    leds[77] = CRGB::Red;
    leds[54] = CRGB::Red;
    FastLED.show();
  }
  else if(modesState[0]==8){
    modesNextTransition[0]=millis()+300;
    leds[78] = CRGB::Red;
    leds[53] = CRGB::Red;
    FastLED.show();
    modesJustSwitched[0]=false;
    modesState[0]=0;
  }
}

void defaultFlash()
{
  //The regular slashing sequence
  modesNextTransition[0]=millis()+500;
  if(modesState[0]==0){
    modesState[0]=1;
    leds[70] = CRGB::Black;
    leds[71] = CRGB::Black;
    leds[60] = CRGB::Black;
    leds[61] = CRGB::Black;
  } else {
    modesState[0]=0;
    leds[70] = CRGB::Red;
    leds[71] = CRGB::Red;
    leds[60] = CRGB::Red;
    leds[61] = CRGB::Red;
  }
  FastLED.show();
}

void brakeFlash(){   
  // Flashing spine while stopped
  modesNextTransition[0]=millis()+250;
  CRGB ledTemp;
  if(modesState[0]==0){
    modesState[0]=1;
    ledTemp = CRGB::Black;
  } else {
    modesState[0]=0;
    ledTemp = CRGB::Red;
  } 
  for(int i=52;i<80;i++)
    leds[i] = ledTemp;
  FastLED.show();
}


void left()
{    
  //LEFT INDICATION
  
  if(!modesActive[1])
  {
    //Turn all lights off
    modesNextTransition[1]=millis()+10000;
    for(int i=80; i<NUM_LEDS;i++)
      leds[i] = CRGB::Black;
    FastLED.show();
  }
  else
  {
    //left small triangle on
    if(modesState[1]==0){
      modesNextTransition[1]=millis()+500;
      modesState[1]++;
      leds[88] = CRGB::Yellow;
      leds[89] = CRGB::Yellow;
      leds[90] = CRGB::Yellow;
      leds[91] = CRGB::Yellow;
      leds[92] = CRGB::Yellow;
      leds[111] = CRGB::Yellow;
      leds[110] = CRGB::Yellow;
      leds[109] = CRGB::Yellow;
      leds[123] = CRGB::Yellow;
      FastLED.show();
    }
    else if(modesState[1]==1){
      modesNextTransition[1]=millis()+500;
      modesState[1]++;
      
      //left small triangle off
      leds[88] = CRGB::Black;
      leds[89] = CRGB::Black;
      leds[90] = CRGB::Black;
      leds[91] = CRGB::Black;
      leds[92] = CRGB::Black;
      leds[111] = CRGB::Black;
      leds[110] = CRGB::Black;
      leds[109] = CRGB::Black;
      leds[123] = CRGB::Black;
      
      //left mid triangle on
      leds[96] = CRGB::Yellow;
      leds[95] = CRGB::Yellow;
      leds[94] = CRGB::Yellow;
      leds[93] = CRGB::Yellow;
      leds[108] = CRGB::Yellow;
      leds[107] = CRGB::Yellow;
      leds[106] = CRGB::Yellow;
      leds[105] = CRGB::Yellow;
      leds[124] = CRGB::Yellow;
      leds[125] = CRGB::Yellow;
      leds[126] = CRGB::Yellow;
      leds[127] = CRGB::Yellow;
      leds[84] = CRGB::Yellow;
      leds[85] = CRGB::Yellow;
      leds[86] = CRGB::Yellow;
      leds[87] = CRGB::Yellow;
      leds[112] = CRGB::Yellow;
      leds[113] = CRGB::Yellow;
      leds[114] = CRGB::Yellow;
      leds[115] = CRGB::Yellow;
      leds[122] = CRGB::Yellow;
      leds[121] = CRGB::Yellow;
      leds[120] = CRGB::Yellow;
      leds[119] = CRGB::Yellow;
      FastLED.show();
    }
    else if(modesState[1]==2){
      modesNextTransition[1]=millis()+500;
      modesState[1]++;
      
      //mid triangle off
      leds[96] = CRGB::Black;
      leds[95] = CRGB::Black;
      leds[94] = CRGB::Black;
      leds[93] = CRGB::Black;
      leds[108] = CRGB::Black;
      leds[107] = CRGB::Black;
      leds[106] = CRGB::Black;
      leds[105] = CRGB::Black;
      leds[124] = CRGB::Black;
      leds[125] = CRGB::Black;
      leds[126] = CRGB::Black;
      leds[127] = CRGB::Black;
      leds[84] = CRGB::Black;
      leds[85] = CRGB::Black;
      leds[86] = CRGB::Black;
      leds[87] = CRGB::Black;
      leds[112] = CRGB::Black;
      leds[113] = CRGB::Black;
      leds[114] = CRGB::Black;
      leds[115] = CRGB::Black;
      leds[122] = CRGB::Black;
      leds[121] = CRGB::Black;
      leds[120] = CRGB::Black;
      leds[119] = CRGB::Black;
      
      //left high triangle on
      leds[97] = CRGB::Yellow;
      leds[98] = CRGB::Yellow;
      leds[99] = CRGB::Yellow;
      leds[100] = CRGB::Yellow;
      leds[101] = CRGB::Yellow;
      leds[102] = CRGB::Yellow;
      leds[103] = CRGB::Yellow;
      leds[104] = CRGB::Yellow;
      leds[131] = CRGB::Yellow;
      leds[130] = CRGB::Yellow;
      leds[129] = CRGB::Yellow;
      leds[128] = CRGB::Yellow;
      leds[118] = CRGB::Yellow;
      leds[117] = CRGB::Yellow;
      leds[116] = CRGB::Yellow;
      leds[81] = CRGB::Yellow;
      leds[82] = CRGB::Yellow;
      leds[83] = CRGB::Yellow;
  
      FastLED.show();
    }
    else if(modesState[1]==3){
      modesNextTransition[1]=millis()+500;
      modesState[1]=0;
      
      //left high triangle off
      leds[97] = CRGB::Black;
      leds[98] = CRGB::Black;
      leds[99] = CRGB::Black;
      leds[100] = CRGB::Black;
      leds[101] = CRGB::Black;
      leds[102] = CRGB::Black;
      leds[103] = CRGB::Black;
      leds[104] = CRGB::Black;
      leds[131] = CRGB::Black;
      leds[130] = CRGB::Black;
      leds[129] = CRGB::Black;
      leds[128] = CRGB::Black;
      leds[118] = CRGB::Black;
      leds[117] = CRGB::Black;
      leds[116] = CRGB::Black;
      leds[81] = CRGB::Black;
      leds[82] = CRGB::Black;
      leds[83] = CRGB::Black;
    
      FastLED.show();
    }
  }
  modesJustSwitched[1]=false;
}

//This is the sequence for the RIGHT INDICATION. All of these
//functions include the continuous rear flashing red light incorporated 
//into it, couldn't figure out a better way to have it loop while doing 
//other functions similtaenously. I made the functions like Lego; they
//all start with the rear light off and end with it on.

void right(){
  //Right indication
  
  if(!modesActive[2])
  {
    //turn indicator off
    modesNextTransition[2]=millis()+10000;
    for(int i=0; i<51;i++)
      leds[i] = CRGB::Black;
    FastLED.show();
  }
  else
  {
    //turn indicator on
    if(modesState[2]==0)
    {
      modesNextTransition[2]=millis()+500;
      modesState[2]++;
      
      //Small Triangle On
      leds[8] = CRGB::Yellow;  //Which LED's do we want on and what colour
      leds[21] = CRGB::Yellow;
      leds[22] = CRGB::Yellow;
      leds[20] = CRGB::Yellow;
      leds[39] = CRGB::Yellow;
      leds[40] = CRGB::Yellow;
      leds[41] = CRGB::Yellow;
      leds[42] = CRGB::Yellow;
      leds[43] = CRGB::Yellow;
      
      FastLED.show(); //all the leds we called above, turn 'em on.
    }
    else if(modesState[2]==1)
    {
      modesNextTransition[2]=millis()+500;
      modesState[2]++;   

      //small triangle off
      leds[8] = CRGB::Black;
      leds[21] = CRGB::Black;
      leds[22] = CRGB::Black;
      leds[20] = CRGB::Black;
      leds[39] = CRGB::Black;
      leds[40] = CRGB::Black;
      leds[41] = CRGB::Black;
      leds[42] = CRGB::Black;
      leds[43] = CRGB::Black; 
      
      //mid triangle On
      leds[4] = CRGB::Yellow;
      leds[5] = CRGB::Yellow;
      leds[6] = CRGB::Yellow;
      leds[7] = CRGB::Yellow;
      leds[23] = CRGB::Yellow;
      leds[24] = CRGB::Yellow;
      leds[25] = CRGB::Yellow;
      leds[26] = CRGB::Yellow;
      leds[35] = CRGB::Yellow;
      leds[36] = CRGB::Yellow;
      leds[37] = CRGB::Yellow;
      leds[38] = CRGB::Yellow;
      leds[9] = CRGB::Yellow;
      leds[10] = CRGB::Yellow;
      leds[11] = CRGB::Yellow;
      leds[12] = CRGB::Yellow;
      leds[19] = CRGB::Yellow;
      leds[18] = CRGB::Yellow;
      leds[17] = CRGB::Yellow;
      leds[16] = CRGB::Yellow;
      leds[44] = CRGB::Yellow;
      leds[45] = CRGB::Yellow;
      leds[46] = CRGB::Yellow;
      leds[47] = CRGB::Yellow;
      
      FastLED.show();
    }
    else if(modesState[2]==2)
    {
      modesNextTransition[2]=millis()+500;
      modesState[2]++;   

      //mid triangle off
      leds[4] = CRGB::Black;
      leds[5] = CRGB::Black;
      leds[6] = CRGB::Black;
      leds[7] = CRGB::Black;
      leds[23] = CRGB::Black;
      leds[24] = CRGB::Black;
      leds[25] = CRGB::Black;
      leds[26] = CRGB::Black;
      leds[35] = CRGB::Black;
      leds[36] = CRGB::Black;
      leds[37] = CRGB::Black;
      leds[38] = CRGB::Black;
      leds[9] = CRGB::Black;
      leds[10] = CRGB::Black;
      leds[11] = CRGB::Black;
      leds[12] = CRGB::Black;
      leds[19] = CRGB::Black;
      leds[18] = CRGB::Black;
      leds[17] = CRGB::Black;
      leds[16] = CRGB::Black;
      leds[44] = CRGB::Black;
      leds[45] = CRGB::Black;
      leds[46] = CRGB::Black;
      leds[47] = CRGB::Black;
    
      //high triangle on
      leds[0] = CRGB::Yellow;
      leds[1] = CRGB::Yellow;
      leds[2] = CRGB::Yellow;
      leds[3] = CRGB::Yellow;
      leds[27] = CRGB::Yellow;
      leds[28] = CRGB::Yellow;
      leds[29] = CRGB::Yellow;
      leds[30] = CRGB::Yellow;
      leds[31] = CRGB::Yellow;
      leds[32] = CRGB::Yellow;
      leds[33] = CRGB::Yellow;
      leds[34] = CRGB::Yellow;
      leds[13] = CRGB::Yellow;
      leds[14] = CRGB::Yellow;
      leds[15] = CRGB::Yellow;
      leds[48] = CRGB::Yellow;
      leds[49] = CRGB::Yellow;
      leds[50] = CRGB::Yellow;
      
      FastLED.show();
    }
    else if(modesState[2]==3)
    {
      modesNextTransition[2]=millis()+500;
      modesState[2]=0;   

      //high triangle off
      leds[0] = CRGB::Black;
      leds[1] = CRGB::Black;
      leds[2] = CRGB::Black;
      leds[3] = CRGB::Black;
      leds[27] = CRGB::Black;
      leds[28] = CRGB::Black;
      leds[29] = CRGB::Black;
      leds[30] = CRGB::Black;
      leds[31] = CRGB::Black;
      leds[32] = CRGB::Black;
      leds[33] = CRGB::Black;
      leds[34] = CRGB::Black;
      leds[13] = CRGB::Black;
      leds[14] = CRGB::Black;
      leds[15] = CRGB::Black;
      leds[48] = CRGB::Black;
      leds[49] = CRGB::Black;
      leds[50] = CRGB::Black;
      
      FastLED.show();
      delay(500);
    }
  }
  modesJustSwitched[2]=false;
}


 


 




