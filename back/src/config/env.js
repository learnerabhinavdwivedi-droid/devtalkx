const path = require("path");
const dotenv = require("dotenv");

const candidateEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../.env"),
];

const loadedPath = candidateEnvPaths.find((envPath) => {
  const result = dotenv.config({ path: envPath });
  return !result.error;
});

if (!loadedPath) {
  dotenv.config();
}

module.exports = { loadedPath };