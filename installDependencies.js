const { exec } = require('child_process');

const dependencies = [
  'express',
  'mqtt',
  'cors',
  'mysql2',
  // Add more dependencies as needed
];

function installDependencies() {
  console.log('Installing dependencies...');

  dependencies.forEach((dependency) => {
    const command = `npm install ${dependency} --save`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing ${dependency}: ${error}`);
        return;
      }

      console.log(`Installed ${dependency}: ${stdout}`);
    });
  });
}

installDependencies();
