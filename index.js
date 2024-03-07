// const express = require('express');
// const axios = require('axios');

// const app = express();
// const PORT = 3000;

// const apiKey = '97fba1cfb1mshf43759986dab067p14a73bjsnc2b3fb6e7c99';
// const compilerEndpoint = 'https://compilerapi.codere.run/v1/compile';

// app.use(express.json());

// app.post('/compile', async (req, res) => {
//   const { language, code } = req.body;

//   try {
//     const response = await axios.post(compilerEndpoint, {
//       language,
//       code
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-RapidAPI-Key': apiKey
//       }
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.log(error)
//     if (error.response) {
//       res.status(error.response.status).json({
//         error: error.response.data || 'Internal Server Error'
//       });
//     } else {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

//////////////////////////////////////////////////////

// const readline = require('readline');
// const axios = require('axios');

// const apiKey = '97fba1cfb1mshf43759986dab067p14a73bjsnc2b3fb6e7c99';
// const compilerEndpoint = 'https://online-code-compiler.p.rapidapi.com/v1/';

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// function compileCode(language, code) {
//   const options = {
//     method: 'POST',
//     url: compilerEndpoint,
//     headers: {
//       'content-type': 'application/json',
//       'X-RapidAPI-Key': apiKey,
//       'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
//     },
//     data: {
//       language,
//       version: 'latest',
//       code,
//       input: null
//     }
//   };

//   return axios.request(options);
// }

// rl.question('Enter the programming language (e.g., python3): ', (language) => {
//   rl.question('Enter the code: ', async (code) => {
//     try {
//       const response = await compileCode(language, code);
//       console.log('Compilation Result:');
//       console.log(response.data);
//     } catch (error) {
//       console.error('Error compiling code:', error.response.data);
//     } finally {
//       rl.close();
//     }
//   });
// });

//////////////////////////////////////////////
const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
app.use(bodyParser.json());

app.post("/compilecode", function (req, res) {
  const { code, input, lang } = req.body;

  let command, args;

  if (lang === "C") {
    command = "gcc";
    args = ["-o", "compiled", "-x", "c", "-"];
  } else if (lang === "C++") {
    command = "g++";
    args = ["-o", "compiled", "-x", "c++", "-"];
  } else if (lang === "Java") {
    command = "javac";
    args = ["-d", ".", "-"];
  } else if (lang === "Python") {
    command = "python3";
    args = ["-"];
  } else {
    return res.status(400).json({ error: "Invalid language specified" });
  }

  const childProcess = spawn(command, args);

  childProcess.stdin.write(code);
  childProcess.stdin.end();

  let output = "";
  let error = "";

  childProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  childProcess.stderr.on("data", (data) => {
    error += data.toString();
  });

  childProcess.on("close", () => {
    if (error) {
      res.send(error);
    } else {
      const runProcess = spawn("./compiled");

      runProcess.stdin.write(input);
      runProcess.stdin.end();

      let runOutput = "";

      runProcess.stdout.on("data", (data) => {
        runOutput += data.toString();
      });

      runProcess.on("close", () => {
        res.send(runOutput);
      });
    }
  });
});

const PORT = 8000;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
