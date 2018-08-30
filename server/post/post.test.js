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

describe ('Test post', function() {
	const mock = {
		author: 'test',
		comment: 'test'
	};

  it('should add post', async (done) => {
    const query = `
      mutation {
        addPost (
          author: "${mock.author}"
          comment: "${mock.comment}"
        ) {
          _id
          author
          comment
        }
      }
    `;

    const rootValue = {};
    const context = { authorized: true };

    const result = await graphql(schema, query, rootValue, context);
		const data = result.data.addPost;
    // console.log('Add post result: ', JSON.stringify(result));

    expect(typeof data).toBe('object');
    expect(data.author).toBe(mock.author);
    expect(data.comment).toBe(mock.comment);
    done();
  });

  it('should qury posts', async (done) => {
    const query = `
      query {
        posts {
          _id
          author
          comment
        }
      }
    `;

    const rootValue = {};
    const context = { authorized: true };

    const result = await graphql(schema, query, rootValue, context);
		const data = result.data.posts[0];

    expect(typeof data).toBe('object');
    expect(data.author).toBe(mock.author);
    expect(data.comment).toBe(mock.comment);
    done();
  });
});

afterAll((done) => {
	done();
});
