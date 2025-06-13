
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, LogOut } from 'lucide-react';

const UserProfile = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-medical-blue/10 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-medical-blue" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default UserProfile;
