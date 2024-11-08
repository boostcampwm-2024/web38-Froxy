import React, { Fragment } from 'react';
import { jsxDEV } from 'react/jsx-dev-runtime';
import { jsx, jsxs } from 'react/jsx-runtime';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeReact from 'rehype-react';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import '@/index.css';

type MarkdownProps = {
  markdown?: string;
  theme?: 'github-light' | 'github-dark';
};

export function Markdown({ markdown, theme = 'github-light' }: MarkdownProps) {
  const [content, setContent] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    processMarkdown({ markdown, theme }).then(setContent);
  }, [markdown, theme]);

  return <div>{content}</div>;
}

const processMarkdown = async ({ markdown, theme }: MarkdownProps) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme,
      keepBackground: theme === 'github-dark'
    })
    .use(rehypeReact, {
      createElement: React.createElement,
      Fragment,
      jsx,
      jsxs,
      jsxDEV
    });

  return processor.process(markdown).then((file) => file.result);
};
