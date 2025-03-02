
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ProjectAnnouncementCardProps {
  collapsed: boolean;
  userId?: string;
}

export const ProjectAnnouncementCard = ({ collapsed, userId }: ProjectAnnouncementCardProps) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  
  // Check if user has already created a project
  const { data: hasProjects } = useQuery({
    queryKey: ['has-projects', userId],
    queryFn: async () => {
      if (!userId) return true; // If no user ID, don't show card
      
      const { data, error } = await supabase
        .from('projets_epargne')
        .select('id')
        .eq('profile_id', userId)
        .limit(1);
      
      if (error) {
        console.error('Error checking projects:', error);
        return false;
      }
      
      return data && data.length > 0;
    },
    enabled: !!userId,
  });
  
  // If user has projects or card was dismissed, don't show it
  if (hasProjects || dismissed) {
    return null;
  }
  
  const handleCreateProject = () => {
    navigate('/savings');
    setDismissed(true);
  };
  
  if (collapsed) {
    return (
      <div className="px-3 mb-3">
        <Card 
  className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all cursor-pointer hover:shadow-lg"
  onClick={handleCreateProject}
>
  <CardContent className="p-3 flex flex-col items-center gap-2">
    <Rocket className="h-5 w-5 text-indigo-500" />
    <Button 
      size="icon" 
      variant="outline" 
      className="h-7 w-7 rounded-full bg-white hover:bg-indigo-100 border-indigo-200"
      onClick={handleCreateProject}
    >
      <Rocket className="h-3.5 w-3.5 text-indigo-500" />
    </Button>
  </CardContent>
</Card>
      </div>
    );
  }
  
  return (
    <div className="px-4 mb-3">
      <Card 
  className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all cursor-pointer hover:shadow-lg"
  onClick={handleCreateProject}
>
  <CardContent className="p-4">
    <div className="flex items-start gap-3">
      <Rocket className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
      <div className="space-y-2">
        <p className="text-xs text-gray-800">
          Nouveau: créer un projet d'épargne !
        </p>
        <Button 
          size="sm" 
          className="text-xs w-full bg-indigo-500 hover:bg-indigo-600"
          onClick={handleCreateProject}
        >
          🚀 Let's go!
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
    </div>
  );
};
