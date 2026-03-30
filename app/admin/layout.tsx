import AdminSidebar from '@/src/features/admin/components/AdminSidebar/AdminSidebar';
import styles from './layout.module.css';

export const metadata = { title: 'Digitalpresso Admin' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.body}>
      <div className={styles.shell}>
        <AdminSidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
