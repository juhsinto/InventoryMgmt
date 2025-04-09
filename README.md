Inventory Management System

### Features Completed:

✅ Develop a user interface - Using React/Tailwind/Tanstack
✅ Ensure the UI is user-friendly and responsive - Using Tailwind CSS
✅ Implement a back-end service - Using Django REST Framework
✅ Ensure the service provides APIs for the front-end to interact with the data layer.

📝 Include a database (SQL or NoSQL) for persisting data.
📝 Deploy your solution to a cloud platform

Base Requirements:
📝 Admin - Add and manage items in inventory (name, quantity, price, and category).
✅ Admin - Assign user roles (admin, manager, or viewer).
✅ Manager - Update inventory quantities (but not item details).
✅ Manager - Generate low-stock alerts.
✅ Viewer - View inventory items and their details.

Unique Requirements:
✅ Implement role-based access control (RBAC) to restrict actions.
📝 Create audit logs showing who updated inventory and when.
📝 Allow managers to bulk update quantities using CSV uploads.
📝 Admins can generate monthly inventory reports via API.

### Consideration/Assumptions:

Can only create normal users when signing up
Low stock alert would be a boolean value for an inventory item ; i.e. on the FE it shows a status pill showing low stock true or false

### Methodology:

I first analyzed the requirements:
since there would be user "role based access control" ; i thought i'd tackle that first - by creating a user management api
then, later i'd create the inventory management, to CRUD inventory items.

Initially i scaffolded the FE in React, with cursor, to create the stubs of the required functionality, using mock data.
then i scaffolded the BE in Django, also with cursor, to create BE stubs, and connected the FE to the BE.

then i spent a considerable amount of time trying to set up a deployment pipeline with GCP
with the mvp BE - i created a docker container, used GC artifact registry, created an artifact repo there, tagged my container image, and pushed it to the repo.
then, i used google cloud run to deploy the container, and it somewhat worked, although i was seeing some cross-origin errors, which then let me to create a continuous deployment pipeline - where i connected a git repository to the cloud build, to trigger on pushing to a branch. after some rapid deployment, i might have exceeded a limit, and then the builds were failing.

anyway, i decided to focus on creating the backend again, based on the things i've learned so far (models, serializer, view, url route) in django

here are the steps i performed for the BE:

1.  use a venv to created an isolated python environment
2.  install the base requirements
3.  create the django app 'backend'; and app "api"
4.  use load data, to load an initial fixtures - to set the sitename ; this can be changed in the admin, but i wanted to do it without using the admin, so that i can do it in the deployment pipeline later
5.  i initially used the User class from django.contrib.auth.models ; however, i needed to customize it as i wanted to add 'roles' , and some more attributes to the users
6.  i had to createsuperuser since i needed to restrict users from creating admins and then deleting others (lol)
7.  after testing out the user management, using postman to manually test the endpoints (creating a collection), I then went on to create the inventory item management.
8.  In the inventory management, I had to restrict managers to only be able to set low_stock and quantity of the inventory items, whereas admins could edit everything, and normal users could only view items.

On the front-end i first focussed on the RBAC control, using react-router-dom & created an auth provider,
along with token based authentication, based on whether the user's token is active.
I made sure than each request is authenticated, with refresh token logic being used (took some time to get this right) - probably best to use an OAuth solution next time!
Then I wired up the api endpoints to the react components, and used react-query to get the data via axios queries..

📝 For the database
I need to change the database to use postgres, and then run the migration ; have done it in a POC - using docker for the postgres db

## Todo - tidy the below

### future iterations / improvements / features

rate limitting the apis
creating an index
creating user & validating email (i did actually implement this in a POC but didn't have enough time to implement it in this) - with forgot password flow
provide postman collection
oauth
automated end to end testing using cypress
front-end tests

##### Deployment todo:

set up artifact registry, then create repo, then copy the link

gcloud auth configure-docker us-central1-docker.pkg.dev

docker tag mvp-django <region>/<project>/mvp/mvp-django:latest

docker push <region>/<project>/mvp/mvp-django:latest

gcloud run
