const { deploy } = require('sftp-sync-deploy');
const core = require('@actions/core');
const github = require('@actions/github');

console.log(core.getInput('dryRun'));

let config = {
  host: core.getInput('host'), // Required.
  port: core.getInput('port'), // Optional, Default to 22.
  username: core.getInput('username'), // Required.
  password: core.getInput('password'), // Optional.
  //  privateKey: '/path/to/key.pem', // Optional.
  //  passphrase: 'passphrase',       // Optional.
  //  agent: '/path/to/agent.sock',   // Optional, path to the ssh-agent socket.
  localDir: core.getInput('localDir'), // Required, Absolute or relative to cwd.
  remoteDir: core.getInput('remoteDir') // Required, Absolute path only.
};

let options = {
  dryRun: JSON.parse(core.getInput('dryRun')), // Enable dry-run mode. Default to false
  excludeMode: JSON.parse(core.getInput('excludeMode')), // Behavior for excluded files ('remove' or 'ignore'), Default to 'remove'.
  forceUpload: JSON.parse(core.getInput('forceUpload')), // Force uploading all files, Default to false(upload only newer files).
  exclude: JSON.parse(core.getInput('exclude')) // exclude patterns (glob)
};

if (Array.isArray(options['exclude'])) {
  options['exclude'].push('.git')
} else {
  options['exclude'] = ['.git']
}

deploy(config, options)
  .then(() => {
    console.log('sftp upload success!');
  })
  .catch(err => {
    console.error('sftp upload error! ', err);
    core.setFailed(err.message)
  });
