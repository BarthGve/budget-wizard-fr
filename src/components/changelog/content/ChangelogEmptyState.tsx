
export const ChangelogEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-muted-foreground mb-2 text-6xl">📝</div>
      <h3 className="text-xl font-semibold mb-2">Aucune entrée de changelog</h3>
      <p className="text-muted-foreground max-w-sm">
        Il n'y a pas encore d'entrées dans le changelog ou aucune ne correspond à vos critères de recherche.
      </p>
    </div>
  );
};
