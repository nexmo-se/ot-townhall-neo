import MarkdownIt from "markdown-it";

class MarkdownService {
  static instance = null;

  static init () {
    MarkdownService.instance = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: true,
      xhtmlOut: true,
      breaks: true
    });
  }

  static getInstance () {
    if (!MarkdownService.instance) MarkdownService.init();
    return MarkdownService.instance
  }
}

export default MarkdownService;