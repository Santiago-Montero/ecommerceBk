const parseArgs = require("minimist");


const args = parseArgs(process.argv.slice(2));
const PORT = parseInt(process.argv[2]); 
const MODE = process.argv[3] || 'CLUSTER'

const info = [
    {
        ruta: process.cwd(),
        id: process.pid,
        version: process.version,
        titulo: process.title,
        plataforma: process.platform,
    },
];
const memoria = [{ memoria: process.memoryUsage() }];

const argsDeEntrada = [args];


module.exports = { info, memoria, argsDeEntrada, PORT, MODE}