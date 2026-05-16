// ============================================================
// AETHLA CARE — GLOBAL TYPE DEFINITIONS
// ============================================================

// ── Auth & Users ──────────────────────────────────────────

export type UserRole = 'admin' | 'coordinator' | 'caregiver' | 'family' | 'accountant'

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  isActive: boolean
  isVerified: boolean
  mfaEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
}

// ── Clients ───────────────────────────────────────────────

export type ClientStatus = 'active' | 'inactive' | 'pending' | 'discharged'
export type CareType = 'elderly' | 'disability' | 'newborn' | 'maternity' | 'wellness' | 'telehealth' | 'navigation'

export interface Client {
  _id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phone: string
  email?: string
  address: Address
  status: ClientStatus
  careType: CareType[]
  medicalConditions?: string[]
  allergies?: string[]
  medications?: Medication[]
  emergencyContacts: EmergencyContact[]
  carePlan?: CarePlan
  assignedCaregivers: string[]
  notes?: string
  consentSigned: boolean
  insuranceInfo?: InsuranceInfo
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  area: string
  city: string
  country: string
  coordinates?: { lat: number; lng: number }
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  notes?: string
}

export interface InsuranceInfo {
  provider: string
  policyNumber: string
  expiryDate: string
  coverageDetails?: string
}

// ── Care Plans ────────────────────────────────────────────

export interface CarePlan {
  _id: string
  clientId: string
  title: string
  goals: string[]
  tasks: CareTask[]
  frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed'
  startDate: string
  endDate?: string
  reviewDate: string
  status: 'active' | 'completed' | 'suspended'
  createdBy: string
  updatedAt: string
}

export interface CareTask {
  id: string
  title: string
  description: string
  frequency: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

// ── Caregivers ────────────────────────────────────────────

export type CaregiverStatus = 'active' | 'inactive' | 'on-leave' | 'training'

export interface Caregiver {
  _id: string
  userId: string
  user?: User
  licenseNumber: string
  licenseExpiry: string
  specializations: CareType[]
  languages: string[]
  genderPreference: 'any' | 'male' | 'female'
  experience: number
  rating: number
  totalReviews: number
  availability: Availability[]
  location: Address
  certifications: Certification[]
  backgroundCheckDate: string
  backgroundCheckStatus: 'clear' | 'pending' | 'flagged'
  status: CaregiverStatus
  bio?: string
  hourlyRate: number
  currentClients: string[]
  createdAt: string
}

export interface Availability {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface Certification {
  name: string
  issuingBody: string
  issueDate: string
  expiryDate: string
  documentUrl?: string
}

// ── Schedules ─────────────────────────────────────────────

export type ShiftStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'missed' | 'cancelled'

export interface Schedule {
  _id: string
  clientId: string
  client?: Client
  caregiverId: string
  caregiver?: Caregiver
  date: string
  startTime: string
  endTime: string
  status: ShiftStatus
  serviceType: CareType
  notes?: string
  checkInTime?: string
  checkOutTime?: string
  checkInLocation?: { lat: number; lng: number }
  checkOutLocation?: { lat: number; lng: number }
  careNoteId?: string
  createdAt: string
}

// ── Care Notes ────────────────────────────────────────────

export interface CareNote {
  _id: string
  scheduleId: string
  clientId: string
  caregiverId: string
  visitDate: string
  summary: string
  tasksCompleted: string[]
  observations: string
  mood: 'excellent' | 'good' | 'fair' | 'poor'
  vitalSigns?: VitalSigns
  medications: { name: string; given: boolean; notes?: string }[]
  incidents?: Incident[]
  photos?: string[]
  voiceNoteUrl?: string
  familyShared: boolean
  createdAt: string
}

export interface VitalSigns {
  temperature?: number
  bloodPressure?: string
  heartRate?: number
  oxygenSaturation?: number
  weight?: number
  bloodGlucose?: number
  notes?: string
}

// ── Incidents ─────────────────────────────────────────────

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface Incident {
  _id: string
  clientId: string
  caregiverId: string
  scheduleId?: string
  type: 'fall' | 'medication-error' | 'behavioral' | 'medical' | 'property' | 'other'
  severity: IncidentSeverity
  description: string
  actionTaken: string
  reportedTo?: string[]
  followUpRequired: boolean
  followUpNotes?: string
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  createdAt: string
  resolvedAt?: string
}

// ── Billing ───────────────────────────────────────────────

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface Invoice {
  _id: string
  invoiceNumber: string
  clientId: string
  client?: Client
  items: InvoiceItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  currency: 'QAR'
  status: InvoiceStatus
  dueDate: string
  paidAt?: string
  paymentMethod?: string
  notes?: string
  insuranceClaim?: InsuranceClaim
  createdAt: string
}

export interface InvoiceItem {
  description: string
  date: string
  hours: number
  rate: number
  amount: number
}

export interface InsuranceClaim {
  claimNumber: string
  provider: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'partial'
  submittedAt: string
  processedAt?: string
}

// ── Messages ──────────────────────────────────────────────

export interface Message {
  _id: string
  conversationId: string
  senderId: string
  sender?: User
  recipientIds: string[]
  type: 'text' | 'image' | 'document' | 'care-note' | 'alert'
  content: string
  attachments?: string[]
  isRead: boolean
  isEncrypted: boolean
  createdAt: string
}

export interface Conversation {
  _id: string
  participants: string[]
  type: 'direct' | 'group' | 'family-caregiver'
  clientId?: string
  lastMessage?: Message
  unreadCount: number
  createdAt: string
}

// ── Blog ──────────────────────────────────────────────────

export type BlogCategory = 'elderly-care' | 'parenting' | 'disability' | 'wellness' | 'home-healthcare' | 'insurance'

export interface BlogPost {
  _id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: BlogCategory
  tags: string[]
  featuredImage: string
  seoTitle?: string
  seoDescription?: string
  published: boolean
  publishedAt?: string
  readTime: number
  views: number
  createdAt: string
}

// ── Dashboard Analytics ───────────────────────────────────

export interface DashboardStats {
  activeClients: number
  activeClientsChange: number
  staffOnDuty: number
  openIncidents: number
  openIncidentsChange: number
  missedVisits: number
  pendingInvoices: number
  pendingInvoicesAmount: number
  monthlyRevenue: number
  revenueChange: number
  satisfactionRate: number
}

export interface RevenueData {
  month: string
  revenue: number
  invoiced: number
}

export interface ServiceDistribution {
  service: string
  count: number
  percentage: number
  color: string
}

// ── Matching Engine ───────────────────────────────────────

export interface MatchingCriteria {
  clientId: string
  careType: CareType
  preferredLanguages?: string[]
  genderPreference?: 'any' | 'male' | 'female'
  location: Address
  requiredSkills?: string[]
  scheduleDates: string[]
  culturalPreferences?: string[]
}

export interface MatchResult {
  caregiverId: string
  caregiver: Caregiver
  matchScore: number
  matchReasons: string[]
  availability: boolean
  distanceKm: number
}

// ── Common ────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  statusCode?: number
}

export interface SelectOption {
  value: string
  label: string
}

export interface Notification {
  _id: string
  userId: string
  type: 'info' | 'success' | 'warning' | 'error' | 'alert'
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}
