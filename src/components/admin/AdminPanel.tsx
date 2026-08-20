import { Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

interface AdminPanelProps {
  onExit: () => void;
}

export default function AdminPanel({ onExit }: AdminPanelProps) {
  const { isAuthed, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-ink-500">
        <Loader2 size={26} className="animate-spin text-champagne-600 mb-4" />
        <p className="text-xs tracking-luxe uppercase font-light">Checking session…</p>
      </div>
    );
  }

  if (!isAuthed) {
    return <AdminLogin onBack={onExit} onSuccess={() => {}} />;
  }

  return <AdminDashboard onExit={onExit} />;
}
