
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ChangelogPage } from "@/components/changelog/ChangelogPage";

const Changelog = () => {
  return (
    <ProtectedRoute requireAdmin>
      <ChangelogPage />
    </ProtectedRoute>
  );
};

export default Changelog;
