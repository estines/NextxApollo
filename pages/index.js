import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import Header from '../components/Header'

const query = gql`
    {
        hello
    }
`

const Divs = styled.div`
    width: 100%;
`

const HelloResult = () => (
    <Query query={query}>
        {({ loading, error, data }) => {
            if (loading) return 'loading...'
            if (error) return console.log(error)
            return (
                <Divs>
                    hi response: {data.hello}
                </Divs>
            )
        }}
    </Query>
)

// import styles not working if not call this tag: <style dangerouslySetInnerHTML={{ __html: stylesheet }} /> 
export default () => (
    <Header>
        < React.Fragment >
            <h1>Landing Page</h1>
            <HelloResult />
        </React.Fragment >
    </Header>
)