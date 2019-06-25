import Link from 'frozone/link'

export default ({ href, children }) => (
  <Link href={href}>
    <a>
      {children}
      
      <style jsx>{`
        a {
          background: #23FFD3;
          outline: none;
          padding: 10px 20px;
          display: block;
          cursor: pointer;
          text-decoration: none;
          color: #000000;
          
          font-family: 'Saira';
          font-size: 1.2em;
        }
        a:hover {
          background: #1EB295;
        }
        a:focus {
          box-shadow: 0 0 0 4px #23FFD369;
        }
      `}</style>
    </a>
  </Link>
)