const typeDefinitions = `
type Author {
  id: Int
	firstName: String
	lastName: String
	posts:  [Post]
}

type Post {
	id: Int
	title: String
	text: String
	author: Author
	views: Int
}

type Query {
  author(firstName: String, lastName: String): Author
}

schema {
  query: Query
}
`;

export default [typeDefinitions];
