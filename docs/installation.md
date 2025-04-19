# Installation Guide

This guide provides detailed instructions for setting up Project Hackfest-25 in different environments.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js v14.x or later
- Python 3.8 or later
- MongoDB v4.4 or later
- Ganache or access to an Ethereum network (for blockchain features)
- Git

## Clone the Repository

```bash
git clone https://github.com/your-organization/project-Hackfest-25.git
cd project-Hackfest-25
```

## Backend Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the backend server:

```bash
npm run dev
```

The server will be available at http://localhost:5000 by default.

## Frontend Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Create a `.env` file for frontend configuration:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:

```bash
npm start
```

The frontend will be available at http://localhost:3000 by default.

## AI Models Setup

1. Set up a Python virtual environment:

```bash
cd ai-models
python -m venv venv
```

2. Activate the virtual environment:

```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install required Python packages:

```bash
pip install -r requirements.txt
```

4. Run the model training script:

```bash
python model_training.py
```

5. Start the model server:

```bash
python model_server.py
```

The AI model server will be available at http://localhost:5001 by default.

## Blockchain Setup

1. Install blockchain dependencies:

```bash
cd blockchain
npm install
```

2. Create a `.env` file based on `.env.example` in the config directory:

```bash
cp config/.env.example config/.env
# Edit .env with your configuration
```

3. Start a local blockchain:

```bash
npm run dev
```

4. Compile and deploy smart contracts:

```bash
npm run compile
npm run migrate
```

## Complete Installation

Once all components are set up, the full application can be accessed through the frontend URL (http://localhost:3000 by default).

For development, you may want to run all services simultaneously. We recommend using a tool like `concurrently`:

```bash
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm start" "cd ai-models && python model_server.py"
```

## Production Deployment

For production deployment, we recommend:

1. Building optimized versions of frontend and backend
2. Using containerization (Docker) for consistent deployment
3. Setting up a reverse proxy (e.g., Nginx)
4. Configuring SSL certificates
5. Using a process manager (e.g., PM2) for the Node.js backend

See the [Production Deployment Guide](./production-deployment.md) for detailed instructions.

## Troubleshooting

If you encounter issues during installation, please refer to the [Troubleshooting Guide](./troubleshooting.md) or open an issue on GitHub.
