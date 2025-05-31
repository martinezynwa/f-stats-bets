# Database Initialization Guide

## 1. Initialize Database Schema
First, initialize the database schema by calling the initialization endpoint:
```http
POST /seed/init-database
```

Note, initializing database always fully resets the previous database.

## 2. Create users
Prepare User in `User.csv` file
Creating of `UserSettings.csv` is optional and creates UserSettings
```http
POST /seed/init-users
```

## Data Seeding Options (either step 3 or step 4)
After initializing the database schema, you can choose ONE of the following two approaches to seed your data:

## 3. Seed Data from Local CSV Files

### Prerequisites
- Prepare data files in `src/assets/seed` for the following models:
  - `User.csv`
  - `UserSettings.csv`
  - `Season.csv`
  - `League.csv`
  - `Nation.csv`

### Steps
1. Call the seed endpoint with the desired table names:
```http
POST /seed/seed-from-csv
Content-Type: application/json

{
   "tableNames": ["User", "UserSettings", "League", "Nation", "Season"]
}
```

## 4. Seed Data from External API

### Prerequisites
- Prepare data files in `src/assets/seed` for:
  - `User.csv`
  - `UserSettings.csv`
  - `Season.csv`
  - `Nation.csv`
- Before seeding data, tables Season, League, Team, Fixture, Fixture round are deleted for each selected season in request

### Steps
1. Call the external API seed endpoint (one season per call):
```http
POST /seed/seed-from-external-api
Content-Type: application/json

{
   "seasons": [2025],
   "dateFrom" "2024-07-01",
   "dateTo": "2025-06-30"
}
```

## Notes
- Make sure all prerequisite data files are properly formatted and placed in the correct directory
- Choose either the CSV seeding (Step 2) OR the External API seeding (Step 3) approach - do not use both