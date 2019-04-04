'use strict';

const fs = require('fs');

if (process.platform === 'win32') {
    const config = fs.readFileSync('../node.vcxproj');
    const regex = /<ItemDefinitionGroup .+=='Release\|x64'">(.|\r|\n)+?<PreprocessorDefinitions>(.+?);\%\(PreprocessorDefinitions\)<\/PreprocessorDefinitions>/g;
    const matchs = regex.exec(config);
    let conf = matchs[2];
    if (conf) {
        let confs = conf.replace(/&quot;/g, '\\"')
                        .split(';')
                        .map(c => `"${c}"`);
        console.log(confs.join(',\n'));
    }
} else if (process.platform === 'darwin') {
    const config = fs.readFileSync('../out/node_lib.target.mk', { encoding: 'utf8' });
    const regex = /DEFS_Release := \\\n((.+\n)+)/g
    const matchs = regex.exec(config);
    let conf = matchs[1];
    if (conf) {
        let confs = conf.split('\\');
        confs = confs.map(c => {
            let r = c.replace(/'|\n|\t| /g, '')
                     .replace(/"/g, '\\"')
                     .replace(/^-D/, '');
            return `"${r}"`;
        });
        console.log(confs.join(',\n'));
    }
}
