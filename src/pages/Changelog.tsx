
// Renommé de Changelog.tsx à AdminChangelog.tsx
import { ChangelogPage } from "@/components/changelog/ChangelogPage";

const AdminChangelog = () => {
  return <ChangelogPage isAdmin={true} isPublic={false} />;
};

export default AdminChangelog;
