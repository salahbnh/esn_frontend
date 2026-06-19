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
    subtitle: "Vue d'ensemble de votre activité",
    myOccupancy: "Mon occupation",
    myMissions: "Mes missions en cours",
    noConsultantProfile: "Aucune fiche consultant",
    noConsultantProfileHint:
      "Aucune fiche consultant n'est associée à votre compte. Contactez les ressources humaines.",
    project: "Projet",
    client: "Client",
    allocation: "Allocation",
    period: "Période",
  },
  reports: {
    title: "Rapports",
    subtitle: "Indicateurs détaillés de l'activité",
    occupancy: "Occupation",
    missions: "Missions",
    pipeline: "Pipeline",
    hr: "RH",
    occupancyTitle: "Taux d'occupation",
    occupancySubtitle: "Allocation moyenne et répartition des consultants",
    missionsTitle: "Missions",
    missionsSubtitle: "Répartition et indicateurs des missions",
    pipelineTitle: "Pipeline recrutement",
    pipelineSubtitle: "Entonnoir de conversion des candidatures",
    hrTitle: "Ressources humaines",
    hrSubtitle: "Effectif, intercontrat et contrats",
    // KPI labels
    globalAllocation: "Taux d'occupation moyen",
    totalConsultants: "Consultants",
    available: "Disponibles",
    onMission: "En mission",
    intercontrat: "Intercontrat",
    distribution: "Répartition de l'allocation",
    full: "Plein",
    partial: "Partiel",
    unassigned: "Non affecté",
    activeMissions: "Missions actives",
    forecastMissions: "Missions prévisionnelles",
    avgDuration: "Durée moyenne (jours)",
    totalMissions: "Total des missions",
    missionsByStatus: "Missions par statut",
    funnel: "Entonnoir de recrutement",
    totalCandidates: "Candidatures",
    headcount: "Effectif",
    headcountByStatus: "Effectif par statut",
    intercontratCount: "Consultants en intercontrat",
    contractsByStatus: "Contrats par statut",
    candidates: "Candidats",
    consultants: "Consultants",
  },
  reportStatus: {
    pipeline: {
      APPLIED: "Candidature",
      INTERVIEW: "Entretien",
      VALIDATED: "Validé",
      REJECTED: "Refusé",
      HIRED: "Recruté",
    },
    missions: {
      DRAFT: "Brouillon",
      STAFFED: "Affectée",
      IN_PROGRESS: "En cours",
      CLOSED: "Clôturée",
      ARCHIVED: "Archivée",
    },
    contracts: {
      DRAFT: "Brouillon",
      INTERNAL_VALIDATION: "Validation interne",
      PENDING_SIGNATURE: "En attente de signature",
      SIGNED: "Signé",
      ARCHIVED: "Archivé",
    },
    consultant: {
      ON_MISSION: "En mission",
      INTERCONTRAT: "Intercontrat",
      AVAILABLE: "Disponible",
    },
  },
  asyncStates: {
    loading: "Chargement…",
    empty: "Aucune donnée",
    emptyHint: "Aucune donnée à afficher pour le moment.",
    error: "Impossible de charger les données",
    errorHint: "Une erreur est survenue. Veuillez réessayer.",
    retry: "Réessayer",
  },
  dateRange: {
    from: "Du",
    to: "Au",
    apply: "Appliquer",
    label: "Période",
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
