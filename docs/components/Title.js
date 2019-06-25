export default ({ children }) => (
  <h1>
    {children}
    <style jsx>{`
      h1 {
        font-size: 3em;
        text-align: center;
        margin: 0;
        margin-bottom: 24px;
      }
    `}</style>
  </h1>
)