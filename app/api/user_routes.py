from flask import Blueprint, request
from flask_login import login_required, current_user, logout_user
from app.models import User, db
from app.forms import UserNameForm, EmailForm, PasswordForm, ProfileForm
from .auth_routes import validation_errors_to_error_messages
from app.api.aws_helpers import upload_file_to_s3, get_unique_filename, remove_file_from_s3

user_routes = Blueprint('users', __name__)

def is_demo_user(user):
    return user.id == 1


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return [user.to_dict() for user in users]



@user_routes.route('/<int:id>/following')
@login_required
def user_following(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return [user.to_dict() for user in user.following]


@user_routes.route('/<int:id>/followers')
@login_required
def user_followers(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return [user.to_dict() for user in user.followers]


@user_routes.route('/current_user/edit_profile', methods=['PUT'])
@login_required
def edit_profile():
    """
    Query for editing a user's profile and returns that user in a dictionary
    """
    form = ProfileForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if is_demo_user(current_user):
        return {'errors': ['Cannot edit Demo user!']}, 401

    if form.validate_on_submit():
        if form.data['profile_image']:
            remove_file_from_s3(current_user.profile_image)
            pfp = form.data['profile_image']
            pfp_upload = upload_file_to_s3(pfp)

            if "url" not in pfp_upload:
                return pfp_upload, 400
            url = pfp_upload["url"]
            current_user.profile_image = url

        if form.data['profile_banner']:
            remove_file_from_s3(current_user.profile_banner)
            banner = form.data['profile_banner']
            banner_upload = upload_file_to_s3(banner)

            if "url" not in banner_upload:
                return banner_upload, 400
            url = banner_upload["url"]
            current_user.profile_banner = url

        current_user.title = form.data['title']
        current_user.description = form.data['description']
        db.session.commit()
        return current_user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@user_routes.route('/current_user/edit_username', methods=['PUT'])
@login_required
def edit_username():
    """
    Query for editing a user's username and returns that user in a dictionary
    """
    form = UserNameForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if is_demo_user(current_user):
        return {'errors': ['Cannot edit Demo user!']}, 401

    if form.data['username'] == current_user.username and current_user.check_password( form.data['password']):
        return current_user.to_dict()
    
    if current_user.check_password( form.data['password']) == False:
        return {'errors': ['Incorrect Password']}, 401

    if form.validate_on_submit():
        current_user.username = form.data['username']

        db.session.commit()
        return current_user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@user_routes.route('/current_user/edit_email', methods=['PUT'])
@login_required
def edit_email():
    """
    Query for editing a user's email and returns that user in a dictionary
    """
    form = EmailForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if is_demo_user(current_user):
        return {'errors': ['Cannot edit Demo user!']}, 401

    if form.data['email'] == current_user.email and current_user.check_password( form.data['password']):
        return current_user.to_dict()
    
    if current_user.check_password( form.data['password']) == False:
        return {'errors': ['Incorrect Password']}, 401
    
    if form.validate_on_submit():
        current_user.email = form.data['email']
        db.session.commit()
        return current_user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@user_routes.route('/current_user/edit_password', methods=['PUT'])
@login_required
def edit_password():
    """
    Query for editing a user's password and returns that user in a dictionary
    """
    form = PasswordForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if is_demo_user(current_user):
        return {'errors': ['Cannot edit Demo user!']}, 401

    if current_user.check_password( form.data['password']) == False:
        return {'errors': ['Incorrect Password']}, 401
    
    if form.data['new_password'] == form.data['password']:
        return {'errors': ['New Password must be different from current password']}, 401
    
    if form.validate_on_submit():
        current_user.password = form.data['new_password']
        db.session.commit()
        return current_user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@user_routes.route('/current_user/delete', methods=['DELETE'])
@login_required
def delete_user():
    """
    Query for deleting a user and returns a message
    """
    if is_demo_user(current_user):
        return {'errors': ['Cannot delete Demo user!']}, 401
    
    db.session.delete(current_user)
    db.session.commit()
    logout_user()
    return {"Message": "User Deleted Successfully"}

