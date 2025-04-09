#!/bin/bash

echo "Running some pre-server commands..."

python3 manage.py migrate
python3 manage.py collectstatic 
python3 manage.py loaddata core/fixtures/initial_site.json

# echo "create a superuser"
# python3 manage.py createsuperuser \
#     --noinput \
#     --username $DJANGO_SUPERUSER_USERNAME \
#     --email $DJANGO_SUPERUSER_EMAIL
#     --password $DJANGO_SUPERUSER_PASSWORD
# echo "finished creating a superuser"

echo "Starting the Django development server..."
HOME=/root python3 manage.py runserver 0.0.0.0:8000 --noreload