import fetch from 'node-fetch'
import Markdown from '../components/Markdown'
import Title from '../components/Title'
import LinkButton from '../components/LinkButton'

const Page = ({ readme }) => (
  <>
    <div className='container'>
      <Title>Frozone Docs</Title>
      <LinkButton href='..'>Go home &raquo;</LinkButton>
      <Markdown source={
        readme
          .replace(/deploying\/(.+)\.md/g, 'https://github.com/kognise/frozone/blob/master/deploying/$1.md')
          .replace(/^.+(?=(<!-- START doctoc))/s, '')
        } escapeHtml={false} />
    </div>

    <style jsx>{`
      .container {
        max-width: 680px;
        margin: 0 auto;
      }
    `}</style>
    <style jsx global>{`
      body {
        font-family: 'Saira', sans-serif;
        margin: 0;
        padding: 14px;
      }
    `}</style>
  </>
)

Page.getInitialProps = async () => {
  const res = await fetch('https://api.github.com/repos/kognise/frozone/readme')
  const json = await res.json()
  return {
    readme: Buffer.from(json.content, 'base64').toString()
  }
}

export default Page