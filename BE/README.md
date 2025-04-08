### Backend for the inventory management system

#### initial installation

##### create the venv

`python3 -m venv env`
`source ./env/bin/activate`

##### install the requirements

`pip install -r requirements.txt`

#### create django project

`django-admin startproject backend`
create the "api" app within the backend
`python manage.py startapp api`

python manage.py makemigrations
python manage.py migrate

python manage.py loaddata core/fixtures/initial_site.json

# TODO

read the deployment checklist - https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/
something about using wsgi & gunicorn
left some todos in the settings.py
