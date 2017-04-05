import Sequelize from 'sequelize';
import casual	 from 'casual';
import _ from 'lodash';
import Mongoose from 'mongoose';

const db = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite',
});

const AuthorModel = db.define('author', {
  id: { type: Sequelize.STRING, primaryKey: true },
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
});

const PostModel = db.define('post', {
  id: { type: Sequelize.STRING, primaryKey: true },
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING },
});

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

// views in MongoDb
const mongo = Mongoose.connect('mongodb://localhost:27017/views');

const ViewsSchema = Mongoose.Schema({
  postId: String,
  views: Number,
});

const View = Mongoose.model('views', ViewsSchema);

casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(2, () => {
    return AuthorModel.create({
      id: casual.uuid,
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      return author.createPost({
        id: casual.uuid,
        title: `A post by ${author.firstName}`,
        text: casual.sentences(3),
      }).then((post) => {
        return View.update({ postId: post.id },
          { views: casual.integer(0, 100) },
          { upsert: true });
      });
    });
  });
});

const Author = db.models.author;
const Post = db.models.post;

export { Author, Post, View };
