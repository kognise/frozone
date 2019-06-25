import Logo from '../components/Logo'
import Title from '../components/Title'
import Text from '../components/Text'
import LinkButton from '../components/LinkButton'

export default () => (
  <>
    <Logo />
    <Title>Frozone</Title>
    <Text>A React framework that generates entirely static HTML with no JavaScript.</Text>
    <LinkButton href='/docs'>Get started</LinkButton>

    <style jsx global>{`
      body {
        font-family: 'Saira', sans-serif;
        background: #000000;
        color: #ffffff;
        margin: 0;
      }
      body, #root {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </>
)