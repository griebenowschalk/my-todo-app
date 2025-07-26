# My Todo App

[![CI](https://github.com/griebenowschalk/my-todo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/griebenowschalk/my-todo-app/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/griebenowschalk/my-todo-app/badge.svg)](https://codecov.io/gh/griebenowschalk/my-todo-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)

A modern, full-stack todo application built with Next.js 15, featuring real-time updates, responsive design, and a clean user interface.

## Live Demo

**[View Live Demo](https://my-todo-app-production-6f44.up.railway.app/)**

## Features

- **Create, Read, Update, Delete** todos with real-time updates
- **Responsive design** that works on desktop, tablet, and mobile
- **Modern UI** built with shadcn/ui components
- **Form validation** using React Hook Form and Zod
- **Type-safe** with TypeScript
- **Real-time state management** with React Context

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Reliable database (hosted on Xata)
- **Xata** - Serverless database platform

### Development Tools

- **Vitest** - Fast unit testing framework
- **Testing Library** - Simple and complete testing utilities
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-todo-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```env
   DB_URL=your_database_connection_string
   ```

4. **Run database migrations**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── TodoForm.tsx   # Todo creation/editing form
│   ├── TodoList.tsx   # Todo list display
│   └── Header.tsx     # App header
├── contexts/          # React Context providers
│   └── TodoContext.tsx
├── hooks/             # Custom React hooks
│   └── useTodos.ts
├── lib/               # Utility libraries
│   ├── api.ts         # API client
│   └── utils.ts       # Helper functions
├── types/             # TypeScript type definitions
│   └── todo.ts
└── db/                # Database configuration
    ├── index.ts       # Database connection
    └── schema.ts      # Drizzle schema
```

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries
- [Xata](https://xata.io/) for the serverless database platform
