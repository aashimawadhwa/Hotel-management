
## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Hotel Managemnet Assignment

# Goal
The goal of this project is to develop a simple hotel booking system for a single hotel with 12 available rooms of 2 categories, 6 rooms each. The system will include a user-facing booking interface built with Next.js and React, and Firestore for database storage. Additionally, an admin panel will be implemented to manage rooms and bookings efficiently.
# Features
## Client Booking Interface
#### Homepage:
- Display information about the hotel.
- Showcase available rooms and their details.
- Include a prominent call-to-action button to initiate the booking process.
#### Room Selection:
- Provide a list of available rooms with details (e.g., room type, amenities, price).
- Allow users to select the desired check-in and check-out dates.
#### Booking Flow:
- Provide details of the selected room and price
- Make dummy payment screen and confirm booking ( don't integrate payments )
#### User Authentication:
- Implement user authentication for booking history and personalised experiences.
#### Booking Confirmation:
- Send confirmation emails to users after successful bookings.
- Generate unique booking IDs for tracking.
## Admin Panel
#### Login:
- Secure login for admin access.
#### Dashboard:
- Display an overview of current bookings, room availability, and revenue.
- Provide quick access to detailed booking management.
#### Room Management:
- Update room details such as availability, price, and amenities.
#### User Management:
- Manage admin accounts and permissions.
#### Tech Stack
#### Frontend: Next.js, React, Tailwind CSS for styling
#### Backend: Serverless ( Next.JS )
#### Database: Firestore



