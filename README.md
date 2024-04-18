# Terminal-Prompt
This project allows you to access and interact with your server's terminal from the comfort of your web browser.

## Pre-requisites
- [Node.JS 12+](https://nodejs.org/en/)
- VS Code or any Code editor

## Dependencies
- [node-pty](https://github.com/microsoft/node-pty)
- [xtermjs](https://github.com/xtermjs/xterm.js)
- [Socket.IO](https://socket.io/)

## Features
- Secure communication using WebSockets (Socket.IO)
- Real-time interaction with the terminal
- Broad compatibility across operating systems (Linux/macOS, Windows)

## How to Start
-   ```bash
    git clone https://github.com/your-username/web-terminal.git
    ```
- ```
    cd Terminal-Prompt
    npm i
  ```
- Run `npm i` (Installing the dependencies)
- Run `node start`
- Terminal listening on port `3000`
- Server will be running at `localhost:3000`
- Type `localhost:3000` on browser url

## For localhost
- make changes from app.js
- uncomment -> `const socket = new io("ws://localhost:8080");`
- comment -> `const socket = new io(location.protocol.replace('http', 'ws') + '//' + location.hostname + (location.port ? (':' + location.port) : '') + '/');`

## Known Issues
- None

## Contributing
To contribute to this project, please submit any issues or pull requests on the GitHub repository.

## License
This project is licensed under the MIT License.  See the [LICENSE](https://github.com/thesushilsharma/Terminal-Prompt/blob/main/LICENSE) file for details.
