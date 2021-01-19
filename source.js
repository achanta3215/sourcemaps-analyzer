// @ts-check
const sourceMap = require('source-map');
const fs = require('fs');
const { exec } = require('child_process');
const prompt = require('prompt-sync')();

const getInput = (title, { env = '' } = {}) => {
    if (env && process.env[env]) return process.env[env];
    return prompt(title);
};

const mapsFolder = getInput(
    'Enter fullpath where sourcemaps are present or set SOURCE_MAPS_FOLDER ',
    { env: 'SOURCE_MAPS_FOLDER' });
const repoPath = getInput(
    'Enter path of repo ',
    { env: 'SOURCE_FILES_REPO' });
const version = getInput('Enter git branch where error occurs ');
const mapFile = getInput('Enter name of map file ');
(async function main() {
    const consumer = await new sourceMap.SourceMapConsumer(fs.readFileSync(mapsFolder + mapFile, "utf8"));
    const { line: sourceLineNumber, source } = consumer.originalPositionFor(
        {
            line: 1,
            column: 273151,
        }
    );
    const sourceFile = source.replace('webpack:///', '');
    console.log(sourceFile);
    const rangeStr = (sourceLineNumber - 10) + ',' + (sourceLineNumber + 10) + 'p';
    console.log(version)
    const sourceFileShowProcess = exec("git show " + version + ":" + sourceFile + " | awk -v ln=1 '{print ln++  " + '" "' + "$0 }' | sed -n " + rangeStr, { cwd: repoPath });
    sourceFileShowProcess.stdout.pipe(process.stdout);
})();