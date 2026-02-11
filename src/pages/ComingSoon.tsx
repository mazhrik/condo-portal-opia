import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-6">
            <div className="p-4 bg-muted/20 rounded-full">
                <Construction className="w-16 h-16 text-primary" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Coming Soon</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    This feature is currently under development. Check back soon for updates!
                </p>
            </div>
            <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
            </Button>
        </div>
    );
};

export default ComingSoon;
