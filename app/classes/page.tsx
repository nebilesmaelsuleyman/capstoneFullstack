import { Button } from "@/components/ui/button"
import { ClassesGrid } from "@/components/classes/classes-grid"
import { Plus } from "lucide-react"

export default function ClassesPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl text-balance">Classes</h1>
          <p className="text-muted-foreground">Manage class schedules and assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Class
        </Button>
      </div>

      <ClassesGrid />
    </div>
  )
}
