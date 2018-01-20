var net = require('net');
var client = new net.Socket();
const EventEmitter = require('events');

var printerName = "";


class PrintEventHandler extends EventEmitter {}
var weightEventHandler = null;

var eventHandler = new PrintEventHandler();


client.on('data', function(data) {
    console.log('\nReceived: ' + data + '\n');
    client.destroy();
    eventHandler.emit('printed');
});

client.on('close', function() {
    console.log('Connection closed');
});

module.exports = {
    appEventHandler : eventHandler,
    printWeight : function(weight) {
        console.log ("printerApp recieved " + weight + ' to get printed');
        this.connect('SYS-1', () => {
            this.setPrintData(weight, function() {
                // print callback
            });
        });
    },
    connect: function(printer, callback) {
        client.connect(3210, printer, function() {
            console.log('Connected');
            callback();
        });
    },
    getSpeed:function(callback) {
        var bufRQSP   = Buffer.alloc(6, 3);
        bufRQSP[0] = 0x2;
        bufRQSP.write('RQSP', 1);

        client.write(bufRQSP);
        callback();
    },
    getInkLevel: function(callback) {
        var bufRQIL   = Buffer.alloc(6, 3);
        bufRQIL[0] = 0x2;
        bufRQIL.write('RQIL', 1);

        client.write(bufRQIL);
        callback();
    },
    setPrintData:function(data, callback) {
        console.log( 'recieved ' + data + ' to print');
        let f1 = "DATA;";
	    let printBuffer = Buffer.alloc(f1.length + data.length + 2, 0x3);
	    printBuffer[0] = 0x2;
        printBuffer.write(f1 + data ,1);
        
        client.write(printBuffer);
        callback();
    },
    startPrint:function(callback) {
        var bufStartPrint   = Buffer.alloc(6, 3);
        bufStartPrint[0] = 0x2
        bufStartPrint.write('STAR', 1);

        client.write(bufStartPrint);
        callback();
    },
    stopPrint:function(callback) {
        var bufStopPrint   = Buffer.alloc(6, 3);
        bufStopPrint[0] = 0x2
        bufStopPrint.write('STOP', 1);

        client.write(bufStopPrint);
        callback();        
    },
    close: function(callback) {
        client.destroy();
        callback();
    }

};