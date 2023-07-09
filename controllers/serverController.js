const fs = require("fs");
const fsPromise = require("fs").promises;
const Path = require("path");
const Emitter = require("events");
const { logEvent } = require("../middleware/log");

const serverLogEmitter = new Emitter();
serverLogEmitter.on("log", (mes, fileName) => {
  logEvent(mes, fileName);
});

const findContentType = (extName) => {
  //extName = path.extname(req.url)
  let contentType;

  switch (extName) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "text/css";
      break;
    case ".png":
      contentType = "text/javascript";
      break;
    case ".txt":
      contentType = "application/json";
      break;
    default: //since it can be "" or "/"
      contentType = "text/html";
      break;
  }

  return contentType;
};
const findFilePath = (contentType, url) => {
  let filePath;

  if (contentType == "text/html") {
    filePath = Path.join(
      Path.dirname(Path.dirname(Path.dirname(__dirname))),
      "HTML"
    );
    filePath =
      url === "/" || url === ""
        ? Path.join(filePath, "index.html")
        : Path.join(filePath, url);
  } else {
    filePath = Path.join(
      Path.dirname(Path.dirname(Path.dirname(__dirname))),
      url
    );
  }

  return filePath;
};
const serveFile = async (path, contentType, response) => {
  //add conditions if you want to redirect something
  try {
    const rawData = await fsPromise.readFile(path, "utf8");
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(200, { "Content-Type": contentType });
    response.write(data);
    response.end();

    serverLogEmitter.emit("log", path, "serverLogs.txt");
  } catch (err) {
    serverLogEmitter.emit("log", path, "serverERRORLogs.txt");
    response.statusCode = 500;
    response.end();
  }
};

module.exports = { findContentType, findFilePath, serveFile };
