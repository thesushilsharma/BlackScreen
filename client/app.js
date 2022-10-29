const socket = io("ws://localhost:8080");

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