import Link from 'next/link'
import { withRouter } from 'next/router'

const Header = ({ router: { pathname }, children }) => (
  <React.Fragment>
    <header>
      <Link prefetch href='/'>
        <a>Home</a>
      </Link>
      <Link prefetch href='/about'>
        <a>About</a>
      </Link>
    </header>
    {children}
  </React.Fragment>
)

export default withRouter(Header)