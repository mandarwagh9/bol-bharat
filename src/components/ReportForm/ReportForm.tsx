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
import { getDatabase, ref, push, set } from "firebase/database";
import { db } from "@/lib/utils";

// Improved function to report an issue with better error handling
const reportIssue = async (issueDetails: any) => {
  if (!db) {
    throw new Error("Firebase database is not initialized");
  }
  
  try {
    const issuesRef = ref(db, "issues");
    const newIssueRef = push(issuesRef);
    await set(newIssueRef, issueDetails);
    return newIssueRef.key;
  } catch (error) {
    console.error("Error reporting issue:", error);
    throw error;
  }
};

const ReportForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageURL, setImageURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Error validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!category) newErrors.category = "Category is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!duration) newErrors.duration = "Expected resolution time is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle image addition from URL
  const handleAddImage = () => {
    if (!imageURL.trim()) return;
    
    // Validate image URL
    try {
      new URL(imageURL);
      if (!images.includes(imageURL)) {
        setImages([...images, imageURL]);
      }
      setImageURL("");
    } catch (error) {
      // Invalid URL
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
    }
  };
  
  // Handle image deletion
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare issue data
      const issueData = {
        title,
        description,
        category,
        location,
        duration,
        image: images.length > 0 ? images[0] : null, // For now, just use the first image
        timestamp: new Date().toISOString(),
        status: "reported",
        upvotes: 0,
      };
      
      const issueId = await reportIssue(issueData);
      
      toast({
        title: "Issue reported successfully!",
        description: "Thank you for reporting this issue to your community.",
      });
      
      // Redirect to the new issue page after a brief delay
      setTimeout(() => {
        navigate(`/issues/${issueId}`);
      }, 1500);
    } catch (error) {
      console.error("Error submitting issue:", error);
      
      toast({
        title: "Failed to report issue",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive",
      });
      
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base">
          Issue Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Brief title describing the issue"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Provide details about the issue..."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={errors.description ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-base">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as IssueCategory)}
          disabled={isSubmitting}
        >
          <SelectTrigger 
            id="category"
            className={errors.category ? "border-red-500" : ""}
          >
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
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category}</p>
        )}
      </div>
      
      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-base flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Location <span className="text-red-500">*</span>
        </Label>
        <Input
          id="location"
          placeholder="Enter the location (e.g., street, landmark)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={errors.location ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location}</p>
        )}
      </div>
      
      {/* Expected Resolution Time */}
      <div className="space-y-2">
        <Label htmlFor="duration" className="text-base flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Expected Resolution Time <span className="text-red-500">*</span>
        </Label>
        <Select
          value={duration}
          onValueChange={setDuration}
          disabled={isSubmitting}
        >
          <SelectTrigger 
            id="duration"
            className={errors.duration ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select expected resolution time" />
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.duration && (
          <p className="text-sm text-red-500">{errors.duration}</p>
        )}
      </div>
      
      {/* Images */}
      <div className="space-y-2">
        <Label className="text-base flex items-center gap-1">
          <Camera className="h-4 w-4" />
          Add Images
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter image URL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            disabled={isSubmitting}
          />
          <Button 
            type="button" 
            onClick={handleAddImage}
            disabled={!imageURL.trim() || isSubmitting}
          >
            <Upload className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        {/* Image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video relative group">
                  <img
                    src={image}
                    alt={`Issue image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, replace with placeholder
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </Button>
    </form>
  );
};

export default ReportForm;
