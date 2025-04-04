// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home, AlertTriangle } from 'lucide-react'; 

export function NotFoundPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center text-center py-20 sm:py-32 px-4 min-h-[calc(100vh-10rem)]">

      <AlertTriangle className="h-20 w-20 text-destructive mb-6" aria-hidden="true" />

      <h1 className="text-6xl sm:text-8xl font-extrabold text-primary mb-4 tracking-tight">
        404
      </h1>
      <p className="text-2xl sm:text-3xl font-semibold text-foreground mb-6">
        Oops! Page Not Found
      </p>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10">
        We're sorry, but the page you were looking for doesn't seem to exist or may have been moved.
      </p>

      <Button asChild size="lg" className="rounded-full font-semibold">
        <Link to="/">
          <Home className="mr-2 h-5 w-5" aria-hidden="true" />
          Go Back to Homepage
        </Link>
      </Button>
    </div>
  );
}