#Social Cycle
###Set up and running ionic app
1. Ensure Node & ionic is installed
    - Install Node using the package install at https://nodejs.org/#download
    - Open a terminal/cmd window and ensure node is installed by running `node -v` then install Ionic:
        - install the latest cordova (Require by ionic) `npm install -g cordova`
        - install the latest ionic `npm install -g ionic`
2. Open the ionicApp directory in the Terminal/cmd prompt
3. Install bower components
    `bower install`
4. To emulate localy run `ionic serve`

###To Run on Devices
1. Install cordova Plugins for running on devices
    - `cordova plugin add org.apache.cordova.geolocation`
    - `cordova plugin add com.megster.cordova.bluetoothserial`
2. Add the Platorms you wish to test on:
    - Android : 
        - install the Android Developer tools ( see https://developer.android.com/sdk/index.html)
        - `ionic platform add android`
    - iOS (mac only & requires developer acount):
        - install latest xcode
        - `ionic platform add ios`
3. To run on device from the terminal run `ionic run <platform>` where <platform> is android or ios
