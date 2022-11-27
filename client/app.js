//const socket = new io("ws://localhost:8080");
const socket = new io(location.protocol.replace('http', 'ws') + '//' + location.hostname + (location.port ? (':' + location.port) : '') + '/');

var term = new Terminal(
    {
        FontFace: "Cascadia Mono",
        cursorStyle: "underline",
        cursorBlink: "true",
        fontSize: "12",
    }
);

term.open(document.getElementById("terminal"));

socket.on("terminal.incomingData", (data) => {
    term.write(data);
});

term.onData((data) => {
    socket.emit("terminal.keystroke", data);
});