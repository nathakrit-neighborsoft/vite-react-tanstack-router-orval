import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div>
      <h1 className="text-2xl font-bold">Home</h1>
      <Link to="/drone" className="text-blue-600 underline">
        View drones →
      </Link>
    </div>
  ),
})
