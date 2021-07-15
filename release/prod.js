const semanticRelease = require('semantic-release');
const configPromise = require('./release.config.js');

configPromise.then((config) => {
  const newConfig = {
    ...config,
    branches: ['master'],
  };
  if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) {
    newConfig.plugins.push('@semantic-release/github');
  }
  return semanticRelease(newConfig);
});
