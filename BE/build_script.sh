cd backend

python manage.py migrate

gunicorn --chdir backend  --bind 0.0.0.0:8000 --workers=4 backend.wsgi:application --reload