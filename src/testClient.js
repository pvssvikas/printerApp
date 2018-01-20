var net = require('net');

var bufStartPrint   = Buffer.alloc(6, 3);
bufStartPrint[0] = 0x2
bufStartPrint.write('STAR', 1);

var bufStopPrint   = Buffer.alloc(6, 3);
bufStopPrint[0] = 0x2
bufStopPrint.write('STOP', 1);

var bufRQSP   = Buffer.alloc(6, 3);
bufRQSP[0] = 0x2
bufRQSP.write('RQSP', 1);

var bufRQIL   = Buffer.alloc(6, 3);
bufRQIL[0] = 0x2
bufRQIL.write('RQIL', 1);

function getVarToPrint(varIndex, varData) {
	var v1 = "POD"+varIndex+"=";
	return  varData;
}

function getDataToPrint() {
	let f1 = "DATA;";
	let varData = getVarToPrint(1, "hello5");

	let printBuffer = Buffer.alloc(f1.length + varData.length + 2, 0x3);
	printBuffer[0] = 0x2;
	printBuffer.write(f1 + varData ,1);

	return printBuffer;
}

var testbuffer = getDataToPrint();

var client = new net.Socket();
client.connect(3120, 'Adminn-PC', function() {
	console.log('Connected');

	client.write(bufRQSP);
	//client.write(bufRQIL);

	//client.write(testbuffer);
	//client.write(bufStartPrint);
	//
	
	//client.write(bufStopPrint);
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.write(bufStartPrint);
	//client.write(bufStopPrint);
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});