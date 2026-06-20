import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type DroneFormValues = {
  brand: string
  model: string
  fullName: string
  priceThb: number
  tankCapacityL: number
  speedMps: number
  sprayWidthM: number
  performanceRaiPerDay: number
}

type DroneFormProps = {
  initial?: Partial<DroneFormValues>
  submitting?: boolean
  error?: string | null
  onSubmit: (values: DroneFormValues) => void
}

export function DroneForm({ initial, submitting, error, onSubmit }: DroneFormProps) {
  const [brand, setBrand] = useState(initial?.brand ?? '')
  const [model, setModel] = useState(initial?.model ?? '')
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [priceThb, setPriceThb] = useState(String(initial?.priceThb ?? ''))
  const [tankCapacityL, setTankCapacityL] = useState(String(initial?.tankCapacityL ?? ''))
  const [speedMps, setSpeedMps] = useState(String(initial?.speedMps ?? ''))
  const [sprayWidthM, setSprayWidthM] = useState(String(initial?.sprayWidthM ?? ''))
  const [performanceRaiPerDay, setPerformanceRaiPerDay] = useState(String(initial?.performanceRaiPerDay ?? ''))
  const [formError, setFormError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!brand.trim() || !model.trim() || !fullName.trim()) {
      setFormError('Brand, model, and full name are required')
      return
    }
    const parsed = {
      priceThb: Number(priceThb),
      tankCapacityL: Number(tankCapacityL),
      speedMps: Number(speedMps),
      sprayWidthM: Number(sprayWidthM),
      performanceRaiPerDay: Number(performanceRaiPerDay),
    }
    for (const [k, v] of Object.entries(parsed)) {
      if (!Number.isFinite(v) || v <= 0) {
        setFormError(`${k} must be a positive number`)
        return
      }
    }
    setFormError(null)
    onSubmit({ brand, model, fullName, ...parsed })
  }

  const shownError = formError ?? error

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="Brand" id="brand">
        <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
      </Field>
      <Field label="Model" id="model">
        <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
      </Field>
      <Field label="Full name" id="fullName">
        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </Field>
      <Field label="Price (THB)" id="priceThb">
        <Input id="priceThb" type="number" step="any" min="0" value={priceThb} onChange={(e) => setPriceThb(e.target.value)} required />
      </Field>
      <Field label="Tank capacity (L)" id="tankCapacityL">
        <Input id="tankCapacityL" type="number" step="any" min="0" value={tankCapacityL} onChange={(e) => setTankCapacityL(e.target.value)} required />
      </Field>
      <Field label="Speed (m/s)" id="speedMps">
        <Input id="speedMps" type="number" step="any" min="0" value={speedMps} onChange={(e) => setSpeedMps(e.target.value)} required />
      </Field>
      <Field label="Spray width (m)" id="sprayWidthM">
        <Input id="sprayWidthM" type="number" step="any" min="0" value={sprayWidthM} onChange={(e) => setSprayWidthM(e.target.value)} required />
      </Field>
      <Field label="Performance (rai/day)" id="performanceRaiPerDay">
        <Input id="performanceRaiPerDay" type="number" step="any" min="0" value={performanceRaiPerDay} onChange={(e) => setPerformanceRaiPerDay(e.target.value)} required />
      </Field>
      {shownError && <p className="text-sm text-red-600">{shownError}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving\u2026' : 'Save'}</Button>
      </div>
    </form>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}
