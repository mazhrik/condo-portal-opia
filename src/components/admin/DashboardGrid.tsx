import { Users, Building, Bell, BarChart, Calendar, CreditCard, Settings, FileText, MessageSquare, Shield, Car } from "lucide-react";
import DashboardCard from "./DashboardCard";

const DashboardGrid = () => {
  const cards = [
    {
      icon: Users,
      title: "Residents",
      stats: { value: 150, label: "Total Residents" },
      actions: { primary: "Manage Residents", secondary: "View Directory" }
    },
    {
      icon: Building,
      title: "Maintenance",
      stats: { value: 12, label: "Pending Requests" },
      actions: { primary: "View Requests", secondary: "Maintenance Schedule" }
    },
    {
      icon: Bell,
      title: "Announcements",
      actions: { primary: "Create Announcement", secondary: "View History" }
    },
    {
      icon: Building,
      title: "Units",
      stats: { value: 200, label: "Total Units" },
      actions: { primary: "Manage Units", secondary: "Occupancy Report" }
    },
    {
      icon: Calendar,
      title: "Amenities",
      stats: { value: 8, label: "Active Bookings Today" },
      actions: { primary: "Manage Bookings", secondary: "Facility Status" }
    },
    {
      icon: CreditCard,
      title: "Payments",
      stats: { value: "$45,000", label: "Monthly Collections" },
      actions: { primary: "Payment Records", secondary: "Outstanding Dues" }
    },
    {
      icon: Car,
      title: "Parking",
      stats: { value: "180/200", label: "Occupied Spots" },
      actions: { primary: "Manage Parking" }
    },
    {
      icon: Shield,
      title: "Security",
      actions: { primary: "Access Logs", secondary: "Security Reports" }
    },
    {
      icon: BarChart,
      title: "Reports",
      actions: { primary: "Financial Reports", secondary: "Usage Analytics" }
    },
    {
      icon: FileText,
      title: "Documents",
      actions: { primary: "Building Policies", secondary: "Legal Documents" }
    },
    {
      icon: MessageSquare,
      title: "Communications",
      actions: { primary: "Message Center", secondary: "Email Templates" }
    },
    {
      icon: Settings,
      title: "Settings",
      actions: { primary: "System Settings", secondary: "User Permissions" }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <DashboardCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DashboardGrid;