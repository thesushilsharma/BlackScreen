# Terminal-Prompt
Remote command line interface from browser

## Dependencies

- [Node.JS 12+](https://nodejs.org/en/)
- [node-pty](https://github.com/microsoft/node-pty)
- [xtermjs](https://github.com/xtermjs/xterm.js)
- [Socket.IO](https://socket.io/)

## Use Case
- access server/system terminal from browser

## How to Start
- Clone the repo.
- Run `npm i` -> dependencies (express, node-pty, xterm, socket.io) and devDependencies (nodemon, dotenv)
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
This project is licensed under the MIT License. See the LICENSE file for details.
