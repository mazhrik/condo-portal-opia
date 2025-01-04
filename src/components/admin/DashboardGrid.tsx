import { 
  Users, Building, Bell, BarChart, Calendar, CreditCard, Settings, FileText, 
  MessageSquare, Shield, Car, Wrench, ClipboardList, UserCog, Receipt, Briefcase,
  AlertTriangle, Key, Package, Thermometer, Droplets, Plug, Camera, HeartPulse
} from "lucide-react";
import DashboardCard from "./DashboardCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const DashboardGrid = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const showComingSoon = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature is coming soon!`,
    });
  };

  const cards = [
    {
      icon: Users,
      title: "Resident Management",
      stats: { value: 150, label: "Total Residents" },
      actions: { 
        primary: { label: "Manage Residents", onClick: () => showComingSoon("Resident Management") },
        secondary: { label: "View Directory", onClick: () => showComingSoon("Resident Directory") }
      }
    },
    {
      icon: Bell,
      title: "Announcements",
      stats: { value: 5, label: "Active Notices" },
      actions: { 
        primary: { label: "Post Updates", route: "/admin/announcements" },
        secondary: { label: "Message History", route: "/admin/communication" }
      }
    },
    {
      icon: Wrench,
      title: "Maintenance",
      stats: { value: 12, label: "Pending Requests" },
      actions: { 
        primary: { label: "View Requests", onClick: () => showComingSoon("Maintenance Requests") },
        secondary: { label: "Schedule Maintenance", onClick: () => showComingSoon("Maintenance Scheduling") }
      }
    },
    {
      icon: Calendar,
      title: "Amenity Bookings",
      stats: { value: 8, label: "Today's Bookings" },
      actions: { 
        primary: { label: "Manage Bookings", onClick: () => showComingSoon("Amenity Bookings") },
        secondary: { label: "Facility Status", onClick: () => showComingSoon("Facility Status") }
      }
    },
    {
      icon: CreditCard,
      title: "Financial Management",
      stats: { value: "$45,000", label: "Monthly Collections" },
      actions: { 
        primary: { label: "View Finances", onClick: () => showComingSoon("Financial Management") },
        secondary: { label: "Payment Records", onClick: () => showComingSoon("Payment Records") }
      }
    },
    {
      icon: Car,
      title: "Parking Management",
      stats: { value: "180/200", label: "Occupied Spots" },
      actions: { 
        primary: { label: "Manage Parking", onClick: () => showComingSoon("Parking Management") },
        secondary: { label: "Vehicle Registry", onClick: () => showComingSoon("Vehicle Registry") }
      }
    },
    {
      icon: FileText,
      title: "Documents",
      actions: { 
        primary: { label: "View Documents", route: "/admin/documents" },
        secondary: { label: "File Manager", route: "/admin/documents" }
      }
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      stats: { value: 15, label: "Unread Messages" },
      actions: { 
        primary: { label: "Messages", route: "/admin/communication" },
        secondary: { label: "Broadcast", route: "/admin/announcements" }
      }
    },
    {
      icon: Settings,
      title: "Settings",
      actions: { 
        primary: { label: "System Settings", route: "/admin/settings" },
        secondary: { label: "User Permissions", route: "/admin/settings" }
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <DashboardCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DashboardGrid;