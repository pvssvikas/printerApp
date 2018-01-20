var SerialPort = require('serialport');


const openOptions = {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1
};

const port = new SerialPort("COM1", openOptions);

process.stdin.resume();
//process.stdin.setRawMode(true);
process.stdin.on('data', (s) => {
  if (s[0] === 0x03) {
    port.close();
    process.exit(0);
  }
});
//0:2
//1:48
//2:46
//3:48
//4:13
//5:48
//6:13
//7:10
//8:2
//9:48
//10:46
//11:48
//12:13
//13:48
//14:13
//15:10
//16:2
//Uint8Array[4096] [2, 48, 46 …]

port.on('data', (data) => {
  process.stdout.write(data.toString());
});

port.on('error', (err) => {
  console.log('Error', err);
  process.exit(1);
});
