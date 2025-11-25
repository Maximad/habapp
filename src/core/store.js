const fs = require('fs');
const path = require('path');

function loadJson(filePath, fallback) {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(text);
  } catch (err) {
    return fallback;
  }
}

function saveJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function createStore(options = {}) {
  const dataDir = options.dataDir || path.join(__dirname, '..', 'data');

  function resolve(name) {
    return path.join(dataDir, `${name}.json`);
  }

  return {
    dataDir,
    resolve,
    read: (name, fallback) => loadJson(resolve(name), fallback),
    write: (name, data) => saveJson(resolve(name), data)
  };
}

const defaultStore = createStore();

module.exports = {
  loadJson,
  saveJson,
  createStore,
  defaultStore
};
