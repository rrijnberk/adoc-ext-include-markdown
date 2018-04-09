const fs = require('fs-extra');
const path = require('path');

const MarkDown = require('./models/Markdown.ts');

const mdTableConverter = require('./md-converters/table.converter.ts');

function isMarkdownHandler(target) {
    return target.endsWith('.md');
}

function markdownProcessor(doc, reader, target, attrs) {
    const markdown = new MarkDown(fs.readFileSync(path.resolve(reader.dir, target)).toString());

    markdown.applyConverter(mdTableConverter);

    reader.pushInclude(markdown.toString(), target, target, 1, attrs);
    return reader;
}

/**
 * Extension for the handling of markdown files. Converts markdown to AsciiDoc.
 */
function markdownInclusionExtension() {
    this.handles(isMarkdownHandler);
    this.process(markdownProcessor);
}

module.exports = markdownInclusionExtension;