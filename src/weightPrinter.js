var SerialPort = require('serialport');
var split = require('split');
const printerUtility = require('./printerUtility');


var weightPrinted = true;
var printNewWeight = false;

printerUtility.appEventHandler.on('printed', () => {
  console.log('successfully printed');
  weightPrinted = true;
});

const openOptions = {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1
};

const port = new SerialPort("COM1", openOptions);

process.stdin.resume();

process.on('SIGINT', function() {
  console.log("Caught interrupt signal, closing serial port");
  
  port.close();
  process.exit(0);
});

var previousWeight = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0];
var currentWeight = 0;
var previousWeightIndex = 0;

var absoluteWeight = 0;
var userIsInformed = false;
var wieghtStabilized = false;

var isWieghtStabilized = function() {
  for ( i=1; i<previousWeight.length; i++) {
    if(previousWeight[i-1] != previousWeight[i]) {
      return false;
    }
  }
  return true;
}

port.pipe(split()).on('data', (data) => {
  
  absoluteWeight = parseFloat(data.substr(1));

  if ( absoluteWeight == 0 && !userIsInformed) {
     console.log('Weight Removed');
     wieghtStabilized = false;
     userIsInformed = true;
  }



  if (false == wieghtStabilized && absoluteWeight != 0) {
    userIsInformed = false;
    previousWeight[previousWeightIndex++] = absoluteWeight;
    //console.log('got new weight' + absoluteWeight.toString());
  }

  if ( previousWeightIndex == previousWeight.length) {
    previousWeightIndex = 0;
  }

  if(absoluteWeight != 0 && !wieghtStabilized && isWieghtStabilized()) {
    // looks like we got a weight
    console.log('got new weight' + absoluteWeight.toString());
    wieghtStabilized = true;
    printNewWeight = true;
  }

  if (wieghtStabilized && weightPrinted && printNewWeight) {
    printerUtility.printWeight(previousWeight[0].toString() + ' g');
    weightPrinted = false;
    printNewWeight = false;
  }
});

port.on('error', (err) => {
  console.log('Error', err);
  process.exit(1);
});