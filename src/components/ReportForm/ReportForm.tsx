import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, MapPin, Clock, Upload, Trash2 } from "lucide-react";
import { categoryOptions, durationOptions } from "@/data/mockData";
import { IssueCategory } from "@/types";
import { getDatabase, ref, push } from "firebase/database";
import { db } from "@/lib/utils";

const reportIssue = async (issueDetails: any) => {
  const issuesRef = ref(db, "issues");
  return await push(issuesRef, issueDetails);
};

const ReportForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImage(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !location || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    const issueDetails = {
      title,
      description,
      category,
      location,
      duration,
      image,
      timestamp: new Date().toISOString(),
    };

    try {
      await reportIssue(issueDetails);
      toast({
        title: "Issue Reported!",
        description: "Your issue has been successfully reported.",
      });
      navigate("/issues");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report the issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">Issue Title</Label>
            <Input
              id="title"
              placeholder="E.g., Pothole on Main Street"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea
              id="description"
              placeholder="Please provide details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as IssueCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </div>
            </Label>
            <Input
              id="location"
              placeholder="E.g., 123 Main Street"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-base">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                How long has this issue been present?
              </div>
            </Label>
            <Select
              value={duration}
              onValueChange={setDuration}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image" className="text-base">
              <div className="flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                Upload Image
              </div>
            </Label>
            
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Issue preview" 
                  className="w-full h-48 object-cover rounded-md"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-48 bg-gray-50">
                <label 
                  htmlFor="image-upload" 
                  className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-4"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload an image</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-civic-teal hover:bg-civic-teal/90 text-white" 
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
