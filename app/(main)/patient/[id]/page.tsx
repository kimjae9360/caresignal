import { mockPatients } from "@/lib/mockData"
import { PatientDetailClient } from "@/components/patient/PatientDetailClient"

export function generateStaticParams() {
  return mockPatients.map((p) => ({
    id: p.id,
  }))
}

export default async function PatientDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <PatientDetailClient id={params.id} />
}
