const sourceMap = require('source-map');
const fs = require('fs');
const { exec } = require('child_process');

const mapsFolder = process.env.SOURCE_MAPS_FOLDER || '';
const version = process.env.SOURCE_MAPS_GIT_BRANCH || '';
const mapFile = process.env.SOURCE_MAP_FILE_NAME || '';
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
    const sourceFileShowProcess = exec("git show " + version + ":" + sourceFile + " | awk -v ln=1 '{print ln++  " + '" "' + "$0 }' | sed -n " + rangeStr);
    sourceFileShowProcess.stdout.pipe(process.stdout);
})()