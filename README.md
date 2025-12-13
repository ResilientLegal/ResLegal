## Project Overview

ResLegal is an AI-enhanced, blockchain-backed case-management platform
designed to modernize how legal teams handle case documents, approvals,
and compliance workflows. Many small and mid-sized law firms still rely
on outdated tools---emails, spreadsheets, and paper-driven
processes---that lead to missing information, inconsistent data, and
weak audit trails. ResLegal solves these challenges by combining
**AI-powered document intelligence** with the **tamper-proof security of
ResilientDB**, a Byzantine fault-tolerant blockchain system.

The platform introduces three core innovations:

-   **AI-Driven Document Review**\
    Automatically analyzes legal case files to detect missing or
    inconsistent information (e.g., dates, medical codes, policy limits)
    and generates actionable suggestions to help caseworkers correct
    issues quickly and accurately.

-   **Smart-Contract-Based Workflow Automation**\
    Business rules such as approval thresholds or escalation steps are
    encoded into programmable smart contracts, ensuring consistent,
    transparent routing and preventing bottlenecks or overlooked tasks.

-   **Blockchain-Secured Audit Trail**\
    Every update---document edits, approvals, and case actions---is
    recorded on ResilientDB, providing an immutable, verifiable ledger
    of activity that preserves trust and data integrity even under
    failures.

By unifying AI reasoning with blockchain immutability, ResLegal improves
**accuracy**, **transparency**, and **accountability** in legal
operations. This project demonstrates the technical feasibility of
combining high-performance AI automation with secure distributed
consensus, laying the foundation for next-generation compliance and
case-management systems.

## Technical Specifications

### System Architectures

The section highlights the overview of our application design.We use **React** as our frontend library and the **Django** framework to interact with the databases, **SQLite** and **ResilientDB**.React will interact with the database through **REST API endpoints** exposed by Django.We also use **OpenAI and Gemini API** for the AI integrations.

![ResLegal System Architecture](https://i.imgur.com/LdmB2DR.png)

### 🛠️Setting up the applications

#### Prerequisites

##### Node JS

You should have Node.JS installed to run React. Follow this [tutorial](https://nodejs.org/en/download) to download Node.JS.

##### ResilientDb

Follow this [installation guide](https://beacon.resilientdb.com/docs/installation) to download, install, and run ResilientDB.You will need **Docker** installed for this.

Please ensure that the database REST API runs on **18000** by default.

#### ⚙️Installation

**1. Clone the github repository**

```bash
   git clone https://github.com/ResilientLegal/ResLegal
   cd ResLegal
```

**2. Start Django Server**
   
   The Django server runs on port **8080** by default. To run the server, do the following:

```bash
   cd backend
   python manage.py runserver
```

**3. Start React Server**

   React runs on port **5173** by default. To run the server, do the following:

```bash
   cd frontend
   npm run server
```

### 🌐 REST API Endpoints

Below are the REST API endpoints you can use to interact with the Django server. Replace `{DJANGO_PORT}` with the running port (e.g., `http://127.0.0.1:8080`).

| Resource Description | Endpoint Path |
| :--- | :--- |
| **Matters** | `{DJANGO_PORT}/api/matters` |
| **Get Matter by ID** | `{DJANGO_PORT}/api/matters/{matter_id}` |
| **Users** | `{DJANGO_PORT}/api/users` |
| **Get Transactions by Matter ID** | `{DJANGO_PORT}/api/matter-transactions/{matter_id}` |
| **Get Transaction by ID** | `{DJANGO_PORT}/api/transactions/{transaction_id}` |
| **Commit Transaction** | `{DJANGO_PORT}/api/transactions/commit` |

