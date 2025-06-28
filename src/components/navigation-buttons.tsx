'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectButtonProps {
  projectId?: number;
  href: string;
  className?: string;
  children: React.ReactNode;
  loadingText?: string;
}

export function NavigationButton({ 
  projectId, 
  href, 
  className = '', 
  children, 
  loadingText 
}: ProjectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Start navigation immediately for instant feel
      router.push(href);
      
      // Keep loading state for a minimum time to show feedback
      // This gives users confidence that something is happening
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'loading opacity-75' : ''} transition-opacity duration-200`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <span className="loading loading-spinner loading-sm"></span>
          <span>{loadingText || 'Loading...'}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

interface OpenProjectButtonProps {
  projectId: number;
  projectName?: string;
  className?: string;
}

export function OpenProjectButton({ 
  projectId, 
  projectName = 'project', 
  className = 'btn btn-accent hover:btn-accent-focus' 
}: OpenProjectButtonProps) {
  return (
    <NavigationButton
      projectId={projectId}
      href={`/app/project/${projectId}`}
      className={className}
      loadingText="Opening..."
    >
      <div className="flex items-center gap-2">
        Open Project
      </div>
    </NavigationButton>
  );
}

interface StartNewProjectButtonProps {
  className?: string;
}

export function StartNewProjectButton({ 
  className = 'btn btn-secondary m-2 hover:btn-secondary-focus' 
}: StartNewProjectButtonProps) {
  return (
    <NavigationButton
      href="/app"
      className={className}
      loadingText="Starting..."
    >
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Start New Project
      </div>
    </NavigationButton>
  );
}
