import { ReactNode } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface SidebarProps {
  children: ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  return (
    <div className="w-64 h-100vh">
      <Card className="h-full flex flex-col p-4 rounded-none">
        <h3 className="text-xl font-bold mb-6">Painel de Administração</h3>
        <div className="space-y-4">{children}</div>
      </Card>
    </div>
  );
};

interface SidebarItemProps {
  children: ReactNode;
  onClick: () => void;
}

Sidebar.Item = ({ children, onClick }: SidebarItemProps) => (
  <Button
    onClick={onClick}
    variant="default"  // Adicione o estilo desejado
    size="sm"  // Defina o tamanho, se necessário
    className="w-full text-lg hover:text-gray-300"
  >
    {children}
  </Button>
);
