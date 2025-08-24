Task Together
Task Together is a collaborative task management application that allows users to create, track, and manage tasks efficiently. The app focuses on a simple and intuitive interface, enabling users to assign, filter, and sort tasks with ease.

Key Features
Task Management (CRUD): Create, read, update, and delete tasks.

Advanced Filtering: Filter tasks by status ("Done", "In Process", "To Do"), due date, or tasks assigned to the current user.

Task Sorting: Sort tasks by due date.

User Authentication: Secure user registration, login, and profile management using Supabase.

Dashboard: A centralized and user-friendly dashboard to display all tasks.

Technologies
The project is built using the following technologies:

Frontend: React

Backend as a Service (BaaS): Supabase - Used for authentication, database, and APIs.

Styling: CSS Modules

Installation and Setup
To get the project running locally, follow these steps:

Clone the Repository

Bash

git clone [your_repository_address]
cd task-together
Install Dependencies

Bash

npm install
Supabase Configuration

Create a new project in Supabase.

Navigate to your project settings (Settings -> API).

Copy your Project URL and the anon key.

Create a .env file in the project root directory and add your credentials:

קטע קוד

REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
Run the Application

Bash

npm start
The application will run on githubpages

Usage
Once the app is running, follow these steps to get started:

Login/Sign Up: Navigate to the login page and sign up with an email address.

Dashboard: After logging in, you'll be redirected to the main dashboard.

Create a Task: Click the "+" button to open the new task modal.

Edit a Task: Click on an existing task to open the edit modal.

Filter and Sort: Use the filter and sort dropdowns to customize your task view.