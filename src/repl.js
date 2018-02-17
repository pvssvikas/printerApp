const repl = require('repl');
const printerUtility = require('./printerUtility');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('connect', {
  help: 'connect to printer app',
  action(name) {
    if ("${name}" == "") {
        name = 'Adminn-PC';
    }
    //var that = this;
    printerUtility.connect(name, () => {
        this.displayPrompt();
    });
  }
});

replServer.defineCommand('getSpeed', function getSpeed() {
    printerUtility.getSpeed(() =>{
        console.log('Get Printer Speed');
        this.displayPrompt();
    });
});  
  
replServer.defineCommand('getInkLevel', function getInkLevel() {
    printerUtility.getInkLevel(() =>{
        console.log('Get Ink Level');
        this.displayPrompt();
    });
});

replServer.defineCommand('print', {
    help: 'connect to printer app',
    action(d1) {
      if ("${d1}" == "") {
          d1 = "Hello World !!"
      }
      printerUtility.printWeight(d1, ()=>{
        console.log(`Print ${d1}!`);
        this.displayPrompt();
      });
    }
});

replServer.defineCommand('startPrint', function startPrint() {
    printerUtility.startPrint(()=>{
        console.log('Start Print');
        this.displayPrompt();
    });
});

replServer.defineCommand('stopPrint', function stopPrint() {
    printerUtility.stopPrint(()=>{
        console.log('Stop Print');
        this.displayPrompt();
    });
});


replServer.defineCommand('quit', function quit() {
    console.log('Goodbye!');
    printerUtility.closeConnection(() => {
        this.close();
    });
});