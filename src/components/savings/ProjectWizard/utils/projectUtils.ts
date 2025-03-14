
import { SavingsMode, SavingsProject } from "@/types/savings-project";
import { supabase } from "@/integrations/supabase/client";

export const createProject = async (projectData: Partial<SavingsProject>, savingsMode: SavingsMode) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (!projectData.nom_projet) {
      throw new Error('Le nom du projet est obligatoire');
    }

    const statut: "actif" | "en_attente" | "dépassé" = projectData.added_to_recurring ? "actif" : "en_attente";

    const supabaseProject = {
      id: projectData.id,
      profile_id: user.id,
      nom_projet: projectData.nom_projet,
      mode_planification: savingsMode,
      montant_total: projectData.montant_total || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: projectData.description || '',
      image_url: projectData.image_url || '/placeholder.svg',
      montant_mensuel: projectData.montant_mensuel,
      date_estimee: projectData.date_estimee,
      nombre_mois: projectData.nombre_mois,
      added_to_recurring: projectData.added_to_recurring || false,
      statut: statut
    };

    const { data, error: projectError } = await supabase
      .from('projets_epargne')
      .insert(supabaseProject)
      .select()
      .single();

    if (projectError) throw projectError;
    
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const createMonthlySaving = async (projectData: Partial<SavingsProject>, profileId: string, projectId: string) => {
  try {
    const { error } = await supabase.from("monthly_savings").insert({
      name: projectData.nom_projet,
      amount: projectData.montant_mensuel || 0,
      description: projectData.description,
      profile_id: profileId,
      projet_id: projectId,
      is_project_saving: true,
      logo_url: projectData.image_url || '/placeholder.svg'
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating monthly saving:', error);
    throw error;
  }
};

export const deleteProjectAndSavings = async (projectId: string) => {
  try {
    const { error: projectError } = await supabase
      .from('projets_epargne')
      .delete()
      .eq('id', projectId);

    if (projectError) throw projectError;
    
    return true;
  } catch (error) {
    console.error('Error deleting project and associated savings:', error);
    throw error;
  }
};

export const deleteSavingAndProject = async (savingId: string, isProjectSaving: boolean, projectId?: string) => {
  try {
    const { error: savingError } = await supabase
      .from('monthly_savings')
      .delete()
      .eq('id', savingId);

    if (savingError) throw savingError;

    if (isProjectSaving && projectId) {
      const { error: projectError } = await supabase
        .from('projets_epargne')
        .delete()
        .eq('id', projectId);
        
      if (projectError) throw projectError;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting saving and associated project:', error);
    throw error;
  }
};
