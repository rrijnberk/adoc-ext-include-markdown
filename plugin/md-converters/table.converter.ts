const mdTableRegex = /^(\|.*\|.{0,})(\n|$)/gm,
    mdTableSpltterRegex = /(\|.-{2,}.){1,}\|/gm

const aggregateMatches = (matches) => {
    const _matches = Object
        .keys(matches)
        .map(key => matches[key]);

    let final = 0,
        index = 0,
        aggregateMatches = [];

    while(final < _matches.length-1) {
        if(!aggregateMatches[index]) {
            aggregateMatches[index] = [];
            aggregateMatches[index].push(_matches[final]);
        }
        if(_matches[final++].end === _matches[final].start) aggregateMatches[index].push(_matches[final]);
        else {
            index++;
        }
    }

    return aggregateMatches;
};

const convertRow = (line) => {
    const result = line
        .trim()
        .replace(/\|$/, '')
        .trim();
    return result;
};

const convert = (mdTable) => {
    const result = mdTable
        .split('\n')
        .filter(line => !mdTableSpltterRegex.test(line))
        .map(convertRow)
        .join('\n');



    return `[options="header"]
|=======
${result}
|=======`;
};

const generateBlock = (a, b) => {
    return {
        full: a.full.concat(b.full),
        match: a.match.concat(b.match)
    }
};

const generateBlocks = (objectsArray) => {
    return objectsArray.reduce(generateBlock);
};

const getTableRows = (content) => {
    let m, matches = {};

    do {
        m = mdTableRegex.exec(content);
        if (m) {
            const [full, match] = m;
            matches[m.index] = {
                full,
                match,
                start: m.index,
                end: m.index + full.length
            };
        }
    } while (m);

    return matches;
};

const mdTableConverter = (content) => {
    const matches = getTableRows(content);
    const blocks = aggregateMatches(matches)
        .map(generateBlocks);


    blocks.map((block) => {
        content = content.replace(block.full, convert(block.full))
    });

    return content;
};

module.exports = mdTableConverter;