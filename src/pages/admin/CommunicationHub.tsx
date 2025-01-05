import Header from "@/components/admin/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Users } from "lucide-react";
import { useState } from "react";

const CommunicationHub = () => {
  const { toast } = useToast();
  const [messageType, setMessageType] = useState("direct");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    toast({
      title: "Message Sent",
      description: messageType === "broadcast" 
        ? "Broadcast message sent to all residents"
        : "Message sent successfully",
    });
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 p-8">
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1554995207-c18c203602cb"
          alt="Modern interior"
          className="w-full h-full object-cover opacity-[0.03]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-background/50" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        <Header />
        <div className="grid gap-6">
          <div className="p-6 rounded-lg glass border border-primary/10">
            <h2 className="text-2xl font-light mb-6">Communication Hub</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-card/30 backdrop-blur-md border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-medium">Message Center</h3>
                </div>
                <div className="space-y-4">
                  <Select onValueChange={setMessageType} defaultValue="direct">
                    <SelectTrigger className="bg-background/50 border-primary/10">
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct Message</SelectItem>
                      <SelectItem value="broadcast">Broadcast</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {messageType === "direct" && (
                    <Input
                      placeholder="Recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="bg-background/50 border-primary/10"
                    />
                  )}
                  
                  <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] bg-background/50 border-primary/10"
                  />
                  
                  <Button 
                    className="w-full bg-primary/90 hover:bg-primary transition-colors duration-300"
                    onClick={handleSendMessage}
                    disabled={!message || (messageType === "direct" && !recipient)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {messageType === "broadcast" ? "Send Broadcast" : "Send Message"}
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-card/30 backdrop-blur-md border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-medium">Recent Communications</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-background/50 rounded-lg border border-primary/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Maintenance Update</p>
                        <p className="text-sm text-muted-foreground">Sent to all residents</p>
                      </div>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;