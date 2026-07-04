export type RiskLevel = "urgent" | "attention" | "stable"

export type DeviceState = "ok" | "warning" | "offline"

export interface Prescription {
  id: string
  drug: string
  dosage: string
  hospital: string
  doctor: string
  date: string
  nextVisit?: string
}

export interface IoTLog {
  date: string
  sleepHours: number
  steps: number
  heartRate: number
  pillboxOpened: boolean
  pillboxTime?: string
}

export interface Anomaly {
  id: string
  type: "sleep" | "activity" | "medication" | "vital"
  severity: RiskLevel
  title: string
  description: string
  detectedAt: string
}

export interface ContactInfo {
  name: string
  role: string
  phone: string
  safePhone?: string // 일회용 안심번호
  organization?: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  address: string
  riskLevel: RiskLevel
  riskScore: number
  alertSummary: string
  medications: { label: string; isNew?: boolean }[]
  devices: {
    appCheck: { state: DeviceState; label: string }
    wearable: { state: DeviceState; label: string }
  }
  sleep: number[] // last 7 days in hours
  medication: { label: string; time: string; done: boolean }[]
  voiceLog: string
  diagnosis: {
    symptom: string
    conclusion: string
    confidence: number
  }
  careGuide: string[]
  clinicalReport: string
  prescriptions: Prescription[]
  iotLogs: IoTLog[]
  anomalies: Anomaly[]
  guardian: ContactInfo
  caregiver: ContactInfo
}

