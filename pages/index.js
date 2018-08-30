import App from '../components/App'
import Header from '../components/Header'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
// import stylesheet from '../styles/index.scss'

const query = gql`
    {
        hello
    }
`

const HelloResult = () => (
    <Query query={query}>
        {({ loading, error, data }) => {
            if (loading) return 'loading...'
            if (error) return console.log(error)
            return (
                <div>
                    hi response: {data.hello}
                </div>
            )
        }}
    </Query>
)

export default () => (
    <React.Fragment>
        {/* import styles not working if not call tag below
            <style dangerouslySetInnerHTML={{ __html: stylesheet }} /> 
        */}
        <App>
            <Header />
            <h1>Landing Page</h1>
            <HelloResult />
        </App>
    </React.Fragment>
)