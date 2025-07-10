// This file is required by React Router v7's file-based routing system
// It defines the routes for the application using the file-based routing convention

// Define the routes for the application
const routes = [
  {
    path: "/",
    file: "root.tsx",  // Points to root.tsx
    children: [
      {
        index: true,
        file: "routes/_index.tsx",  // Points to routes/_index.tsx
      },
      {
        path: "accounts",
        file: "routes/accounts.tsx",  // Points to routes/accounts.tsx
      },
      {
        path: "transactions",
        file: "routes/transactions.tsx",  // Points to routes/transactions.tsx
      },
      {
        path: "history",
        file: "routes/history.tsx",  // Points to routes/history.tsx
      },
      {
        path: "settings",
        file: "routes/settings.tsx",  // Points to routes/settings.tsx
      },
    ],
  },
];

// Export the routes as the default export
export default routes;