const basePatients: Patient[] = [
  {
    id: "kim-soonja",
    name: "김순자 어르신",
    age: 82,
    gender: "여성",
    address: "서울시 노원구 상계동 한빛아파트 101동 504호",
    riskLevel: "urgent",
    riskScore: 88,
    alertSummary:
      "관절염 약 변경 후 어지러움 호소 및 3일 연속 수면 부족 (다제약물 부작용 의심)",
    medications: [
      { label: "아스피린" },
      { label: "고혈압약" },
      { label: "신규 관절염약", isNew: true },
    ],
    devices: {
      appCheck: { state: "warning", label: "인증 지연" },
      wearable: { state: "warning", label: "수면저하" },
    },
    sleep: [7.2, 6.8, 7.0, 6.5, 4.2, 3.8, 3.5],
    medication: [
      { label: "아침 복약", time: "08:00", done: true },
      { label: "점심 복약", time: "12:30", done: true },
      { label: "저녁 복약", time: "18:30", done: false },
    ],
    voiceLog:
      "오늘 아침 방문해서 약 챙겨드렸는데, 최근에 관절염 때문에 약 바꾸시고 나서 자꾸 주저앉으려고 하시고 어지럽다고 하심. 식사도 평소의 절반도 안 하셨음.",
    diagnosis: {
      symptom: "기립성 어지러움 및 식욕 부진",
      conclusion: "기존 고혈압약과 신규 소염진통제 간 다제약물 상호작용 부작용 의심",
      confidence: 88,
    },
    careGuide: [
      "내일 오전 방문 시 침대에서 일어설 때 반드시 부축 수행",
      "식후 속쓰림 여부 정밀 관찰 및 기록",
      "어지러움 발생 시간대와 빈도 별도 메모",
      "수분 섭취 권장 및 식사량 재확인",
    ],
    clinicalReport:
      "김순자 어르신(82세, 여성)은 신규 관절염 소염진통제 복용 시작 이후 기립성 어지러움과 식욕 부진을 보이고 있습니다. 최근 3일간 수면 시간이 평균 3.8시간으로 급격히 감소했으며, 기존 복용 중인 고혈압약과의 다제약물 상호작용에 따른 혈압 강하 가능성이 높습니다(AI 분석 신뢰도 88%). 낙상 위험이 우려되므로 담당의 재진 및 처방 재검토를 권고드립니다.",
    prescriptions: [
      { id: "rx1", drug: "아스피린 100mg", dosage: "1일 1회 아침 식후", hospital: "노원구 한빛내과", doctor: "이상호", date: "2026-06-15", nextVisit: "2026-07-10" },
      { id: "rx2", drug: "아모디핀 5mg (고혈압)", dosage: "1일 1회 아침", hospital: "노원구 한빛내과", doctor: "이상호", date: "2026-06-15" },
      { id: "rx3", drug: "셀레콕시브 200mg (관절염)", dosage: "1일 2회 식후", hospital: "서울대 정형외과", doctor: "박진우", date: "2026-06-28", nextVisit: "2026-07-15" },
    ],
    iotLogs: [
      { date: "06/27", sleepHours: 6.5, steps: 2800, heartRate: 72, pillboxOpened: true, pillboxTime: "08:12" },
      { date: "06/28", sleepHours: 4.2, steps: 1500, heartRate: 78, pillboxOpened: true, pillboxTime: "08:45" },
      { date: "06/29", sleepHours: 3.8, steps: 900, heartRate: 82, pillboxOpened: true, pillboxTime: "09:20" },
      { date: "06/30", sleepHours: 3.5, steps: 650, heartRate: 85, pillboxOpened: false },
      { date: "07/01", sleepHours: 3.2, steps: 500, heartRate: 88, pillboxOpened: true, pillboxTime: "10:05" },
      { date: "07/02", sleepHours: 3.0, steps: 420, heartRate: 90, pillboxOpened: false },
      { date: "07/03", sleepHours: 2.8, steps: 380, heartRate: 92, pillboxOpened: true, pillboxTime: "11:30" },
    ],
    anomalies: [
      { id: "a1", type: "sleep", severity: "urgent", title: "수면 시간 급감", description: "최근 5일간 수면 시간이 평균 3.3시간으로, 2주 전 평균(6.9시간) 대비 52% 감소", detectedAt: "2026-07-03 06:00" },
      { id: "a2", type: "medication", severity: "urgent", title: "다제약물 부작용 의심", description: "신규 관절염약(셀레콕시브) 복용 시작일과 어지러움·수면 저하 발생 시점이 일치", detectedAt: "2026-07-02 14:00" },
      { id: "a3", type: "activity", severity: "attention", title: "활동량 급격 감소", description: "일일 걸음 수가 2,800보에서 380보로 86% 감소. 낙상 위험 증가", detectedAt: "2026-07-03 12:00" },
      { id: "a4", type: "vital", severity: "attention", title: "안정 시 심박수 상승", description: "안정 시 심박수 72→92bpm으로 상승 추세. 자율신경계 이상 가능성", detectedAt: "2026-07-03 09:00" },
    ],
    guardian: { name: "김영수", role: "장남", phone: "010-1234-5678" },
    caregiver: { name: "김재원", role: "사회복지사", phone: "010-9876-5432", safePhone: "050-7700-1234", organization: "노원구 통합돌봄센터" },
  },
  {
    id: "lee-youngsoo",
    name: "이영수 어르신",
    age: 75,
    gender: "남성",
    address: "서울시 노원구 중계동 그린빌 203동 1102호",
    riskLevel: "attention",
    riskScore: 64,
    alertSummary: "오전 혈압약 앱 터치 인증 3시간 지연 및 활동량 감소 감지",
    medications: [{ label: "고혈압약" }, { label: "당뇨약" }],
    devices: {
      appCheck: { state: "warning", label: "미응답" },
      wearable: { state: "ok", label: "정상" },
    },
    sleep: [6.5, 6.8, 7.1, 6.9, 6.2, 6.4, 6.0],
    medication: [
      { label: "아침 복약", time: "08:00", done: false },
      { label: "저녁 복약", time: "19:00", done: false },
    ],
    voiceLog:
      "오늘 통화로 안부 여쭤봤는데 아침 약을 깜빡하셨다고 하심. 요즘 바깥 산책도 잘 안 나가신다고 함.",
    diagnosis: {
      symptom: "복약 시간 지연 및 활동량 감소",
      conclusion: "복약 순응도 저하 및 우울감 동반 가능성",
      confidence: 71,
    },
    careGuide: [
      "복약 앱 푸시 알림 시간 재설정 및 보호자 알림 연동",
      "주 3회 이상 외출 및 가벼운 산책 독려",
      "다음 방문 시 우울감 선별 문진 진행",
    ],
    clinicalReport:
      "이영수 어르신(75세, 남성)은 오전 혈압약 복용(앱 인증)이 평소 대비 3시간 지연되었으며 웨어러블 측정 활동량이 지난주 대비 약 30% 감소했습니다. 복약 순응도 저하와 함께 활동성 감소가 동반되어 경과 관찰이 필요합니다(AI 분석 신뢰도 71%).",
    prescriptions: [
      { id: "rx4", drug: "아모디핀 5mg (고혈압)", dosage: "1일 1회 아침 식후", hospital: "중계 메디컬센터", doctor: "최민정", date: "2026-06-20", nextVisit: "2026-07-20" },
      { id: "rx5", drug: "메트포르민 500mg (당뇨)", dosage: "1일 2회 식후", hospital: "중계 메디컬센터", doctor: "최민정", date: "2026-06-20" },
    ],
    iotLogs: [
      { date: "06/27", sleepHours: 6.5, steps: 4200, heartRate: 68, pillboxOpened: true, pillboxTime: "08:05" },
      { date: "06/28", sleepHours: 6.8, steps: 3900, heartRate: 70, pillboxOpened: true, pillboxTime: "08:10" },
      { date: "06/29", sleepHours: 7.1, steps: 3500, heartRate: 69, pillboxOpened: true, pillboxTime: "09:00" },
      { date: "06/30", sleepHours: 6.9, steps: 3100, heartRate: 71, pillboxOpened: false },
      { date: "07/01", sleepHours: 6.2, steps: 2800, heartRate: 72, pillboxOpened: true, pillboxTime: "10:30" },
      { date: "07/02", sleepHours: 6.4, steps: 2500, heartRate: 70, pillboxOpened: true, pillboxTime: "11:15" },
      { date: "07/03", sleepHours: 6.0, steps: 2200, heartRate: 73, pillboxOpened: false },
    ],
    anomalies: [
      { id: "a5", type: "medication", severity: "attention", title: "복약 인증 지연", description: "오전 혈압약 앱 터치 인증이 3시간 지연됨. 최근 1주간 평균 지연 시간 2.1시간", detectedAt: "2026-07-03 11:00" },
      { id: "a6", type: "activity", severity: "attention", title: "활동량 점진적 감소", description: "일일 걸음 수가 4,200보에서 2,200보로 1주간 47% 감소. 우울감 관련 모니터링 필요", detectedAt: "2026-07-03 18:00" },
    ],
    guardian: { name: "이미영", role: "장녀", phone: "010-2345-6789" },
    caregiver: { name: "김재원", role: "사회복지사", phone: "010-9876-5432", safePhone: "050-7700-2345", organization: "노원구 통합돌봄센터" },
  },
  {
    id: "park-malsoon",
    name: "박말순 어르신",
    age: 79,
    gender: "여성",
    address: "서울시 노원구 공릉동 햇살빌라 302호",
    riskLevel: "stable",
    riskScore: 22,
    alertSummary: "전일 대비 특이사항 없음, 복약 앱 인증 및 수면 패턴 양호",
    medications: [{ label: "골다공증약" }],
    devices: {
      appCheck: { state: "ok", label: "인증완료" },
      wearable: { state: "ok", label: "정상" },
    },
    sleep: [7.4, 7.1, 7.6, 7.2, 7.5, 7.3, 7.4],
    medication: [{ label: "아침 복약", time: "09:00", done: true }],
    voiceLog: "오늘 컨디션 좋으시고 식사도 잘 하셨다고 함. 특이사항 없음.",
    diagnosis: {
      symptom: "특이사항 없음",
      conclusion: "안정 상태 유지 중",
      confidence: 96,
    },
    careGuide: ["기존 케어 플랜 유지", "정기 안부 확인 지속"],
    clinicalReport:
      "박말순 어르신(79세, 여성)은 복약 순응도, 수면 패턴, 활동량 모두 정상 범위를 유지하고 있어 현재 케어 플랜을 그대로 유지할 것을 권고합니다.",
    prescriptions: [
      { id: "rx6", drug: "알렌드로네이트 70mg (골다공증)", dosage: "주 1회 월요일 기상 후", hospital: "공릉 가정의학과", doctor: "한지수", date: "2026-06-01", nextVisit: "2026-09-01" },
    ],
    iotLogs: [
      { date: "06/27", sleepHours: 7.4, steps: 5100, heartRate: 65, pillboxOpened: true, pillboxTime: "09:00" },
      { date: "06/28", sleepHours: 7.1, steps: 4800, heartRate: 64, pillboxOpened: true, pillboxTime: "09:05" },
      { date: "06/29", sleepHours: 7.6, steps: 5200, heartRate: 63, pillboxOpened: true, pillboxTime: "08:55" },
      { date: "06/30", sleepHours: 7.2, steps: 4900, heartRate: 66, pillboxOpened: true, pillboxTime: "09:10" },
      { date: "07/01", sleepHours: 7.5, steps: 5000, heartRate: 64, pillboxOpened: true, pillboxTime: "09:00" },
      { date: "07/02", sleepHours: 7.3, steps: 5100, heartRate: 65, pillboxOpened: true, pillboxTime: "09:02" },
      { date: "07/03", sleepHours: 7.4, steps: 4950, heartRate: 64, pillboxOpened: true, pillboxTime: "09:00" },
    ],
    anomalies: [],
    guardian: { name: "박철호", role: "차남", phone: "010-3456-7890" },
    caregiver: { name: "김재원", role: "사회복지사", phone: "010-9876-5432", safePhone: "050-7700-3456", organization: "노원구 통합돌봄센터" },
  },
]

