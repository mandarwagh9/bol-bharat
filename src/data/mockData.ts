
import { Issue, IssueCategory, IssuePriority, IssueStatus } from "@/types";

// Mock data for development
export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic slowdowns and vehicle damage",
    category: "roads",
    status: "reported",
    priority: "high",
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: "123 Main St, Los Angeles, CA"
    },
    reportedBy: "user1",
    reportedAt: new Date("2023-04-01"),
    images: ["/placeholder.svg"],
    duration: "3 weeks",
    upvotes: 24,
    comments: []
  },
  {
    id: "2",
    title: "Broken Street Light",
    description: "Street light not working, creating safety concerns at night",
    category: "electricity",
    status: "in-progress",
    priority: "medium",
    location: {
      lat: 34.0548,
      lng: -118.2500,
      address: "456 Oak Ave, Los Angeles, CA"
    },
    reportedBy: "user2",
    reportedAt: new Date("2023-04-03"),
    images: ["/placeholder.svg"],
    duration: "1 week",
    upvotes: 8,
    comments: []
  },
  {
    id: "3",
    title: "Overflowing Trash Bin",
    description: "Public trash bin hasn't been emptied in days, causing litter and odor",
    category: "sanitation",
    status: "resolved",
    priority: "low",
    location: {
      lat: 34.0530,
      lng: -118.2430,
      address: "789 Park Blvd, Los Angeles, CA"
    },
    reportedBy: "user3",
    reportedAt: new Date("2023-04-05"),
    images: ["/placeholder.svg"],
    duration: "4 days",
    upvotes: 15,
    comments: []
  },
  {
    id: "4",
    title: "Water Main Break",
    description: "Water flooding the street and affecting local businesses",
    category: "water",
    status: "in-progress",
    priority: "urgent",
    location: {
      lat: 34.0535,
      lng: -118.2410,
      address: "321 River St, Los Angeles, CA"
    },
    reportedBy: "user4",
    reportedAt: new Date("2023-04-06"),
    images: ["/placeholder.svg"],
    duration: "12 hours",
    upvotes: 42,
    comments: []
  },
  {
    id: "5",
    title: "Damaged Park Bench",
    description: "Bench in central park has broken slats, posing safety risk",
    category: "public-spaces",
    status: "reported",
    priority: "low",
    location: {
      lat: 34.0540,
      lng: -118.2450,
      address: "Central Park, Los Angeles, CA"
    },
    reportedBy: "user5",
    reportedAt: new Date("2023-04-07"),
    images: ["/placeholder.svg"],
    duration: "2 months",
    upvotes: 5,
    comments: []
  }
];

export const categoryOptions: { value: IssueCategory; label: string }[] = [
  { value: "roads", label: "Roads & Sidewalks" },
  { value: "water", label: "Water Services" },
  { value: "electricity", label: "Electricity & Lighting" },
  { value: "sanitation", label: "Sanitation & Waste" },
  { value: "public-spaces", label: "Public Spaces" },
  { value: "transportation", label: "Public Transportation" },
  { value: "other", label: "Other" }
];

export const statusOptions: { value: IssueStatus; label: string; color: string }[] = [
  { value: "reported", label: "Reported", color: "bg-yellow-500" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-500" },
  { value: "resolved", label: "Resolved", color: "bg-green-500" },
  { value: "closed", label: "Closed", color: "bg-gray-500" }
];

export const priorityOptions: { value: IssuePriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-blue-300" },
  { value: "medium", label: "Medium", color: "bg-yellow-300" },
  { value: "high", label: "High", color: "bg-orange-400" },
  { value: "urgent", label: "Urgent", color: "bg-red-500" }
];

export const durationOptions: string[] = [
  "Less than 24 hours",
  "1-3 days",
  "4-7 days",
  "1-2 weeks",
  "2-4 weeks",
  "1-3 months",
  "3-6 months",
  "More than 6 months"
];
