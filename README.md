# README

# Frontend Application Setup Guide

This document provides detailed instructions to set up and run the frontend application on your local machine.

## Prerequisites

- Ensure that the latest version of Node.js is installed on your computer. You can download it from the official Node.js website: https://nodejs.org/.

## Installation and Setup

1. **Install Node.js:**
   If you have not already installed Node.js, please download and install the latest version from the official website.

2. **Navigate to the Frontend Folder:**
   Using your file explorer or terminal, navigate to the frontend directory where the application's source code is located.

   **Frontend Folder Name:** Dashboard_React

3. **Update constants file:**
    Locate the constants.js file in Dashboard_React/people_analytics/src/constants/constantsV3.js.
    Open the file and replace all instances of http://192.168.100.114:8000 with http://localhost:8000.

4. **Install Dependencies:**
   Open the terminal and run the following command to install the necessary dependencies for the application:

   ```
    npm install
    # OR, if you encounter issues
    npm install --force
   ```

5. **Run the Application:**
    Start the application by running the following command:

    ```
    npm run dev
    ```

6. **Access the Application:**
    Once the application is running, copy the URL displayed in the terminal and open it in your web browser to access the dashboard page.