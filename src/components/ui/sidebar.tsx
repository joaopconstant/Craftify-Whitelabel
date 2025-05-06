import { ReactNode } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  children: ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  return (
    <div className="w-64 h-100vh">
      <Card className="h-full flex flex-col p-4 rounded-none">
        <div className="space-y-4">{children}</div>
      </Card>
    </div>
  );
};

interface SidebarItemProps {
  children: ReactNode;
  onClick: () => void;
}

Sidebar.Item = function SidebarItem({ children, onClick }: SidebarItemProps) {
  return (
    <Button onClick={onClick} variant={"ghost"} className="w-full text-lg">
      {children}
    </Button>
  );
};
