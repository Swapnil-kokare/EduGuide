const path = require('path');

function requireWorkspacePackage(packageName) {
  const searchPaths = [
    path.join(__dirname, '..', '..', 'backend'),
    path.join(__dirname, '..', '..'),
    process.cwd(),
  ];

  return require(require.resolve(packageName, { paths: searchPaths }));
}

module.exports = requireWorkspacePackage;
