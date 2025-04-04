// src/pages/DeveloperPage.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'; // For potential future images

const developers = [
  { id: 1, name: "Raiyan Hasan", role: "Project Lead & Full Stack Developer" },
  { id: 2, name: "Razique Hasan", role: "Frontend Developer & UI/UX" },
  { id: 3, name: "Syed Azam", role: "Backend Developer & AI Integration" },
];

export function DeveloperPage() {
  return (
    <div className="container max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-center text-foreground sm:text-4xl mb-12">
        Meet the Team Delta Developers
      </h1>
      <div className="grid grid-cols-1 gap-8">
        {developers.map((dev) => (
          <Card key={dev.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-border/30">
            <CardContent className="p-6 flex items-center space-x-4">
              {/* Placeholder Avatar */}
              <Avatar className="h-16 w-16">
                {/* Add AvatarImage src later if you have images */}
                {/* <AvatarImage src={`https://github.com/${dev.githubUsername}.png`} alt={dev.name} /> */}
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">
                  {dev.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{dev.name}</h2>
                <p className="text-md text-muted-foreground">{dev.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}