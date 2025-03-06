
-- Fonction pour enregistrer les edge functions dans la base de données
SELECT register_edge_function('notify-changelog');

-- Fonction pour envoyer une notification lors de l'ajout d'une entrée au changelog
CREATE OR REPLACE FUNCTION public.trigger_changelog_notification()
RETURNS trigger AS $$
BEGIN
  -- Appel à une fonction externe pour envoyer l'email (sera gérée côté application)
  PERFORM pg_notify('changelog_notification', json_build_object(
    'id', NEW.id,
    'title', NEW.title,
    'action', TG_OP
  )::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger qui se déclenche lors de l'insertion d'une nouvelle entrée dans changelog_entries
DROP TRIGGER IF EXISTS notify_on_changelog_insert ON public.changelog_entries;
CREATE TRIGGER notify_on_changelog_insert
  AFTER INSERT ON public.changelog_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_changelog_notification();
