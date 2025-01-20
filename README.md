# 🐾 Pawfy - Pet Adoption and Donation Platform

**Pawfy** is a MERN-stack web application designed to facilitate pet adoption and enable users to create and contribute to donation campaigns for pets in need. The platform provides a seamless experience for both users and administrators to manage pets, adoption requests, and donation campaigns.

---

## 🌐 Live URL

Check out the live version here: [Pawfy Live](https://pawfy-693fa.firebaseapp.com)

---

## ✨ Features

### 🏠 Homepage
- **Navbar**:
  - Website logo for branding.
  - Navigation links: Home, Pet Listings, Donation Campaigns, Login/Register.
  - Profile dropdown with options: Dashboard, Logout.
- **Banner Section**: Dynamic slider or static banner aligned with the website theme.
- **Pet Categories**: Quick access to categories like Cats, Dogs, Rabbits, and more.
- **Call to Action**: Inspiring users to adopt pets with compelling visuals and text.
- **About Us**: A brief introduction about Pawfy’s mission.
- **Additional Sections**:
  - **🐕 Success Stories**: Share heartwarming adoption stories.
  - **🤝 Volunteer Opportunities**: Showcase ways to contribute to pet welfare.

---

### 🐶 Pet Listing
- **Grid View**: Displays available pets in a 3-column layout, sorted by the newest first.
- **Search and Filter**:
  - Search by pet name.
  - Filter by pet category.
- **Pet Cards**:
  - Pet image, name, age, location, and a "View Details" button.
- **Infinite Scrolling**: Loads more pets as the user scrolls.

---

### 🐾 Pet Details
- Detailed pet information with an **Adopt Button**.
- **Adoption Modal**:
  - Auto-filled fields: User name and email.
  - Input fields: Phone number, address.
  - Pet details (programmatically added).
- **Adoption Request**: Submits request to the database for review.

---

### 💰 Donation Campaigns
- **Grid View**: Shows donation campaigns in a 3-column layout, sorted by the newest first.
- **Donation Cards**:
  - Pet name, image, maximum donation amount, donated amount, and a "View Details" button.
- **Infinite Scrolling**: Dynamically loads more campaigns.

---

### 🤑 Donation Details
- **Campaign Information**: Comprehensive details of the donation campaign.
- **Donate Now**:
  - Modal with Stripe credit card integration for secure payments.
- **Recommended Donations**: Highlights three active campaigns for users.

---

### 🔒 Authentication
- **Email & Password Authentication**:
  - User-friendly error handling.
- **Social Login**:
  - Google and Facebook integration.
- **User Roles**:
  - Default role: `user`.
  - Admins can promote users to `admin`.

---

### 📋 User Dashboard
- **Dashboard Pages**:
  | Feature                        | Description                                                                 |
  |--------------------------------|-----------------------------------------------------------------------------|
  | Add a Pet                      | Submit details of a pet for adoption.                                       |
  | My Added Pets                  | View and manage pets added by the user.                                     |
  | Adoption Requests              | Manage requests for user-added pets.                                        |
  | Create Donation Campaign       | Add new donation campaigns for pets.                                        |
  | My Donation Campaigns          | Track progress and manage donation campaigns.                               |
  | My Donations                   | View and manage personal donation history.                                  |

---

### 🛠️ Admin Dashboard
Admins have additional privileges:
- **Users**:
  - View, promote, or ban users.
- **All Pets**:
  - Manage all pets on the platform (update, delete, or mark as adopted).
- **All Donations**:
  - Manage all donation campaigns (edit, delete, pause).

---

## 🏗️ Tech Stack

| Technology       | Description                                     |
|-------------------|-------------------------------------------------|
| **Frontend**      | React, Tailwind CSS, ShadCN-UI, Material-Tailwind |
| **Backend**       | Node.js, Express.js                            |
| **Database**      | MongoDB                                        |
| **Authentication**| Firebase Authentication, JWT                   |
| **Cloud Storage** | Cloudinary                                     |
| **Payment**       | Stripe API                                     |

---

## 📦 NPM Packages Used

| Package                         | Description                                                   |
|---------------------------------|---------------------------------------------------------------|
| `@radix-ui/react-dropdown-menu` | Dropdown components for the profile menu.                    |
| `@tanstack/react-query`         | Data fetching and state management.                          |
| `@tanstack/react-table`         | Powerful table utilities.                                    |
| `axios`                         | HTTP requests handling.                                      |
| `firebase`                      | Authentication and database operations.                      |
| `react-hook-form`               | Form handling with validation.                               |
| `react-loading-skeleton`        | Skeleton loaders for better UX.                             |
| `react-quill`                   | WYSIWYG editor for detailed descriptions.                    |
| `react-select`                  | Custom dropdown menus.                                       |
| `react-hot-toast`               | Notifications for success and error messages.               |
| `sweetalert2`                   | Modals for confirmations and alerts.                        |
| `stripe`                        | Payment processing with Stripe.                             |

## 🌟 Key Features Implemented

- **Infinite Scrolling** for Pets and Donations.
- **Loading Skeletons** for improved user experience.
- **WYSIWYG Editor** for detailed input fields.
- **Responsive Design** with **Dark/Light Mode**.
- **Admin and User Roles** with protected routes.

---

## 🚀 Future Enhancements

- **Multilingual Support** to cater to a global audience.
- **Analytics Dashboards** for admins to monitor platform activity.
- **Chat Features** for adopters and pet owners to communicate directly.

---

## 🛡️ Security

- **JWT Authentication**: Ensures secure access to protected routes.  
- **Role-based Access Control**: Admin and User roles to manage permissions effectively.  
- **Firebase Auth**: Secure and scalable authentication for users.  

---

## 🎨 Design Philosophy

- **Responsive Design**: Works seamlessly across devices (mobile, tablet, and desktop).  
- **Dark/Light Mode**: User preference with elegant transitions.  
- **Skeleton Loaders**: Smooth UX for data loading, eliminating jarring loading spinners.  

---

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. **Fork the Repository**.  
2. Make your changes.  
3. Submit a **Pull Request**.  

---

## 🔧 Installation and Setup

### Prerequisites
- Node.js
- MongoDB
- Firebase Project
- Stripe API Keys

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/rifat-mahmudul/pawfy.git
   cd pawfy
