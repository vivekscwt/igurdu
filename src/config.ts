export enum CONFIG_OPTIONS {

}

export enum STATUSES {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  NOT_VERIFIED = 'not verified',
  UNVERIFIED = 'unverified',
  UNDER_REVIEW = 'under review',
  VERIFIED = 'verified',
  BLACKLISTED = 'blacklisted',
  DISABLED = 'disabled',
  SUSPENDED = 'suspended',
  OPEN = 'open',
  FILLED = 'filled',
  RECOMMENDED = 'recommended'
}

export enum NOTE_STATUS {
  DRAFT = 'draft',
  DONE = 'done',
  AUTO_SAVE = 'auto save'
}

export enum USER_ROLES {
  ADMIN = 'admin',
  GUARD = 'guard',
  CLIENT = 'client',
}

export enum APPLICATION_STATUS {
  REQUESTED = 'requested',
  APPLIED = 'applied',
  SHORTLISTED = 'shortlisted',
  HIRE_REQUEST = 'hire_request',
  HIRE_CONFIRMED = 'hire_confirmed',
  HIRE = 'hired',
  DECLINED = 'declined',
  LOST = 'lost',
  UNDO = 'undo',
  UNDO_REFUSAL = 'undo_refusal'
}