// Generate 27 more mock patients to total 30
const generatedPatients: Patient[] = Array.from({ length: 27 }).map((_, i) => {
  const base = basePatients[i % 3];
  const isUrgent = base.riskLevel === 'urgent';
  const isAttention = base.riskLevel === 'attention';
  
  let scoreOffset = Math.floor(Math.random() * 10) - 5;
  let newScore = Math.max(10, Math.min(99, base.riskScore + scoreOffset));
  
  const lastNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];
  const firstNames = ["영희", "철수", "민수", "순옥", "영호", "미경", "영식", "미영", "길동", "은주"];
  const randName = lastNames[Math.floor(Math.random() * 10)] + firstNames[Math.floor(Math.random() * 10)] + " 어르신";
  
  return {
    ...base,
    id: `mock-patient-${i}`,
    name: randName,
    age: 70 + Math.floor(Math.random() * 20),
    riskScore: newScore,
  }
})

export const patients: Patient[] = [...basePatients, ...generatedPatients];

export const summary = {
  total: 30,
  urgent: patients.filter(p => p.riskLevel === 'urgent').length,
  attention: patients.filter(p => p.riskLevel === 'attention').length,
  stable: patients.filter(p => p.riskLevel === 'stable').length,
}

export interface AppNotification {
  id: string
  level: RiskLevel
  title: string
  time: string
  patientId: string
}

export const notifications: AppNotification[] = [
  {
    id: "n1",
    level: "urgent",
    title: "김순자 어르신 수면 3일 연속 급감 — 즉시 확인 필요",
    time: "방금 전",
    patientId: "kim-soonja",
  },
  {
    id: "n2",
    level: "attention",
    title: "이영수 어르신 오전 혈압약 미인증 (3시간 지연)",
    time: "32분 전",
    patientId: "lee-youngsoo",
  },
  {
    id: "n3",
    level: "stable",
    title: "박말순 어르신 오늘 앱 인증·수면 모두 정상",
    time: "1시간 전",
    patientId: "park-malsoon",
  },
]

export const riskMeta: Record<
  RiskLevel,
  { label: string; badgeClass: string; dotClass: string }
> = {
  urgent: {
    label: "긴급",
    badgeClass: "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
    dotClass: "bg-destructive",
  },
  attention: {
    label: "주의",
    badgeClass: "bg-warning/15 text-warning-foreground ring-1 ring-warning/30",
    dotClass: "bg-warning",
  },
  stable: {
    label: "안정",
    badgeClass: "bg-success/10 text-success-foreground ring-1 ring-success/20",
    dotClass: "bg-success",
  },
}
