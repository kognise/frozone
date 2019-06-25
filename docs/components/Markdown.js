import Slugger from 'github-slugger'
import MarkdownIt from 'markdown-it'
import { memo } from 'react'
import anchor from 'markdown-it-anchor'
import mila from 'markdown-it-link-attributes'
import prism from 'markdown-it-prism'
import highlighting from '../highlighting'

const slugger = new Slugger()
const md = new MarkdownIt({ html: true })
  .use(anchor, { slugify: slugger.slug.bind(slugger) })
  .use(mila, {
    pattern: /^https?:\/\//,
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  })
  .use(prism)

const getHtml = (source) => {
  const html = md.render(source)
  slugger.reset()
  return html
}

export default memo(({ source }) => (
  <>
    <div dangerouslySetInnerHTML={{ __html: getHtml(source) }} className='markdown' />

    <style jsx>{`
      .markdown :global(a) {
        color: #1EB295;
        text-decoration: none;
        display: inline-block;
      }
      .markdown :global(a):hover {
        text-decoration: underline;
      }

      .markdown :global(a),
      .markdown :global(summary) {
        outline: none;
      }
      .markdown :global(a):focus,
      .markdown :global(summary):focus {
        box-shadow: 0 0 0 4px #23FFD369;
      }

      .markdown :global(blockquote) {
        border-left: 4px solid #42B295;
        background: #42B29533;
        margin: 0;
        padding: 10px 0 10px 20px;
      }
      .markdown :global(blockquote p) {
        margin: 0;
      }
    `}</style>
    <style jsx global>{highlighting}</style>
  </>
))