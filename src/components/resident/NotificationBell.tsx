import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
    id: number;
    is_read: boolean;
    title: string;
    message: string;
    created_at: string;
}

export const NotificationBell = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const { data: notifications = [], isLoading } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: () => getNotifications({ unread: true }),
        refetchInterval: 30000, // Poll every 30s
    });

    const unreadCount = notifications.filter((n: Notification) => !n.is_read).length;

    const readMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const markAllMutation = useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const handleMarkAsRead = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        readMutation.mutate(id);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto px-2 py-1"
                            onClick={() => markAllMutation.mutate()}
                            disabled={markAllMutation.isPending}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                    ) : (
                        notifications.map((notification: Notification) => (
                            <DropdownMenuItem key={notification.id} className={cn("flex flex-col items-start gap-1 p-3 cursor-pointer", !notification.is_read && "bg-muted/50")}>
                                <div className="flex w-full justify-between items-start gap-2">
                                    <span className={cn("text-sm font-medium", !notification.is_read && "text-foreground")}>
                                        {notification.title}
                                    </span>
                                    {!notification.is_read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 hover:bg-transparent text-primary"
                                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                                            title="Mark as read"
                                        >
                                            <span className="sr-only">Mark as read</span>
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                </p>
                                <span className="text-[10px] text-muted-foreground mt-1">
                                    {new Date(notification.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
