export type RiskLevel = "urgent" | "attention" | "stable"

export interface DeviceState {
  state: "ok" | "warning" | "offline"
  label: string
}

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
  safePhone?: string
  organization?: string
}

export interface VisitRecord {
  id: string
  date: string
  type: "정기 방문" | "긴급 방문" | "전화 안부" | "화상 상담"
  duration: number // minutes
  summary: string
  provider: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  address: string
  lat: number
  lng: number
  riskLevel: RiskLevel
  riskScore: number
  alertSummary: string
  medications: { label: string; isNew?: boolean }[]
  devices: {
    appCheck: DeviceState
    wearable: DeviceState
  }
  medicationSchedule: { label: string; time: string; done: boolean }[]
  careGuide: string[]
  prescriptions: Prescription[]
  iotLogs: IoTLog[]
  anomalies: Anomaly[]
  guardian: ContactInfo
  caregiver: ContactInfo
  pastVisits: VisitRecord[]
}

const defaultCaregiver: ContactInfo = {
  name: "김재원",
  role: "사회복지사",
  phone: "010-9876-5432",
  safePhone: "050-7700-1234",
  organization: "마포구 통합돌봄센터",
}

// 15명의 풍부한 상태를 가진 환자 데이터
export const mockPatients: Patient[] = [
  // --- Urgent (3명) ---
  {
    id: "p1",
    name: "김순자",
    age: 82,
    gender: "여성",
    address: "서울시 마포구 성산동 무지개아파트 101동 504호",
    lat: 37.5645,
    lng: 126.9067,
    riskLevel: "urgent",
    riskScore: 88,
    alertSummary: "신규 관절염약 복용 후 기립성 어지러움 호소 및 3일 연속 수면 급감 (다제약물 부작용 의심)",
    medications: [{ label: "아스피린" }, { label: "고혈압약" }, { label: "신규 관절염약", isNew: true }],
    devices: {
      appCheck: { state: "warning", label: "인증 3시간 지연" },
      wearable: { state: "warning", label: "수면패턴 불량" },
    },
    medicationSchedule: [
      { label: "아침 복약", time: "08:00", done: true },
      { label: "점심 복약", time: "12:30", done: true },
      { label: "저녁 복약", time: "18:30", done: false },
    ],
    careGuide: [
      "내일 오전 방문 시 침대에서 일어설 때 반드시 부축 수행",
      "식후 속쓰림 여부 정밀 관찰 및 기록",
      "어지러움 발생 시간대와 빈도 별도 메모",
    ],
    prescriptions: [
      { id: "rx1", drug: "아모디핀 5mg", dosage: "1일 1회 아침", hospital: "성산내과", doctor: "이상호", date: "2026-06-15" },
      { id: "rx2", drug: "셀레콕시브 200mg", dosage: "1일 2회 식후", hospital: "마포정형외과", doctor: "박진우", date: "2026-06-28", nextVisit: "2026-07-15" },
    ],
    iotLogs: Array.from({ length: 7 }).map((_, i) => ({
      date: `07/${String(1 - i + 7).padStart(2, '0')}`,
      sleepHours: 7 - i * 0.6,
      steps: 3000 - i * 400,
      heartRate: 70 + i * 2,
      pillboxOpened: i > 2,
      pillboxTime: "08:15",
    })).reverse(),
    anomalies: [
      { id: "a1", type: "sleep", severity: "urgent", title: "수면 시간 급감", description: "최근 3일간 수면 시간이 4시간 미만으로 감소", detectedAt: "2026-07-03 06:00" },
      { id: "a2", type: "medication", severity: "urgent", title: "다제약물 부작용 의심", description: "관절염약 복용 시작일과 어지러움 발생 시점 일치", detectedAt: "2026-07-02 14:00" },
    ],
    guardian: { name: "김영수", role: "장남", phone: "010-1111-2222" },
    caregiver: defaultCaregiver,
    pastVisits: [
      { id: "v1", date: "2026-06-30", type: "정기 방문", duration: 45, summary: "컨디션 양호하셨으나 새로 처방받은 약 드시고 속이 조금 쓰리다고 하심.", provider: "김재원" }
    ]
  },
  {
    id: "p2",
    name: "이창호",
    age: 78,
    gender: "남성",
    address: "서울시 마포구 연남동 123-45",
    lat: 37.5621,
    lng: 126.9242,
    riskLevel: "urgent",
    riskScore: 92,
    alertSummary: "새벽 화장실 이동 중 낙상 감지 및 긴급 호출 발생",
    medications: [{ label: "전립선약" }, { label: "당뇨약" }],
    devices: {
      appCheck: { state: "ok", label: "인증완료" },
      wearable: { state: "offline", label: "연결 끊김" },
    },
    medicationSchedule: [
      { label: "아침 복약", time: "07:30", done: true },
      { label: "저녁 복약", time: "18:00", done: false },
    ],
    careGuide: [
      "즉시 방문하여 낙상에 의한 외상 여부 확인",
      "화장실 동선 미끄럼 방지 패드 상태 점검",
      "야간뇨 빈도 재확인 및 비뇨기과 연계 검토"
    ],
    prescriptions: [
      { id: "rx3", drug: "메트포르민 500mg", dosage: "1일 2회 식후", hospital: "연남가정의학과", doctor: "최지훈", date: "2026-05-20", nextVisit: "2026-07-20" },
    ],
    iotLogs: Array.from({ length: 7 }).map((_, i) => ({
      date: `07/${String(i + 1).padStart(2, '0')}`,
      sleepHours: 5.5,
      steps: 1200,
      heartRate: 85,
      pillboxOpened: true,
      pillboxTime: "07:35",
    })),
    anomalies: [
      { id: "a3", type: "activity", severity: "urgent", title: "비정상적 충격 감지", description: "새벽 2시 15분 경 낙상으로 의심되는 충격 패턴 감지됨", detectedAt: "2026-07-03 02:15" },
    ],
    guardian: { name: "이수진", role: "장녀", phone: "010-3333-4444" },
    caregiver: defaultCaregiver,
    pastVisits: []
  },
  {
    id: "p3",
    name: "박용철",
    age: 85,
    gender: "남성",
    address: "서울시 마포구 망원동 456-78",
    lat: 37.5552,
    lng: 126.9015,
    riskLevel: "urgent",
    riskScore: 85,
    alertSummary: "이틀 연속 식사 거부 및 체중 1.5kg 급감, 무기력증 심화",
    medications: [{ label: "치매약" }, { label: "소화제" }],
    devices: {
      appCheck: { state: "warning", label: "이틀째 미응답" },
      wearable: { state: "ok", label: "정상" },
    },
    medicationSchedule: [
      { label: "점심 복약", time: "12:00", done: false },
    ],
    careGuide: [
      "영양죽 등 소화가 쉬운 대체식 제공 시도",
      "보호자에게 영양 주사 처방 필요성 안내",
      "우울증 척도 검사(SGDS) 실시"
    ],
    prescriptions: [],
    iotLogs: Array.from({ length: 7 }).map((_, i) => ({
      date: `07/${String(i + 1).padStart(2, '0')}`,
      sleepHours: 8.5,
      steps: 200, // Very low activity
      heartRate: 60,
      pillboxOpened: i < 5,
    })),
    anomalies: [
      { id: "a4", type: "vital", severity: "urgent", title: "활동량 극미 및 복약 거부", description: "최근 48시간 내 실내 이동 거의 없음. 복약앱 응답 없음.", detectedAt: "2026-07-03 09:00" },
    ],
    guardian: { name: "박민호", role: "차남", phone: "010-5555-6666" },
    caregiver: defaultCaregiver,
    pastVisits: []
  },

  // --- Attention (5명) ---
  {
    id: "p4",
    name: "정말임",
    age: 76,
    gender: "여성",
    address: "서울시 마포구 서교동 234-56",
    lat: 37.5510,
    lng: 126.9200,
    riskLevel: "attention",
    riskScore: 68,
    alertSummary: "오전 혈압약 앱 터치 인증 3시간 지연 및 활동량 30% 감소",
    medications: [{ label: "고혈압약" }],
    devices: {
      appCheck: { state: "warning", label: "미응답" },
      wearable: { state: "ok", label: "정상" },
    },
    medicationSchedule: [
      { label: "아침 복약", time: "08:30", done: false },
    ],
    careGuide: [
      "방문 시 복약 달력 직접 확인",
      "요즘 입맛이 없으신지 문진",
    ],
    prescriptions: [],
    iotLogs: Array.from({ length: 7 }).map((_, i) => ({
      date: `07/${String(i + 1).padStart(2, '0')}`,
      sleepHours: 6.5,
      steps: 4000 - i * 200,
      heartRate: 72,
      pillboxOpened: i < 6,
    })),
    anomalies: [
      { id: "a5", type: "medication", severity: "attention", title: "복약 인증 지연", description: "평소 제시간에 하시던 앱 인증이 최근 3일간 평균 2시간 지연됨", detectedAt: "2026-07-03 11:30" }
    ],
    guardian: { name: "최정훈", role: "아들", phone: "010-7777-8888" },
    caregiver: defaultCaregiver,
    pastVisits: []
  },
  {
    id: "p5",
    name: "강덕배",
    age: 81,
    gender: "남성",
    address: "서울시 마포구 공덕동 래미안 205동 402호",
    lat: 37.5450,
    lng: 126.9500,
    riskLevel: "attention",
    riskScore: 65,
    alertSummary: "최근 이틀간 야간 수면 중 잦은 뒤척임과 깨어남 반복 감지",
    medications: [{ label: "전립선약" }, { label: "고지혈증약" }],
    devices: {
      appCheck: { state: "ok", label: "인증완료" },
      wearable: { state: "warning", label: "수면 질 저하" },
    },
    medicationSchedule: [
      { label: "저녁 복약", time: "19:00", done: true },
    ],
    careGuide: [
      "야간뇨 때문에 깨시는지 확인",
      "오후 시간대 카페인 섭취 자제 권고"
    ],
    prescriptions: [],
    iotLogs: Array.from({ length: 7 }).map((_, i) => ({
      date: `07/${String(i + 1).padStart(2, '0')}`,
      sleepHours: i >= 5 ? 4.5 : 7.0,
      steps: 5000,
      heartRate: 68,
      pillboxOpened: true,
    })),
    anomalies: [
      { id: "a6", type: "sleep", severity: "attention", title: "야간 수면 분절", description: "수면 중 4회 이상 깸 감지. 야간뇨 또는 통증 의심", detectedAt: "2026-07-03 07:00" }
    ],
    guardian: { name: "강석진", role: "차남", phone: "010-9999-0000" },
    caregiver: defaultCaregiver,
    pastVisits: []
  },
  // Attention 추가 3명...
  {
    id: "p6", name: "윤복희", age: 77, gender: "여성", address: "서울시 마포구 아현동", lat: 37.555, lng: 126.953,
    riskLevel: "attention", riskScore: 61, alertSummary: "스마트 약통 배터리 부족 및 1회 개폐 누락",
    medications: [{ label: "골다공증약" }], devices: { appCheck: { state: "ok", label: "" }, wearable: { state: "ok", label: "" } },
    medicationSchedule: [], careGuide: ["스마트 약통 건전지 교체", "약 복용 여부 구두 확인"], prescriptions: [], iotLogs: [], anomalies: [], guardian: { name: "김지영", role: "딸", phone: "010-1234-1111" }, caregiver: defaultCaregiver, pastVisits: []
  },
  {
    id: "p7", name: "최길동", age: 83, gender: "남성", address: "서울시 마포구 용강동", lat: 37.540, lng: 126.940,
    riskLevel: "attention", riskScore: 59, alertSummary: "최근 3일간 외출(활동량) 전혀 없음",
    medications: [{ label: "고혈압약" }], devices: { appCheck: { state: "ok", label: "" }, wearable: { state: "warning", label: "외출없음" } },
    medicationSchedule: [], careGuide: ["날씨가 좋으니 단지 내 산책 10분 동행"], prescriptions: [], iotLogs: [], anomalies: [], guardian: { name: "최민수", role: "아들", phone: "010-1234-2222" }, caregiver: defaultCaregiver, pastVisits: []
  },
  {
    id: "p8", name: "임순옥", age: 79, gender: "여성", address: "서울시 마포구 대흥동", lat: 37.548, lng: 126.942,
    riskLevel: "attention", riskScore: 55, alertSummary: "안정 시 심박수 평소 대비 15% 상승",
    medications: [{ label: "부정맥약" }], devices: { appCheck: { state: "ok", label: "" }, wearable: { state: "warning", label: "심박상승" } },
    medicationSchedule: [], careGuide: ["가슴 두근거림이나 답답함 없는지 확인", "실내 온도 체크 (온열질환 예방)"], prescriptions: [], iotLogs: [], anomalies: [], guardian: { name: "박성호", role: "사위", phone: "010-1234-3333" }, caregiver: defaultCaregiver, pastVisits: []
  },

  // --- Stable (7명) ---
  ...Array.from({ length: 7 }).map((_, i) => ({
    id: `p${9 + i}`,
    name: ["조용호", "신미경", "장영식", "한미영", "오길동", "배은주", "송민수"][i],
    age: 72 + i * 2,
    gender: i % 2 === 0 ? "남성" : "여성",
    address: `서울시 마포구 ${["합정동", "상암동", "성산동", "연남동", "망원동", "서교동", "공덕동"][i]}`,
    lat: 37.550 + i * 0.005,
    lng: 126.910 + i * 0.005,
    riskLevel: "stable" as RiskLevel,
    riskScore: 20 + i * 3,
    alertSummary: "특이사항 없음. 복약 및 수면 양호.",
    medications: [{ label: "비타민" }],
    devices: {
      appCheck: { state: "ok" as const, label: "인증완료" },
      wearable: { state: "ok" as const, label: "정상" },
    },
    medicationSchedule: [
      { label: "아침 복약", time: "09:00", done: true },
    ],
    careGuide: [
      "기존 돌봄 계획 유지",
      "가벼운 안부 인사 및 말벗 서비스",
    ],
    prescriptions: [],
    iotLogs: Array.from({ length: 7 }).map((_, j) => ({
      date: `07/${String(j + 1).padStart(2, '0')}`,
      sleepHours: 7.5,
      steps: 5000,
      heartRate: 65,
      pillboxOpened: true,
      pillboxTime: "09:00",
    })),
    anomalies: [],
    guardian: { name: "보호자", role: "자녀", phone: "010-0000-0000" },
    caregiver: defaultCaregiver,
    pastVisits: []
  }))
]
