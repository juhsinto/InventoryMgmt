i first analyzed the requirements:
since there would be user "role based access control" ; i thought i'd tackle that first - by creating a user management api
then, later i'd create the inventory management, to CRUD inventory items.

initially i scaffolded the FE in React, with cursor, to create the stubs of the required functionality, using mock data.
then i scaffolded the BE in Django, also with cursor, to create BE stubs, and connected the FE to the BE.

then i spent a considerable amount of time trying to set up a deployment pipeline with GCP
with the mvp BE -
i created a docker container, used GC artifact registry, created an artifact repo there, tagged my container image, and pushed it to the repo.
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

## Todo - tidy the below

Future iteration, consideration:
rate limitting the apis
creating an index

Develop a user interface using any modern framework/library (e.g., React, Angular, Vue.js).
Ensure the UI is user-friendly and demonstrates responsiveness (mobile and desktop compatibility).

Implement a back-end service using a framework of your choice (e.g., Node.js, Python Django/Flask, Java Spring Boot).
Ensure the service provides APIs for the front-end to interact with the data layer.

Include a database (SQL or NoSQL) for persisting data. Use a schema or structure that aligns with your solution's functionality.

Optionally, deploy your solution to a cloud platform (e.g., AWS, Azure, Google Cloud) or use a local development server to demonstrate functionality.

Documentation

- key decisions
- features completed

Roadmap

- future iterations / improvements / features

Features:

- CRUD - Users, Inventory Itms
- RBAC - for CRUD based on User Role
- Create audit logs showing who updated inventory and when. => Item History

Admins can - Assign user roles (admin, manager, or viewer)
Admins can - Add and manage items in inventory (name, quantity, price, and category).

**Managers:**

- **Update inventory quantities (but not item details).**
- **Generate low-stock alerts.**

**Viewers:**

- **View inventory items and their details.**
