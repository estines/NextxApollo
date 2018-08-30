import { graphql } from 'graphql';
import server, { schema } from '../common/config';
import '../common/pubsub';
import mongoose from '../common/db';

function clearDatabase() {
	return mongoose.connection.dropDatabase();
}

beforeAll((done) => {
	setTimeout(() => {
    clearDatabase();
    done();
  }, 1000);
});

describe ('Test user', function() {
	const mock = {
		email: 'test@test.com',
		username: 'test',
		password: 'test'
	};

	var login = {
		_id: '',
		role: '',
		username: '',
		token: '',
		rtoken: '',
	};

  it('should hello', async (done) => {
    const query = `
      query {
        hello
      }
    `;

    const rootValue = {};
    const context = {};

    const result = await graphql(schema, query, rootValue, context);
		const data = result.data.hello;
    // console.log('Hello result: ', JSON.stringify(result));

    expect(typeof data).toBe('string');
    expect(data).toBe('Hello world!');
		done();
  });

  it('should signup', async (done) => {
    const query = `
      mutation {
        signup(
          email: "${mock.email}"
          username: "${mock.username}"
          password: "${mock.password}"
        )
        {
					_id
					email
					name
					picture
					role
					provider
					token
					rtoken
					createdOn
					updatedOn
        }
      }
    `;

    const rootValue = {};
    const context = {};

    const result = await graphql(schema, query, rootValue, context);
		const data = result.data.signup;
    // console.log('Signup result: ', JSON.stringify(result));

		expect(typeof data).toBe('object');
    expect(data._id).not.toBeNull();
    expect(data.email).toBe(mock.email);
    expect(data.name).toBe(mock.username);
    expect(data.picture).toBeNull();
    expect(data.role).toBe('user');
    expect(data.provider).toBe('local');
		expect(data.token).not.toBeNull();
		expect(data.rtoken).not.toBeNull();
		expect(data.createdOn).not.toBeNull();
		expect(data.updatedOn).toBeNull();
		done();
  });

  it('should signin', async (done) => {
    const query = `
      mutation {
        signin(
          username: "${mock.username}"
          password: "${mock.password}"
        )
        {
					_id
					email
					name
					picture
					role
					provider
					token
					rtoken
					createdOn
					updatedOn
        }
      }
    `;

    const rootValue = {};
    const context = {};

    const result = await graphql(schema, query, rootValue, context);
		const data = result.data.signin;
    // console.log('Signin result: ', JSON.stringify(result));

		login = {
			_id: data._id,
			role: data.role,
			username: mock.username,
			token: data.token,
			rtoken: data.rtoken
		}

		expect(typeof data).toBe('object');
    expect(data._id).not.toBeNull();
    expect(data.email).toBe(mock.email);
    expect(data.name).toBe(mock.username);
    expect(data.picture).toBeNull();
    expect(data.role).toBe('user');
    expect(data.provider).toBe('local');
		expect(data.token).not.toBeNull();
		expect(data.rtoken).not.toBeNull();
		expect(data.createdOn).not.toBeNull();
		expect(data.updatedOn).toBeNull();
		done();
  });

	it('should query users', async (done) => {
    const query = `
      query {
        users {
					_id
					email
					name
					picture
					role
					provider
					createdOn
					updatedOn
        }
      }
    `;

    const rootValue = {};
    const context = { authorized: true, user: login };

    const result = await graphql(schema, query, rootValue, context);
		const data = result.data.users[0];
    // console.log('Query result: ', login, JSON.stringify(result));

		expect(typeof data).toBe('object');
    expect(data._id).not.toBeNull();
    expect(data.email).toBe(mock.email);
    expect(data.name).toBe(mock.username);
    expect(data.picture).toBeNull();
    expect(data.role).toBe('user');
    expect(data.provider).toBe('local');
		expect(data.createdOn).not.toBeNull();
		expect(data.updatedOn).not.toBeNull();
		done();
  });

	it('should refresh token', async (done) => {
    const query = `
      mutation {
        token (
					username: "${mock.username}",
					refreshToken: "${login.rtoken}"
				) {
					_id
			    email
			    name
			    picture
			    role
			  	provider
			    token
			    rtoken
			    createdOn
			    updatedOn
        }
      }
    `;

    const rootValue = {};
    const context = {};

    const result = await graphql(schema, query, rootValue, context);
		const data = result.data.token;
    // console.log('Refresh token result: ', JSON.stringify(result));

		expect(typeof data).toBe('object');
    expect(data._id).not.toBeNull();
    expect(data.email).toBe(mock.email);
    expect(data.name).toBe(mock.username);
    expect(data.picture).toBeNull();
    expect(data.role).toBe('user');
    expect(data.provider).toBe('local');
		expect(data.token).not.toBeNull();
		expect(data.rtoken).not.toBeNull();
		expect(data.createdOn).not.toBeNull();
		expect(data.updatedOn).not.toBeNull();
		done();
  });

	it('should signout', async (done) => {
    const query = `
      mutation {
        signout {
					_id
			    email
			    name
			    picture
			    role
			  	provider
			    createdOn
			    updatedOn
        }
      }
    `;

    const rootValue = {};
    const context = { authorized: true, user: login };

    const result = await graphql(schema, query, rootValue, context);
		const data = result.data.signout;
    // console.log('Signout result: ', JSON.stringify(result));

		expect(typeof data).toBe('object');
    expect(data._id).not.toBeNull();
    expect(data.email).toBe(mock.email);
    expect(data.name).toBe(mock.username);
    expect(data.picture).toBeNull();
    expect(data.role).toBe('user');
    expect(data.provider).toBe('local');
		expect(data.createdOn).not.toBeNull();
		expect(data.updatedOn).not.toBeNull();
		done();
  });
});

afterAll((done) => {
	done();
});
