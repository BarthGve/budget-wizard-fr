
import { NavigateFunction } from "react-router-dom";
import { processAuthAction as processUrlAuthAction } from "./urlAuthActionProcessor";
import { handlePostEmailVerification as handlePostVerification } from "./emailVerificationActions";

/**
 * Utilitaire pour traiter les actions d'authentification dans l'URL
 */
export const processAuthAction = processUrlAuthAction;

/**
 * Gère le processus post-vérification email
 */
export const handlePostEmailVerification = handlePostVerification;
