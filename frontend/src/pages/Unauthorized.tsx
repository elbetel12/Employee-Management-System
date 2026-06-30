import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
      <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight mb-2">Access Denied</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        You do not have the required permissions to view this section. If you believe this is an error, please contact your administrator.
      </p>
      <Link to="/">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
};
export default Unauthorized;
