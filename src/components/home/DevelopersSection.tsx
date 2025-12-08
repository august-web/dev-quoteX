import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, BarChart3, Settings } from "lucide-react";

export default function DevelopersSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            For Developers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Manage Requests and Track Progress
          </h2>
          <p className="text-lg text-muted-foreground">
            Log in to the developer portal to view client requests, manage payments, track progress, and tweak pricing rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Requests</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">View and update client requests and statuses.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">See popular features, drop-offs, and step views.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Pricing Rules</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Edit modular pricing rules and overrides.</CardContent>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Link to="/dev-login">
            <Button variant="accent" size="lg">Go to Developer Login</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
