<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/juhsinto/InventoryMgmt">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Inventory Management</h3>

  <p align="center">
    A fun code challenge.
    <br />
    <a href="https://github.com/juhsinto/InventoryMgmt"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/juhsinto/InventoryMgmt">View Demo</a>
    &middot;
    <a href="https://github.com/juhsinto/InventoryMgmt/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/juhsinto/InventoryMgmt/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#design-choices">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://todo.com)

This project was created as part of a Code assignment for an interview round. The assignment had a few requirements, which will be outlined below.

- Needs to be a full stack web application, for inventory stock management
- For the tech stack, there was a preference for a Python framework.
- Data needs to be persisted, use a Database.
- For the functionality,
  - the application should be restricted by Role Based Action Control
  - administrators should be allowed to be able to CRUD users, and inventory items (including categories)
  - managers should only be able to edit item quantity, and change the item stock status (low stock)
  - normal users should only be able to view the inventory items, and details of the items
  - Admins should be able to generate monthly inventory reports via API
  - Managers should be able to bulk update quantites using CSV uploads.
- To make things exciting, there were some additional features requested:
  - Visualize the stock trend levels over time, with a graph
  - Have notifications for low-stock alerts

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- ![React][React.js]
- ![DjangoREST][DjangoREST]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DESIGN CHOICES -->

## Design Choices [TODO]

- For the front-end i decided to use a normal react project, since I didn't need SSR (mostly the app consists of client side components.)
- I chose React built with Vite (CRA is now obsolete) + Typescript + Tailwind. I chose tailwind, out of familiarity. I could have also used Shadcn for UI components, to make it more accessible.
- I chose Django over FastAPI because Django seemed to have more "batteries included".
- I initially created some Proof of Concepts iterating on - user sign up (using email verification & forgot password flow). I chose not to integrate that since I was having trouble with deploying the backend.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these instructions to get this project working on your local environment

### Prerequisites [TODO]

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation [TODO]

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = "ENTER YOUR API";
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap [TODO]

- [ ] Deploy to cloud
- [ ] Bulk Update Inventory via csv upload
- [ x ] Inventory Visualize Stock History

See the [open issues](https://github.com/juhsinto/InventoryMgmt/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Approach [TODO]

- [ ] Deploy to cloud
- [ ] Bulk Update Inventory via csv upload
- [ x ] Inventory Visualize Stock History

See the [open issues](https://github.com/juhsinto/InventoryMgmt/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Performance [TODO]

Scalability & Efficiency

- use oauth to manage users (instead of database) - more scalable, less things to manage
- I read a few articles (https://www.loopwerk.io/articles/2024/django-vs-flask-vs-fastapi/ and https://apidog.com/blog/fast-api-vs-django/#conclusion), which discussed the performance of FastAPI over Django. Apparently FastAPI is meant to be 6x faster in performance (handling requests per second).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

There is no license, do what you want. I am not responsible if your microwave catches fire. Open source :)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Jacinto Mendes - [@juhsinto](https://twitter.com/juhsinto) - jmz033@gmail.com

Project Link: [https://github.com/juhsinto/InventoryMgmt](https://github.com/juhsinto/InventoryMgmt)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- A good bunch of youtube videos
- [Gemini](https://gemini.google.com/?hl=en-AU)
- [Cursor](https://www.cursor.com/en)
- [Best Readme Template](https://github.com/othneildrew/Best-README-Template)

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[forks-shield]: https://img.shields.io/github/forks/juhsinto/InventoryMgmt.svg?style=for-the-badge
[forks-url]: https://github.com/juhsinto/InventoryMgmt/network/members
[stars-shield]: https://img.shields.io/github/stars/juhsinto/InventoryMgmt.svg?style=for-the-badge
[stars-url]: https://github.com/juhsinto/InventoryMgmt/stargazers
[issues-shield]: https://img.shields.io/github/issues/juhsinto/InventoryMgmt.svg?style=for-the-badge
[issues-url]: https://github.com/juhsinto/InventoryMgmt/issues
[linkedin-url]: https://www.linkedin.com/in/jacinto-mendes-b5719290/
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[DjangoREST]: https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray
