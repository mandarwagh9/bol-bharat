import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { mockIssues, statusOptions, priorityOptions, categoryOptions } from "@/data/mockData";
import PageLayout from "@/components/Layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin, Clock, ThumbsUp, ArrowLeft, Calendar, Share2 } from "lucide-react";
import { Issue } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { onValue, ref } from "firebase/database"; // Import Firebase listener
import { db } from "@/lib/utils"; // Import Firebase database instance

const IssueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSupported, setHasSupported] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage to see if user has already supported this issue
    const supportedIssues = JSON.parse(localStorage.getItem('supportedIssues') || '[]');
    setHasSupported(supportedIssues.includes(id));
    
    const fetchIssue = async () => {
      setLoading(true);
      
      // First check if it's a mock issue
      const mockIssue = mockIssues.find(issue => issue.id === id);
      if (mockIssue) {
        setIssue(mockIssue);
        setLoading(false);
        return;
      }
      
      // If not found in mock data, try to fetch from Firebase
      try {
        const response = await fetch(`https://bolbharat-a24dc-default-rtdb.firebaseio.com/issues/${id}.json`);
        const data = await response.json();
        
        if (data) {
          // Convert Firebase format to our app format
          const formattedIssue: Issue = {
            id: id || '',
            title: data.title || '',
            description: data.description || '',
            category: data.category || 'other',
            status: data.status || 'reported',
            priority: data.priority || 'medium',
            location: {
              lat: 0,
              lng: 0,
              address: data.location || '',
              state: '',
              district: '',
              city: '',
              village: ''
            },
            reportedBy: 'user1',
            reportedAt: new Date(data.timestamp || Date.now()),
            images: data.image ? [data.image] : [],
            duration: data.duration || '',
            upvotes: data.upvotes || 0,
            comments: []
          };
          
          setIssue(formattedIssue);
        } else {
          setIssue(null);
        }
      } catch (error) {
        console.error('Error fetching issue:', error);
        setIssue(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIssue();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const upvotesRef = ref(db, `issues/${id}/upvotes`); // Use the imported db instance

    const unsubscribe = onValue(upvotesRef, (snapshot) => {
      const newUpvotes = snapshot.val();
      if (newUpvotes !== null) {
        setIssue((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            upvotes: newUpvotes,
          };
        });
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [id]);

  const handleSupport = async () => {
    if (!issue) return;
    
    if (hasSupported) {
      toast({
        title: "Already Supported",
        description: "You have already supported this issue.",
        duration: 3000,
      });
      return;
    }
    
    try {
      // For mock issues, just update the local state
      if (mockIssues.some(mockIssue => mockIssue.id === id)) {
        setIssue(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            upvotes: prev.upvotes + 1
          };
        });
      } else {
        // For Firebase issues, update the database
        const currentUpvotes = issue.upvotes || 0;
        const newUpvotes = currentUpvotes + 1;
        
        await fetch(`https://bolbharat-a24dc-default-rtdb.firebaseio.com/issues/${id}/upvotes.json`, {
          method: 'PUT',
          body: JSON.stringify(newUpvotes)
        });
        
        // Update local state
        setIssue(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            upvotes: newUpvotes
          };
        });
      }
      
      // Save to localStorage to prevent multiple supports
      const supportedIssues = JSON.parse(localStorage.getItem('supportedIssues') || '[]');
      supportedIssues.push(id);
      localStorage.setItem('supportedIssues', JSON.stringify(supportedIssues));
      setHasSupported(true);
      
      toast({
        title: "Thank You!",
        description: "Your support has been recorded.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error supporting issue:', error);
      toast({
        title: "Error",
        description: "Failed to support this issue. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleShare = async () => {
    if (!issue) return;
    
    const shareData = {
      title: `BolBharat - ${issue.title}`,
      text: `Check out this civic issue: ${issue.title} - ${issue.description}`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        // Use the Web Share API if available
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Thank you for spreading awareness!",
          duration: 3000,
        });
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link Copied to Clipboard",
          description: "You can now paste and share it anywhere.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "Failed to share this issue. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  if (loading) {
    return (
      <PageLayout>
        <div className="civic-container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </PageLayout>
    );
  }
  
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
              <Button 
                className={`flex-1 ${hasSupported ? 'bg-gray-400 hover:bg-gray-500' : 'bg-civic-blue hover:bg-civic-blue/90'}`}
                onClick={handleSupport}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {hasSupported ? 'Supported' : 'Support'}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
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
