import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FranchiseTable } from "@/components/franchise/FranchiseTable";
import { FranchiseForm } from "@/components/franchise/FranchiseForm";
import { useFranchises } from "@/hooks/useFranchises";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Franchise } from "@/types/franchise";

const DaftarFranchise = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { franchises, loading, addFranchise, updateFranchise, deleteFranchise } = useFranchises();

  const [showForm, setShowForm] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Akses Ditolak",
        description: "Halaman ini hanya dapat diakses oleh admin",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate, toast]);

  // Cleanup state on unmount
  useEffect(() => {
    return () => {
      setShowForm(false);
      setEditingFranchise(null);
    };
  }, []);

  const handleAddFranchise = () => {
    setEditingFranchise(null);
    setShowForm(true);
  };

  const handleEditFranchise = (franchise: Franchise) => {
    setEditingFranchise(franchise);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFranchise(null);
  };

  const handleSubmit = async (franchiseData: Omit<Franchise, "id" | "createdAt">) => {
    try {
      if (editingFranchise) {
        await updateFranchise(editingFranchise.id, franchiseData);
        toast({
          title: "Berhasil",
          description: "Franchise berhasil diperbarui",
        });
      } else {
        await addFranchise(franchiseData);
        toast({
          title: "Berhasil",
          description: "Franchise berhasil ditambahkan",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFranchise = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus franchise ini?")) {
      try {
        await deleteFranchise(id);
        toast({
          title: "Berhasil",
          description: "Franchise berhasil dihapus",
        });
      } catch {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat menghapus data",
          variant: "destructive",
        });
      }
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container px-3 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Daftar Franchise</h1>
            <p className="text-sm text-muted-foreground">Kelola data franchise</p>
          </div>
          <Button onClick={handleAddFranchise}>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tambah Franchise</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Franchise</CardTitle>
          </CardHeader>
          <CardContent>
            <FranchiseTable
              franchises={franchises}
              onEdit={handleEditFranchise}
              onDelete={handleDeleteFranchise}
            />
          </CardContent>
        </Card>

        <FranchiseForm
          open={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          editingFranchise={editingFranchise}
        />
      </div>
    </DashboardLayout>
  );
};

export default DaftarFranchise;
