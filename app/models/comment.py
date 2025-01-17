from .db import db, environment, SCHEMA, add_prefix_for_prod

class Comment(db.Model):
    __tablename__ = "comments"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId= db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    postId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id')))
    content = db.Column(db.String(255), nullable=False)
    createdAt = db.Column(db.DateTime, default=db.func.now())
    updatedAt = db.Column(db.DateTime, default=db.func.now())

    comment_owner = db.relationship('User', back_populates='comments')
    comment_post = db.relationship('Post', back_populates='comments')

    def to_dict(self):
        return {
            'id': self.id,
            'postId': self.postId,
            'userId': self.userId,
            'content': self.content,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
            'owner': self.comment_owner.username
        }
