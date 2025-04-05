
import { useParams, Link } from "react-router-dom";
import { mockIssues, statusOptions, priorityOptions, categoryOptions } from "@/data/mockData";
import PageLayout from "@/components/Layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin, Clock, ThumbsUp, ArrowLeft, Calendar } from "lucide-react";

const IssueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const issue = mockIssues.find(issue => issue.id === id);
  
  if (!issue) {
    return (
      <PageLayout>
        <div className="civic-container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Issue Not Found</h1>
          <p className="text-gray-600 mb-8">The issue you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/issues">Back to Issues</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  const statusOption = statusOptions.find(s => s.value === issue.status);
  const priorityOption = priorityOptions.find(p => p.value === issue.priority);
  const categoryOption = categoryOptions.find(c => c.value === issue.category);
  
  return (
    <PageLayout>
      <div className="civic-container py-8">
        <Link to="/issues" className="inline-flex items-center text-civic-blue hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all issues
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{issue.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {statusOption && (
                <Badge className={`${statusOption.color} text-white`}>
                  {statusOption.label}
                </Badge>
              )}
              {priorityOption && (
                <Badge variant="outline" className={`${priorityOption.color} bg-opacity-20 text-gray-700`}>
                  {priorityOption.label} Priority
                </Badge>
              )}
              {categoryOption && (
                <Badge variant="outline" className="bg-gray-50">
                  {categoryOption.label}
                </Badge>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {issue.images && issue.images.length > 0 ? (
                <img 
                  src={issue.images[0]} 
                  alt={issue.title} 
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-80 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
              </CardContent>
            </Card>
            
            {/* We could add comments section here in the future */}
          </div>
          
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Issue Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <div className="flex items-start mt-1">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-gray-900">{issue.location.address}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reported On</h3>
                    <div className="flex items-start mt-1">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-gray-900">
                        {format(new Date(issue.reportedAt), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issue Duration</h3>
                    <div className="flex items-start mt-1">
                      <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-gray-900">{issue.duration}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Community Support</h3>
                    <div className="flex items-start mt-1">
                      <ThumbsUp className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-gray-900">{issue.upvotes} upvotes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <Button className="flex-1 bg-civic-blue hover:bg-civic-blue/90">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Support
              </Button>
              <Button variant="outline" className="flex-1">
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default IssueDetail;
