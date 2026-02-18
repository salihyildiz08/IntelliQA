export enum TestStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export enum ResultStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export enum Category {
  AUTH = 'Kimlik Doğrulama',
  CRUD = 'CRUD İşlemleri',
  UIUX = 'UI / UX',
  PERFORMANCE = 'Performans',
  SECURITY = 'Güvenlik'
}

export interface TestLog {
  id: string;
  message: string;
  timestamp: string;
  category: Category;
  status?: ResultStatus;
}

export interface DetailedTestResult {
  testName: string;
  category: Category;
  expected: string;
  actual: string;
  status: ResultStatus;
  suggestion: string;
  technicalDetail?: string; // e.g., "X-Frame-Options missing"
}

export interface PatternAnalysis {
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TestReport {
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    risky: number;
    critical: number;
  };
  scores: {
    security: number;
    performance: number;
    ux: number;
    codeQuality: number;
    global: number;
    globalRiskLabel: string; // e.g., "Moderate Risk"
  };
  details: DetailedTestResult[];
  patterns: PatternAnalysis[];
}

export interface SimulationConfig {
  url: string;
  description: string;
  depth: 'standard' | 'deep';
}