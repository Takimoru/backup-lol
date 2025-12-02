import { useStudentData } from "./hooks/useStudentData";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { FileText, Image, FileArchive, Download, MoreVertical } from "lucide-react";
import { Badge } from "../../components/ui/badge";

export function FilesPage() {
  const { user, isLoading } = useStudentData();

  // Mock files data - replace with actual Convex query when available
  const mockFiles = [
    { id: 1, name: "Project Proposal.pdf", size: "2.4 MB", type: "document", project: "Mobile App Redesign", uploadedAt: "2025-11-25", uploadedBy: "John Doe" },
    { id: 2, name: "Design Mockups.fig", size: "15.8 MB", type: "design", project: "Mobile App Redesign", uploadedAt: "2025-11-28", uploadedBy: "Jane Smith" },
    { id: 3, name: "User Research.docx", size: "856 KB", type: "document", project: "Q4 Marketing Plan", uploadedAt: "2025-11-20", uploadedBy: "John Doe" },
    { id: 4, name: "Banner Images.zip", size: "45.2 MB", type: "archive", project: "Q4 Marketing Plan", uploadedAt: "2025-11-30", uploadedBy: "Jane Smith" },
    { id: 5, name: "Color Palette.png", size: "124 KB", type: "image", project: "Design System", uploadedAt: "2025-12-01", uploadedBy: "John Doe" },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5 text-purple-500" />;
      case "archive":
        return <FileArchive className="w-5 h-5 text-yellow-500" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getFileTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      document: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      image: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      design: "bg-pink-500/10 text-pink-500 border-pink-500/20",
      archive: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    };
    return variants[type] || variants.document;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar user={user} />

      <div className="ml-64 min-h-screen">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Files</h1>
            <p className="text-muted-foreground mt-1">Access and manage files from all projects</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Files", value: mockFiles.length, icon: FileText, color: "text-blue-500" },
              { label: "Documents", value: mockFiles.filter(f => f.type === "document").length, icon: FileText, color: "text-green-500" },
              { label: "Images", value: mockFiles.filter(f => f.type === "image").length, icon: Image, color: "text-purple-500" },
              { label: "Archives", value: mockFiles.filter(f => f.type === "archive").length, icon: FileArchive, color: "text-yellow-500" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Files Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Uploaded</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">by {file.uploadedBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className={getFileTypeBadge(file.type)}>
                          {file.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {file.project}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {file.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {file.uploadedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 hover:bg-accent rounded transition-colors">
                            <Download className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button className="p-1 hover:bg-accent rounded transition-colors">
                            <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
