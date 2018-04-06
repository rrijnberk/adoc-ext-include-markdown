function Markdown(content) {
    const self = this;
    let convertedContent;

    this.applyConverter = (converter) => {
        convertedContent = converter(convertedContent || content);
        return self;
    };

    this.toString = () => {
        return convertedContent || content;
    };
}

module.exports = Markdown;