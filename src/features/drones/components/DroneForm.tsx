import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type DroneFormValues = {
  company: string
  model: string
  fullName: string
  priceRTF: number
  tankCapacity: number
  flightSpeed: number
  sprayWidth: number
  coveragePerDay: number
  rtfEquipment: string
}

type DroneFormProps = {
  initial?: Partial<DroneFormValues>
  submitting?: boolean
  error?: string | null
  onSubmit: (values: DroneFormValues) => void
}

export function DroneForm({ initial, submitting, error, onSubmit }: DroneFormProps) {
  const [company, setCompany] = useState(initial?.company ?? '')
  const [model, setModel] = useState(initial?.model ?? '')
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [rtfEquipment, setRtfEquipment] = useState(initial?.rtfEquipment ?? '')
  const [priceRTF, setPriceRTF] = useState(String(initial?.priceRTF ?? ''))
  const [tankCapacity, setTankCapacity] = useState(String(initial?.tankCapacity ?? ''))
  const [flightSpeed, setFlightSpeed] = useState(String(initial?.flightSpeed ?? ''))
  const [sprayWidth, setSprayWidth] = useState(String(initial?.sprayWidth ?? ''))
  const [coveragePerDay, setCoveragePerDay] = useState(String(initial?.coveragePerDay ?? ''))
  const [formError, setFormError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!company.trim() || !model.trim() || !fullName.trim() || !rtfEquipment.trim()) {
      setFormError('Company, model, full name, and RTF equipment are required')
      return
    }
    const parsed = {
      priceRTF: Number(priceRTF),
      tankCapacity: Number(tankCapacity),
      flightSpeed: Number(flightSpeed),
      sprayWidth: Number(sprayWidth),
      coveragePerDay: Number(coveragePerDay),
    }
    for (const [k, v] of Object.entries(parsed)) {
      if (!Number.isFinite(v) || v <= 0) {
        setFormError(`${k} must be a positive number`)
        return
      }
    }
    setFormError(null)
    onSubmit({ company, model, fullName, rtfEquipment, ...parsed })
  }

  const shownError = formError ?? error

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="Company" id="company">
        <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
      </Field>
      <Field label="Model" id="model">
        <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
      </Field>
      <Field label="Full name" id="fullName">
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </Field>
      <Field label="RTF equipment" id="rtfEquipment">
        <Input
          id="rtfEquipment"
          value={rtfEquipment}
          onChange={(e) => setRtfEquipment(e.target.value)}
          required
        />
      </Field>
      <Field label="Price (RTF)" id="priceRTF">
        <Input
          id="priceRTF"
          type="number"
          step="any"
          min="0"
          value={priceRTF}
          onChange={(e) => setPriceRTF(e.target.value)}
          required
        />
      </Field>
      <Field label="Tank capacity" id="tankCapacity">
        <Input
          id="tankCapacity"
          type="number"
          step="any"
          min="0"
          value={tankCapacity}
          onChange={(e) => setTankCapacity(e.target.value)}
          required
        />
      </Field>
      <Field label="Flight speed" id="flightSpeed">
        <Input
          id="flightSpeed"
          type="number"
          step="any"
          min="0"
          value={flightSpeed}
          onChange={(e) => setFlightSpeed(e.target.value)}
          required
        />
      </Field>
      <Field label="Spray width" id="sprayWidth">
        <Input
          id="sprayWidth"
          type="number"
          step="any"
          min="0"
          value={sprayWidth}
          onChange={(e) => setSprayWidth(e.target.value)}
          required
        />
      </Field>
      <Field label="Coverage per day" id="coveragePerDay">
        <Input
          id="coveragePerDay"
          type="number"
          step="any"
          min="0"
          value={coveragePerDay}
          onChange={(e) => setCoveragePerDay(e.target.value)}
          required
        />
      </Field>
      {shownError && <p className="text-sm text-red-600">{shownError}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving\u2026' : 'Save'}
        </Button>
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
