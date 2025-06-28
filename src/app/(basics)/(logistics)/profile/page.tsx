import Divider from "@/components/common/divider";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import Link from "next/link";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingState, CardSkeleton } from "@/components/common/loading-states";
import { Suspense } from "react";
import { OpenProjectButton, StartNewProjectButton } from "@/components/navigation-buttons";

// Profile content component with error handling
async function ProfileContent() {
    const client = createSupabaseServerComponentClient();
    
    try {
        const {
            data: { user },
            error,
        } = await client.auth.getUser();

        if (error) {
            throw new Error(`Authentication error: ${error.message}`);
        }

        if (!user) {
            return (
                <div className="text-center p-8">
                    <h2 className="text-2xl mb-4">Not authenticated</h2>
                    <p>Please log in to view your profile.</p>
                </div>
            );
        }

        const { data: projects, error: projectsError } = await client
            .from('projects')
            .select('*')
            .eq('user_id', user.id);

        if (projectsError) {
            throw new Error(`Failed to load projects: ${projectsError.message}`);
        }

        return (
            <ProfileDisplay user={user} projects={projects || []} />
        );
    } catch (error) {
        console.error('Profile page error:', error);
        throw error;
    }
}

// Profile display component
function ProfileDisplay({ user, projects }: { user: any; projects: any[] }): JSX.Element {
    return (
        <>
            <h1 className="text-4xl">
                Profile
            </h1>
            <h1 className="text-xl break-words">
                {user?.user_metadata?.name || user?.email} &bull; {user?.user_metadata?.email || user?.email}
            </h1>
            <Divider />
            
            {projects.length > 0 ? (
                <div className="mb-4">
                    <h2 className="text-2xl mb-3">Your Projects ({projects.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project, idx) => (
                            <div key={project.id || idx} className="card border text-primary-content">
                                <div className="card-body">
                                    <h2 className="card-title">{project.name || 'Untitled Project'}</h2>
                                    <p className="text-sm opacity-70">
                                        Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown'}
                                    </p>
                                    <div className="card-actions justify-end">
                                        <OpenProjectButton 
                                            projectId={project.id}
                                            projectName={project.name}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 bg-base-200 rounded-lg mb-4">
                    <h2 className="text-xl mb-2">No projects yet</h2>
                    <p className="mb-4">Create your first project to get started!</p>
                </div>
            )}
            
            <StartNewProjectButton />
            <Divider />
            <div className="prose m-8">
                <h3 className="mb-0">Quick Links</h3>
                <div>
                    &bull; <Link href={"/docs"}>Documentation + Blog</Link>
                </div>
                <h3 className="mb-0">Prompt Hippo Support</h3>
                <div>
                    &bull; <Link href={"mailto:york.jon.2005@gmail.com"}>york.jon.2005@gmail.com</Link>
                </div>
                <div>
                    &bull; Twitter/X: <Link href={"https://twitter.com/jonyorked"}>@jonyorked</Link>
                </div>
            </div>
        </>
    );
}

// Error fallback component
function ProfileError({ error, reset }: { error: Error; reset?: () => void }) {
    return (
        <div className="text-center p-8">
            <div className="alert alert-error max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h3 className="font-bold">Failed to load profile</h3>
                    <div className="text-xs">{error.message}</div>
                </div>
            </div>
            {reset && (
                <button 
                    onClick={reset} 
                    className="btn btn-outline mt-4"
                >
                    Try again
                </button>
            )}
            <div className="mt-4">
                <Link href="/" className="btn btn-primary">
                    Go Home
                </Link>
            </div>
        </div>
    );
}

// Main profile page with error boundary and loading states
export default function ProfilePage() {
    return (
        <ErrorBoundary>
            <Suspense fallback={
                <div>
                    <LoadingState message="Loading your profile..." />
                    <CardSkeleton count={3} className="mt-8" />
                </div>
            }>
                <ProfileContent />
            </Suspense>
        </ErrorBoundary>
    );
}