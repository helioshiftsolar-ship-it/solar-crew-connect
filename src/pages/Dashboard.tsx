import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  FileText,
  Phone,
  MessageCircle
} from "lucide-react";

const projects = [
  {
    id: "PRJ-001",
    title: "Solar Farm I&C - Phoenix",
    type: "I&C Team",
    status: "In Progress",
    progress: 65,
    team: "Arizona Solar Services",
    location: "Phoenix, AZ",
    startDate: "2024-01-15",
    estimatedCompletion: "2024-02-28",
    budget: "$45,000",
    lastUpdate: "2 hours ago"
  },
  {
    id: "PRJ-002", 
    title: "Commercial Rooftop Design",
    type: "Solar Design",
    status: "Review",
    progress: 90,
    team: "SunTech Designs",
    location: "Los Angeles, CA",
    startDate: "2024-01-20",
    estimatedCompletion: "2024-02-15",
    budget: "$12,500",
    lastUpdate: "1 day ago"
  },
  {
    id: "PRJ-003",
    title: "Testing Equipment Rental",
    type: "Tools",
    status: "Completed",
    progress: 100,
    team: "PowerTest Solutions", 
    location: "San Diego, CA",
    startDate: "2024-01-10",
    estimatedCompletion: "2024-02-10",
    budget: "$8,200",
    lastUpdate: "3 days ago"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress": return "bg-primary/10 text-primary border-primary/20";
    case "Review": return "bg-accent/10 text-accent border-accent/20";
    case "Completed": return "bg-green-500/10 text-green-600 border-green-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "In Progress": return <Clock className="w-3 h-3" />;
    case "Review": return <AlertCircle className="w-3 h-3" />;
    case "Completed": return <CheckCircle className="w-3 h-3" />;
    default: return null;
  }
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your ongoing I&C teams, tools, and design services</p>
          </div>
          <Button className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            View Analytics
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">8</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">3</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-solar rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">$127K</div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Projects */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Active Projects</h2>
          
          {projects.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-elevated transition-shadow duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Project Info */}
                <div className="lg:col-span-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{project.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {project.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">ID: {project.id}</p>
                    </div>
                    <Badge className={`flex items-center gap-1 ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {project.team}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {project.startDate} - {project.estimatedCompletion}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="lg:col-span-3">
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                  </div>
                  <Progress value={project.progress} className="h-2 mb-4" />
                  
                  <div className="text-sm">
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-semibold text-foreground">{project.budget}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div className="text-xs text-muted-foreground mb-4">
                    Last update: {project.lastUpdate}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      Message Team
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/find-services">
              <Button className="justify-start h-auto p-4 flex-col items-start w-full">
                <div className="font-medium">Find New I&C Team</div>
                <div className="text-sm opacity-90 mt-1">Browse available teams in your area</div>
              </Button>
            </Link>
            <Link to="/find-services">
              <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start w-full">
                <div className="font-medium">Request Quote</div>
                <div className="text-sm opacity-90 mt-1">Get quotes for upcoming projects</div>
              </Button>
            </Link>
            <Link to="/find-services">
              <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start w-full">
                <div className="font-medium">Rent Equipment</div>
                <div className="text-sm opacity-90 mt-1">Find testing tools and equipment</div>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}