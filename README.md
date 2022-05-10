# HYOP
HYOP (Hack Your Own PC) is a vulnarable web application that designed to help dummies learn web security. 

HYOP is built with [Node.js](https://nodejs.org) using [Koa](https://koajs.com) as the server and [Cakebase](https://github.com/erwinkulasic/Cakebase) JSON based database. We built HYOP with these goals :
- [X] Dead simple
- [x] Lightweight
- [x] Secure
- [x] Have high reliability & mobility
- [x] Customizable

## Installing
##### Note: Node.js with NPM is required for installing HYOP. 

Clone the repository:

```git clone https://github.com/manushifva/hyop```

Open the repository:

```cd hyop```

Install the modules:

```npm install```

Run:

```npm start```


Or run in test mode:
###### Note: [Nodemon](https://nodemon.io) is required.

```npm test```

## Features
- [x] Highly customizable vulnerable apps
- [x] Sandbox-based environtment that including sandboxed file system
- [x] Memory limiting for the sandbox
- [x] One-click reset
- [x] Secured with single-user access
- [x] Command-line based administration tool

## Limititations
Due some security reasons, we limit some things here:

- [x] Direct access to the command line and file system
- [x] Self-registering user account

## License
HYOP is licensed under [MIT License](https://opensource.org/licenses/MIT).

Copyright 2022 manushifva

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.