PROJECT TITLE: Ecommerce Project

VIDEO DEMO: https://youtu.be/vvVMcRbINqQ

DESCRIPTION:
The Ecommerce project is a full-fledged web application designed to simulate a real-world online shopping platform. It integrates various functionalities required to create a comprehensive e-commerce experience, from user authentication to order management, and it caters to both customer and admin roles. The project utilizes a modern tech stack, combining Django and Django REST Framework for the backend, React JS for the frontend, and SQLite3 as the database.

This project was developed as a culmination of my learning journey through the CS50 course. While the course focuses on Flask, I opted to use Django due to its robust capabilities in building complex web applications. Django, in combination with the Django REST Framework, offers a more comprehensive solution for developing full-stack applications, which was essential for this project.

Project Structure
Backend: Django & Django REST Framework
models.py: Defines the database schema, including models for User, Product, Category, Order, Cart, and Rating. The User model extends Django's default user model to include additional fields like first_name and last_name. The Product and Category models manage product information, while Order and Cart models handle transactions and cart functionalities.

serializers.py: Contains the serializers that transform complex data types, such as querysets and model instances, into native Python datatypes that can then be easily rendered into JSON or XML. Each model has a corresponding serializer, ensuring that data is correctly formatted for API responses.

views.py: Houses the core logic of the application, including endpoints for user registration, login, product display, cart management, order processing, and more. This file also includes admin-specific views for order monitoring, dashboard analytics, and product management.

urls.py: Maps the URL paths to the appropriate views. This file is crucial for routing incoming requests to the correct functions, ensuring that the application behaves as expected.

settings.py: Configures the Django project settings, including installed apps, middleware, database connections, and third-party integrations like PayMongo for payment processing. This file also includes security settings, such as authentication backends and session management.

Frontend: React JS
App.js: The main component that serves as the entry point for the React application. It includes the routing logic that determines which components to render based on the URL path.

components/: This directory contains reusable React components that make up the user interface. Key components include ProductList, Cart, Checkout, Profile, and OrderTracking. Each component is responsible for rendering a specific part of the UI and handling interactions such as adding products to the cart, updating user profiles, and submitting orders.

services/: Contains the API service modules that handle HTTP requests to the Django backend. These services abstract the network calls, making it easier to manage data fetching and submission across the application.

hooks/: Custom React hooks that encapsulate logic related to state management and side effects. For instance, there might be hooks for handling authentication status, fetching product data, or managing cart items.

Database: SQLite3
SQLite3 was chosen as the database for its simplicity and ease of setup, making it ideal for development and testing purposes. The database stores all persistent data, including user information, product catalogs, orders, and ratings. The schema is designed to ensure data integrity and support the relationships between different models, such as the one-to-many relationship between User and Order, or the many-to-many relationship between Product and Category.

Features
User Authentication
The application supports user registration and login, with Django handling the authentication logic. Users can create accounts, log in, and manage their profiles, including changing their username, first name, last name, and password.

Product Display & Ratings
Customers can browse a catalog of products, each displayed with associated ratings. The frontend dynamically fetches product data from the backend and presents it in an organized, user-friendly format.

Advanced Searching
An advanced search functionality allows users to filter products based on various criteria such as category, price range, and rating. This feature enhances the user experience by making it easier to find specific products.

Cart Management
Users can add products to their cart, update quantities, and remove items as needed. The cart is persistently stored in the database, ensuring that users can return later to complete their purchase.

Checkout & Payment
The checkout process integrates PayMongo as the payment gateway, providing a secure and seamless payment experience. Users can review their order, enter payment details, and complete the transaction, after which they receive a confirmation.

Profile Management
The profile module allows users to update their personal information and change their passwords. This feature is essential for maintaining user security and ensuring that account information is up to date.

Order Tracking & Ratings
After completing a purchase, customers can track their order status and rate the products they received. This functionality encourages user engagement and helps other customers make informed purchasing decisions.

Admin Dashboard
The admin dashboard provides a comprehensive overview of the platform's performance, including analytics on best-selling products, monthly user registrations, and order statuses. Admins can monitor and manage orders, ensuring that products are shipped promptly.

Product & Category Management
Admins have the ability to add, update, and delete products and categories. This functionality is crucial for keeping the product catalog up to date and ensuring that customers have access to the latest offerings.

Design Choices
The decision to use Django over Flask was driven by the need for a more robust backend capable of supporting a full-scale e-commerce application. Django's built-in features, such as the admin panel and ORM, made it a better fit for this project. Additionally, Django REST Framework provided the necessary tools to build a RESTful API, which was essential for the frontend-backend integration.

On the frontend, React JS was chosen for its component-based architecture, which promotes reusability and simplifies state management. React's ecosystem, including hooks and context API, allowed for a clean and efficient implementation of complex UI interactions.

Conclusion
The Ecommerce project represents a comprehensive and scalable solution for building an online shopping platform. It successfully integrates various technologies and features, demonstrating the potential of Django and React JS in creating modern web applications. Through this project, I was able to apply the knowledge gained from the CS50 course and further my understanding of full-stack development.