
import { ChangelogPage } from "@/components/changelog/ChangelogPage";

const PublicChangelog = () => {
  return <ChangelogPage isAdmin={false} isPublic={true} />;
};

export default PublicChangelog;
