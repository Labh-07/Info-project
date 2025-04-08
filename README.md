# Society Management System

This project is a full-stack Society Management System developed as part of a team-based academic project. It provides essential functionalities for residents and administrators of a housing society to manage their daily operations efficiently.


## Project Overview

The system includes modules for resident and admin login/signup, profile and apartment management, service requests, complaints, event and notice management, parking slot allocation, admin posts, and bill payments.


## Technology Stack

- **Frontend:** React.js
- **Backend:** Spring Boot
- **Database:** MongoDB
- **Version Control:** Git & GitHub


## Features by Milestone

### Milestone 1 – Developed by Harish ([GitHub](https://github.com/harish-developer26))

- Login functionality
- Signup functionality
- Admin Details Form
- Resident Details Form

### Milestone 2 – Developed by Komal ([GitHub](https://github.com/komal-kokare12))

- Profile Information Management
- Apartment Overview (Block-wise Resident Listing)
- Admin functionality to edit resident details

### Milestone 3 – Developed by Labh ([GitHub](https://github.com/labh-07))

- **Service Requests:** Residents can raise requests, admin can approve/reject with comments.
- **Complaints:** Residents can submit complaints, admins can update status (Pending, In Progress, Solved). Complaint counts categorized by block and status.
- **Events:** Admins can create, edit, and delete events. Residents can view events.
- **Notices:** Admins can post notices with title, date, time, and description. Deletion functionality also provided.
- **Parking Slots:** Admins can allocate, deallocate, and update parking slots. Residents can view their slot status.
- **Admin Posts:** Admins can create posts with an image and description. Residents can view the posts.

### Milestone 4 – Developed by Ajay ([GitHub](https://github.com/Ajay00325))

- Residents can pay:
  - Maintenance Bill
  - Electricity Bill
  - Water Bill
- Payment status is updated upon successful payment.


## How to Run

1. Clone the repository:
git clone https://github.com/Labh-07/Info-project.git

2. Set up backend (Spring Boot) and database (MongoDB):
- Configure your `application.properties` file for database connection.
- Run the backend server.

3. Set up frontend (React):
cd frontend 
npm install 
npm run dev


## Contributors

Please refer to the [CONTRIBUTORS.md](./CONTRIBUTORS.md) file for detailed roles and contributions.
