# Gadget API - Setup Guide

## 1️⃣ Add Database Credentials in `.env` File
- Create a `.env` file in the project root and add your **PostgreSQL credentials**:

DATABASE_URL=postgres://<username>:<password>@localhost:5432/gadgetdb

- Replace `<username>` with your PostgreSQL username (default is **`postgres`**).
- Replace `<password>` with your actual database password.
- Ensure PostgreSQL is running on **port 5432**.

## 2️⃣ Install Dependencies
npm install

## 3️⃣ Start the Server
- nodemon server.js
- node server.js

