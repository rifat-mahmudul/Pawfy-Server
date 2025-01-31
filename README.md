# 🐾 Pawfy 🐾

**Pawfy** is a comprehensive platform designed to connect those who want to give their pets up for adoption with those who want to adopt. It also facilitates donation campaigns for pets in need.

## 🐕 Features 🐈

* **User Authentication:** Secure email/password login, with additional support for Google, Facebook, and GitHub authentication.  🔐
* **Pet Listing:** Browse available pets, filter by category, and view detailed information. 🐶🐱🐰
* **Adoption Management:** Submit adoption requests, manage requests (for pet owners), and track adoption status.  📝
* **Donation Campaigns:** Create and manage donation campaigns, track donations, and view donators. 💰
* **User Dashboard:** Personalized dashboard for users to manage their pets, adoption requests, and donations. 📊
* **Admin Dashboard:** Administrative features to manage users, pets, and donation campaigns. ⚙️
* **Infinite Scrolling:** Smooth, seamless browsing of pets and donation campaigns.  ♾️
* **Responsive Design:** Accessible and visually appealing across all devices (mobile, tablet, desktop). 📱💻
* **Dark/Light Mode:** Personalized viewing experience. 🌓

## 💻 Technologies Used 🖥️

* **Frontend:** React, Shadcn-UI (or similar UI library), Tanstack Table, Formik/React Hook Form, Cloudinary/Imgbb API, WYSIWYG/Markdown Editor (e.g., Tiptap, Slate, React-Quill), React Loading Skeleton, Tanstack Query, React Intersection Observer.
* **Backend:** Node.js, Express.js, MongoDB, JWT, Stripe, Cookie Parser.

## 🚀 Getting Started 🔨

1. **Clone the repository:** `git clone https://github.com/your-username/Pawfy.git`  📥
2. **Install dependencies:** `npm install`  📦
3. **Set up environment variables:** Create a `.env` file and configure your database connection, Stripe API keys, and JWT secret.  ⚙️
4. **Start the server:** `npm start`  ▶️

## 📂 API Endpoints 🗄️

**Authentication:**

* `POST /jwt`: Generate JWT token.
* `GET /logout`: Clear JWT token.
* `POST /users`: Save user data.
* `GET /users`: Get all users (admin only).
* `PATCH /user/admin/:id`: Update user role (admin only).
* `GET /user/:email`: Get user data by email.

**Pets:**

* `POST /pets`: Add a pet.
* `GET /pets/:email`: Get pets for a specific user.
* `GET /pets`: Get all pets.
* `GET /pet/:id`: Get single pet by ID.
* `PATCH /pet/:id`: Update pet data.
* `PATCH /pets/adopt/:id`: Update pet adoption status.
* `DELETE /pet/:id`: Delete pet by ID.

**Adoption Requests:**

* `POST /adopt-request`: Submit adoption request.
* `GET /adopt-request/:email`: Get adoption requests by user email.
* `PATCH /adopt-request/:id`: Update adoption request status.

**Donation Campaigns:**

* `POST /donation`: Create a donation campaign.
* `GET /donationCampaigns`: Get all donation campaigns.
* `GET /donationCampaigns/:email`: Get donation campaigns for a specific user.
* `GET /campaign/:id`: Get donation campaign by ID.
* `PATCH /donationCampaign/:id`: Update donation campaign info.
* `DELETE /campaigns/:id`: Delete donation campaign (admin only).

**Donations:**

* `POST /create-payment-intent`: Create Stripe payment intent.
* `POST /all-donation`: Record donation.
* `GET /my-donations/:email`: Get donation info for a specific user.
* `DELETE /donations/:id`: Delete donation info.

## 🤝 Contributing 💡

Contributions are welcome! Feel free to open issues or submit pull requests.  🙌

