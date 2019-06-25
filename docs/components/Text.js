export default ({ children }) => (
  <p>
    {children}
    <style jsx>{`
      p {
        font-size: 1.2em;
        text-align: center;
        max-width: 450px;
        margin: 0;
        margin-bottom: 34px;
      }
    `}</style>
  </p>
)