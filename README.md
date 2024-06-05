# Intership web application for department Electrical and Computer Engineering


<a name="readme-top"></a>

<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

The communication and documentation processes involved in student internships between companies and academic departments are often disorganized. This lack of systemization can lead to student confusion in managing internship documentation and a lack of awareness about internship opportunities from various companies. 

In the academic year 2022, a project was initiated to develop a web application to address these issues. However, the system was incomplete. This project aimed to enhance the internship web application, making it more comprehensive and user-friendly. The internship web application for the academic year 2022 lacked functionality in several crucial areas. 

This project focused on developing these areas, including systems for announcing internship opportunities and applications, self-proposed internship placements, automated document generation, news announcements, task notifications for each step of the internship course, internship evaluations, and email notifications. 

Through the development of these systems and others, the internship web application for the department now comprehensively covers various internship processes within a single platform, allowing students to systematically access news announcements and manage internship-related documents with ease


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [![Node][Node.js]][Node-url]
* [![React][React.js]][React-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![Mysql][Mysql.com]][Mysql-url]
* [![Rest][RestAPI]][RestApi-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started
Can run in Local and Docker
### Prerequisites

This project use Node.js version v20.11.0 and React.js version v18.2.0

### Installation

_Run in Local_

1. Install XAMPP [Install XAMPP](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.apachefriends.org/&ved=2ahUKEwjMgoTqhsSGAxX1TmwGHWQ9CrsQFnoECAYQAQ&usg=AOvVaw1G-GhDCi-FQ-Fgj6uBWt1U)

2. Start XAMPP Apache and MySQL then open phpMyAdmin and Create Database name internship4 and import sql file name init.sql into database 

3. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```

4. Install NPM packages in server
   ```sh
   cd server
   ```
      ```sh
   npm install
   ```

5. Install NPM packages in client
   ```sh
   cd client
   ```
      ```sh
   npm install
   ```
6. Start the server
   ```sh
   cd server
   ```
      ```sh
   npm start
   ```
7. Start the client
   ```sh
   cd client
   ```
      ```sh
   npm rundev
   ```

_Run in Docker_
1. Install Docker [Install Docker](https://www.docker.com/get-started/)

2. Open Docker and setup wsl2 for windows [Setup Docker](https://docs.docker.com/desktop/wsl/)

3. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```

4. Open project and set up docker compose file compose.yaml line 35
    environment:
      - VITE_APP_API=http://you-ip-address/api
      - VITE_FILE_API=http://you-ip-address:5500

4. Open project and run command 
   ```sh
   docker compose up --build
   ```
5. If it error like api cannot connent to db 
   ```sh
   docker compose down
   ```
   ```sh
   docker compose up
   ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
_Setup Environment variable_

- DB_HOST = 'localhost'
- DB_PORT = '3306'
- DB_USER = 'root'
- DB_PASSWORD = ''
- DATABASE = 'internship4'
- JWT_SECRET='your_secret'
- PORT='5500'
- REGTU_API_TOKEN='your_regtu_api_token'
- SMTP_PASS = 'your_smtp_pass_gmail'
- EMAIL_ID= 'your_emai_gen_smtp_pass'
- FORGOT_PASSWORD_TOKEN_SECRET= 'your_secret_reset_password'
- FRONTEND_URL= 'http://localhost:9999'
- NO_OF_SALT_ROUNDS= 10


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] v1.0.0 
- [ ] Deploy project
- [ ] Test project
- [ ] Add analyze statistics evaluation internship
- [ ] Add Cancel internship

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Email - wongsakron.kon@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Choose an Open Source License](https://choosealicense.com)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/project.png
[Node.js]: https://img.shields.io/badge/node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/en
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Mysql.com]: https://img.shields.io/badge/Mysql-0769AD?style=for-the-badge&logo=mysql&logoColor=white
[Mysql-url]: https://www.mysql.com/
[RestAPI]: https://img.shields.io/badge/RestAPI-0769AD?style=for-the-badge&logo=rest&logoColor=white
[RestApi-url]: https://www.ibm.com/topics/rest-apis
