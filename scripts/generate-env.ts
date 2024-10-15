const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env");
const envExamplePath = path.join(__dirname, "../.env.example");

fs.readFile(envPath, "utf8", (err: Error, data: string) => {
  if (err) {
    console.error("Error reading .env file:", err);
    return;
  }

  const lines = data.split("\n");

  const exampleLines = lines.map((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      return `${key}=<value>`;
    }
    return line;
  });

  const exampleContent = exampleLines.join("\n");
  fs.writeFile(envExamplePath, exampleContent, "utf8", (err: Error) => {
    if (err) {
      console.error("Error writing .env.example file:", err);
      return;
    }
    console.log(".env.example file has been generated successfully.");
  });
});
