import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">Manage your ongoing projects and tasks</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-9 bg-card border-border focus:ring-primary"
          />
        </div>
        
        <Button variant="outline" className="gap-2 hidden sm:flex">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Active
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>

        <Button variant="outline" size="icon">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
