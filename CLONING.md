# Project Setup & Cloning Guide

This guide provides step-by-step instructions for developers who want to clone, set up, and run the Field Study System project.

## Prerequisites

Before you begin, ensure you have the following installed/set up:

- **Node.js**: Version 18 or higher.
- **pnpm**: We use pnpm as our package manager.
  ```bash
  npm install -g pnpm
  ```
- **Convex Account**: Sign up at [convex.dev](https://convex.dev).
- **Google Cloud Console Account**: For OAuth configuration.

## 1. Cloning the Repository

Clone the project to your local machine:

```bash
git clone <repository-url>
cd <project-directory>
```

## 2. Installation

Install the project dependencies using pnpm:

```bash
pnpm install
```

## 3. Environment Configuration

Create a `.env` file in the root directory of the project. You can copy the structure below:

```bash
cp .env.example .env
# OR manually create the file
touch .env
```

### Required Environment Variables

Add the following variables to your `.env` file:

```env
# Convex Configuration
# This is automatically generated when you run `npx convex dev`, but you can set it manually if needed.
VITE_CONVEX_URL=https://your-deployment-name.convex.cloud

# Google OAuth Configuration
# obtained from Google Cloud Console -> APIs & Services -> Credentials
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Access Control
# Comma-separated list of allowed email domains for login.
# Leave empty to allow all domains (development only).
VITE_ALLOWED_EMAIL_DOMAINS=university.edu,student.university.edu

# Development Features (Optional)
# Set to "true" or "1" to enable a mock login button for testing without Google Auth.
VITE_ENABLE_MOCK_LOGIN=true
```

## 4. Backend Setup (Convex)

Initialize the Convex backend. This will prompt you to log in and create a new project or link to an existing one.

```bash
npx convex dev
```

- Follow the prompts in the terminal.
- Once configured, this command will start the Convex development server and sync your schema/functions.
- It will also automatically update your `.env.local` with the `VITE_CONVEX_URL` and `CONVEX_DEPLOYMENT`.

## 5. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. specific steps:
    - **APIs & Services** > **Credentials** > **Create Credentials** > **OAuth client ID**.
    - Application Type: **Web application**.
    - **Authorized JavaScript origins**: `http://localhost:5173` (and your production URL).
    - **Authorized redirect URIs**: `http://localhost:5173` (and your production URL).
4. Copy the **Client ID** and paste it into `VITE_GOOGLE_CLIENT_ID` in your `.env` file.

## 6. Running the Application

Once everything is set up, start the frontend development server:

```bash
pnpm dev
```

The application should now be running at `http://localhost:5173`.
Make sure `npx convex dev` is also running in a separate terminal to handle backend requests.

## Troubleshooting

- **"Provided address was not an absolute URL"**: Ensure `VITE_CONVEX_URL` is set correctly in `.env` or `.env.local`.
- **Google Login Fails**: Check if your email domain is in `VITE_ALLOWED_EMAIL_DOMAINS` and that the Client ID is correct.
- **Typescript Errors**: Run `pnpm install` again to ensure all types are generated.
