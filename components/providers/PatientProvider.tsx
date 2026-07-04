"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { mockPatients, type Patient } from "@/lib/mockData"

export interface Caregiver {
  id: string
  name: string
  phone: string
  center: string
}

interface PatientContextType {
  patients: Patient[]
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, updated: Partial<Patient>) => void
  caregivers: Caregiver[]
  addCaregiver: (caregiver: Caregiver) => void
  removeCaregiver: (id: string) => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

const initialCaregivers: Caregiver[] = [
  { id: "c1", name: "김재원", phone: "050-1234-5678", center: "강남센터" },
  { id: "c2", name: "이수진", phone: "050-8765-4321", center: "서초센터" },
]

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [caregivers, setCaregivers] = useState<Caregiver[]>(initialCaregivers)

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [patient, ...prev])
  }

  const updatePatient = (id: string, updated: Partial<Patient>) => {
    setPatients((prev) => prev.map(p => p.id === id ? { ...p, ...updated } : p))
  }

  const addCaregiver = (c: Caregiver) => {
    setCaregivers(prev => [...prev, c])
  }

  const removeCaregiver = (id: string) => {
    setCaregivers(prev => prev.filter(c => c.id !== id))
  }

  return (
    <PatientContext.Provider value={{ 
      patients, addPatient, updatePatient, 
      caregivers, addCaregiver, removeCaregiver 
    }}>
      {children}
    </PatientContext.Provider>
  )
}

export function usePatients() {
  const context = useContext(PatientContext)
  if (!context) {
    throw new Error("usePatients must be used within a PatientProvider")
  }
  return context
}
