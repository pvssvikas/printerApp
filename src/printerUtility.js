var net = require('net');
var client = new net.Socket();
const EventEmitter = require('events');

var printerName = "";


class PrintEventHandler extends EventEmitter {}
var weightEventHandler = null;

var eventHandler = new PrintEventHandler();

eventHandler.on('ignoreLastPrint', function() {

    module.exports.stopPrint(function() {
        process.nextTick(module.exports.startPrint, ()=>{
            eventHandler.emit('ignored');
        });
    });
});

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
    printWeight1 : function(weight) {
        console.log ("printerApp recieved " + weight + ' to get printed');
        this.connect(null, () => {
            this.setPrintData(weight, function() {
                // print callback
            });
        });
    },
    connect: function(printer, callback) {
        if (printer == null) {
            printer = 'SYS-1';
        }
        client.connect(3210, printer, function() {
            console.log('Connected');
            process.nextTick(callback);
        });
    },
    closeConnection: function(callback) {
        client.destroy();
        process.nextTick(callback);
    },
    getSpeed:function(callback) {
        this.connect(null, ()=>{
            var bufRQSP   = Buffer.alloc(6, 3);
            bufRQSP[0] = 0x2;
            bufRQSP.write('RQSP', 1);
    
            client.write(bufRQSP);
            callback();
        });
    },
    getInkLevel: function(callback) {
        this.connect(null, ()=>{
            var bufRQIL   = Buffer.alloc(6, 3);
            bufRQIL[0] = 0x2;
            bufRQIL.write('RQIL', 1);
    
            client.write(bufRQIL);
            callback();
        });
    },
    printWeight:function(data, callback) {
        this.connect(null, ()=>{
            console.log( 'recieved ' + data + ' to print');
            let f1 = "DATA;";
            let printBuffer = Buffer.alloc(f1.length + data.length + 2, 0x3);
            printBuffer[0] = 0x2;
            printBuffer.write(f1 + data ,1);
            
            client.write(printBuffer);
            process.nextTick(callback);
            //this.closeConnection(callback);
        });
    },
    startPrint:function(callback) {
        client.destroy();
        console.log( 'startPrint called');
        module.exports.connect(null, ()=>{
            var bufStartPrint   = Buffer.alloc(6, 3);
            bufStartPrint[0] = 0x2
            bufStartPrint.write('STAR', 1);
    
            client.write(bufStartPrint);
            module.exports.closeConnection(callback);    
        });
    },
    stopPrint:function(callback) {
        client.destroy();
        console.log( 'stopPrint called');
        this.connect(null, ()=>{
            var bufStopPrint   = Buffer.alloc(6, 3);
            bufStopPrint[0] = 0x2
            bufStopPrint.write('STOP', 1);
            
            client.write(bufStopPrint);
            this.closeConnection(callback);
        });
    }
};