# QueryAI 🤖

### Natural Language to SQL Analytics Platform

QueryAI is an AI-powered web application that allows users to interact with databases using **natural language** instead of writing SQL queries manually.

Users can ask questions such as:

> "Show me all employees in the IT department"

QueryAI uses an LLM to understand the user's question, generate the corresponding SQL query, validate it, execute it against the connected database, and present the results in an easy-to-understand format.

---

## 🚀 Features

- 🧠 **Natural Language to SQL**
  - Convert plain English questions into SQL queries using an LLM.

- 🔐 **User Authentication**
  - User registration and login system.
  - Secure session-based authentication using JWT and cookies.

- 🗄️ **Database Query Execution**
  - Execute AI-generated SQL queries against a connected database.

- ✅ **SQL Validation**
  - Validate generated SQL before execution.
  - Helps prevent invalid or unsafe queries from being executed.

- 📊 **Data Visualization**
  - Display query results in an easy-to-understand table format.
  - Supports visual representation of data where applicable.

- 🖥️ **Web Dashboard**
  - User-friendly dashboard for interacting with the database using natural language.

- 🔒 **Protected Routes**
  - Dashboard and database functionality are accessible only to authenticated users.

---

## 🏗️ How QueryAI Works

```text
                User
                  │
                  ▼
        Natural Language Query
                  │
                  ▼
             QueryAI
                  │
                  ▼
          LLM / AI Model
                  │
                  ▼
          Generated SQL Query
                  │
                  ▼
           SQL Validation
                  │
                  ▼
          Database Execution
                  │
                  ▼
           Query Result
                  │
                  ▼
        Table / Visualization