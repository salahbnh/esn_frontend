/**
 * French UI dictionary. All visible text lives here (code stays English).
 * Use the exported `fr` object directly (`fr.nav.dashboard`) or the `t()`
 * dot-path helper. Backend enum values map to French labels under `status`.
 */

export const fr = {
  app: {
    name: "ESN",
    fullName: "ESN — Gestion des ressources",
    tagline: "Pilotage du cycle de vie des consultants",
  },
  nav: {
    dashboard: "Tableau de bord",
    candidates: "Candidats",
    consultants: "Consultants",
    clients: "Clients",
    missions: "Missions",
    staffing: "Affectations",
    contracts: "Contrats",
    contractTemplates: "Modèles de contrat",
    documents: "Documents",
    reports: "Rapports",
    myProfile: "Mon profil",
    myMissions: "Mes missions",
    myDocuments: "Mes documents",
    myContract: "Mon contrat",
    sectionMain: "Général",
    sectionManage: "Gestion",
    sectionMe: "Mon espace",
  },
  actions: {
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    create: "Créer",
    search: "Rechercher",
    confirm: "Confirmer",
    close: "Fermer",
    back: "Retour",
    next: "Suivant",
    loading: "Chargement…",
  },
  auth: {
    signIn: "Se connecter",
    signInWithKeycloak: "Se connecter avec Keycloak",
    signOut: "Se déconnecter",
    loginTitle: "Connectez-vous",
    loginSubtitle: "Accédez à votre espace de gestion des ressources",
    sessionExpired: "Votre session a expiré. Veuillez vous reconnecter.",
  },
  roles: {
    RH: "Ressources humaines",
    MANAGER: "Manager",
    DIRECTION: "Direction",
    CONSULTANT: "Consultant",
  },
  theme: {
    toggle: "Changer de thème",
    light: "Thème clair",
    dark: "Thème sombre",
  },
  common: {
    loading: "Chargement…",
    empty: "Aucun élément",
    error: "Une erreur est survenue",
    retry: "Réessayer",
    welcome: "Bienvenue",
  },
  dashboard: {
    title: "Tableau de bord",
    greeting: "Bonjour",
    placeholder:
      "Vos indicateurs apparaîtront ici. Cette page de base confirme que la session et l'interface sont opérationnelles.",
    yourRole: "Votre rôle",
    comingSoon: "Les indicateurs détaillés arrivent dans le prochain jalon.",
  },
  status: {
    candidate: {
      APPLICATION: "Candidature",
      INTERVIEW: "Entretien",
      VALIDATED: "Validé",
      REJECTED: "Refusé",
      CONVERTED: "Converti",
    },
    consultant: {
      INTERCONTRACT: "Intercontrat",
      ON_MISSION: "En mission",
      AVAILABLE: "Disponible",
    },
    mission: {
      DRAFT: "Brouillon",
      ASSIGNED: "Affectée",
      VALIDATED: "Validée",
      IN_PROGRESS: "En cours",
      CLOSED: "Clôturée",
      ARCHIVED: "Archivée",
    },
    assignment: {
      PROPOSED: "Proposée",
      ACTIVE: "Active",
      ENDED: "Terminée",
      CANCELLED: "Annulée",
    },
    contract: {
      DRAFT: "Brouillon",
      PENDING_RH: "En attente RH",
      PENDING_MANAGER: "En attente Manager",
      PENDING_DIRECTION: "En attente Direction",
      VALIDATED: "Validé",
      SENT: "Envoyé",
      SIGNED: "Signé",
      ARCHIVED: "Archivé",
    },
    document: {
      CV: "CV",
      CONTRACT: "Contrat",
      AMENDMENT: "Avenant",
      OTHER: "Autre",
    },
  },
} as const;

export type FrDictionary = typeof fr;

/**
 * Dot-path lookup, e.g. `t("nav.dashboard")` → "Tableau de bord".
 * Returns the path itself if not found (visible as a translation gap).
 */
export function t(path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      fr,
    );
  return typeof value === "string" ? value : path;
}
