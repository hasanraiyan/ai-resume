// src/pages/DeveloperPage.jsx
import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Github, Linkedin } from 'lucide-react';

// Updated developers array from Step 1 goes here...
const developers = [
  {
    id: 1,
    name: "Raiyan Hasan",
    role: "Project Lead & Full Stack Developer",
    imageUrl: "https://avatars.githubusercontent.com/u/143262732?v=4", // Direct image path
    githubUsername: "hasanraiyan",
    linkedinUrl: "https://www.linkedin.com/in/hasanraiyan/",
  },
  {
    id: 2,
    name: "Razique Hasan",
    role: "Team Lead",
    imageUrl: "https://media.licdn.com/dms/image/v2/D5635AQH_RHO2fxCiCQ/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1734543292708?e=1744398000&v=beta&t=S7v4lDkxZzSgIETqVq1GHWtNB5zXlg_TppAf2EqqA9A", 
    githubUsername: "raziquehasan",
    linkedinUrl: "https://www.linkedin.com/in/razique-hasan-73a2832a2/",
  },
  {
    id: 3,
    name: "Syed Azam",
    role: "content writing",
    imageUrl: "https://media.licdn.com/dms/image/v2/D5635AQEvLqkJjtKylQ/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1734725657939?e=1744398000&v=beta&t=-ynmq4HalD5hYNLFjWCXz1dUzffqsCbqLyFALiXpkwc", 
    githubUsername: "SYEDHABIBULLAH-AZAM",
    linkedinUrl: "https://www.linkedin.com/in/syed-habibullah-azam-887332294",
  }
];


export function DeveloperPage() {
  return (
    <div className="container max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-center text-foreground sm:text-4xl mb-12">
        Meet the Team Delta Developers
      </h1>
      <div className="grid grid-cols-1 gap-8">
        {developers.map((dev) => (
          <Card key={dev.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-border/30 overflow-hidden">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:space-x-6">
              {/* Avatar Section */}
              <Avatar className="h-24 w-24 mb-4 sm:mb-0 flex-shrink-0 ring-2 ring-primary/20 p-1">
                {/* Use imageUrl directly if it exists */}
                {dev.imageUrl ? (
                  <AvatarImage
                    src={dev.imageUrl} // Use the direct URL from data
                    alt={`Profile picture of ${dev.name}`}
                    className="rounded-full object-cover" // Added object-cover
                  />
                ) : null}
                {/* Fallback remains the same */}
                <AvatarFallback className="text-3xl bg-primary/10 text-primary font-semibold">
                  {dev.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              {/* Details Section */}
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-xl font-semibold text-foreground">{dev.name}</h2>
                <p className="text-md text-muted-foreground mb-3">{dev.role}</p>

                {/* Links Section (remains the same, uses githubUsername and linkedinUrl if available) */}
                <div className="flex items-center justify-center sm:justify-start space-x-4 mt-2">
                  {dev.githubUsername && (
                    <a
                      href={`https://github.com/${dev.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out group"
                      aria-label={`${dev.name}'s Github Profile`}
                      title="GitHub Profile"
                    >
                      <Github className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {dev.linkedinUrl && dev.linkedinUrl !== '#' && (
                    <a
                      href={dev.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out group"
                      aria-label={`${dev.name}'s LinkedIn Profile`}
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}