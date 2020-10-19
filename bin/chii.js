#!/usr/bin/env node

const program = require('commander');
const server = require('../');
const version = require('../package.json').version;

program.version(version);

program
  .command('start')
  .description('starts chi server')
  .option('-p, --port <port>', 'set the port to start on. defaults to 3000', parseInt)
  .option('-h, --host <host>', 'set the host. defaults to 0.0.0.0')
  .option('-d, --domain <domain>', 'set the domain. defaults to localhost:port')
  .option('-s, --ssl', 'use HTTPS server')
  .option('-c, --cert <cert-path>', 'set cert path')
  .option('-k, --key <key-path>', 'set key path')
  .action(({ port, host, domain, ssl, cert, key }) => {
    server.start({
      port,
      host,
      domain,
      ssl,
      cert,
      key
    });
  });

program
  .command('help [command]')
  .description('display help information for a command')
  .action(command => {
    let cmd = program.commands.find(c => c.name() === command) || program;
    cmd.help();
  });

const args = process.argv;
if (args[2] === '--help' || args[2] === '-h') args[2] = 'help';

program.parse(args);
