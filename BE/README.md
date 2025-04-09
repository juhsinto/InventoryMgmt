### Backend for the inventory management system

#### initial installation

##### create the venv

`python3 -m venv venv`
`source ./venv/bin/activate`

##### install the requirements

`pip install -r requirements.txt`

### run the project

#### do migrations if necessary

`python manage.py migrate`

# `python manage.py makemigrations` ; only if changes made to the models

### create superuser on first run

`python manage.py createsuperuser`
root
user@example.com
fatcat32

### run the server

`python manage.py runserver`

#### steps to create django project

`django-admin startproject backend`
create the "api" app within the backend
`python manage.py startapp api`

# unnecessary because not using the admin

python manage.py loaddata core/fixtures/initial_site.json

# TODO

read the deployment checklist - https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/
something about using wsgi & gunicorn
left some todos in the settings.py
