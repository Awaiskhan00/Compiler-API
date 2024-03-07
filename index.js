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
