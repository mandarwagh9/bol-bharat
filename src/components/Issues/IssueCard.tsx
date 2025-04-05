import { Link } from "react-router-dom";
import { Issue } from "@/types";
import { Badge } from "@/components/ui/badge";
import { statusOptions, priorityOptions, categoryOptions } from "@/data/mockData";
import { format } from "date-fns";
import { MapPin, Clock, ThumbsUp } from "lucide-react";
import React from 'react';

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const statusOption = statusOptions.find(s => s.value === issue.status);
  const priorityOption = priorityOptions.find(p => p.value === issue.priority);
  const categoryOption = categoryOptions.find(c => c.value === issue.category);

  return (
    <Link to={`/issues/${issue.id}`}>
      <div className="report-card">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          {issue.images && issue.images.length > 0 ? (
            <img 
              src={issue.images[0]} 
              alt={issue.title} 
              className="object-cover w-full h-48"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold line-clamp-1">{issue.title}</h3>
            {statusOption && (
              <Badge className={`${statusOption.color} text-white`}>
                {statusOption.label}
              </Badge>
            )}
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{issue.location.address}</span>
          </div>
          
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              Reported: {isNaN(new Date(issue.reportedAt).getTime()) ? "Invalid date" : format(new Date(issue.reportedAt), 'MMM d, yyyy')}
            </span>
          </div>

          <p className="mt-2 text-gray-600 line-clamp-2">{issue.description}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {categoryOption && (
              <Badge variant="outline" className="bg-gray-50">
                {categoryOption.label}
              </Badge>
            )}
            {priorityOption && (
              <Badge variant="outline" className={`${priorityOption.color} bg-opacity-20 text-gray-700`}>
                {priorityOption.label} Priority
              </Badge>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-gray-500">Duration: {issue.duration}</span>
            <div className="flex items-center text-gray-500">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{issue.upvotes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;
