import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, BarChart3, Bell } from "lucide-react";

export default function QuickActions() {
  const handleQuickSession = () => {
    window.location.href = "/analysis";
  };

  const handleViewProgress = () => {
    window.location.href = "/progress";
  };

  const handleSetReminder = () => {
    // TODO: Implement reminder modal/dialog
    console.log("Set reminder clicked");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            className="w-full flex items-center justify-between p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            variant="ghost"
            onClick={handleQuickSession}
          >
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-3" />
              <span className="font-medium">Quick 5-min Session</span>
            </div>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
          
          <Button 
            className="w-full flex items-center justify-between p-3 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors"
            variant="ghost"
            onClick={handleViewProgress}
          >
            <div className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-3" />
              <span className="font-medium">View Full Progress</span>
            </div>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
          
          <Button 
            className="w-full flex items-center justify-between p-3 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
            variant="ghost"
            onClick={handleSetReminder}
          >
            <div className="flex items-center">
              <Bell className="w-4 h-4 mr-3" />
              <span className="font-medium">Set Reminder</span>
            </div>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
