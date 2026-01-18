import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"

const classes = [
  {
    id: "CLS001",
    name: "Mathematics - Advanced",
    code: "MATH-12A",
    teacher: "Dr. Jennifer Smith",
    students: 28,
    capacity: 30,
    schedule: "Mon, Wed, Fri 9:00 AM",
    grade: "12",
  },
  {
    id: "CLS002",
    name: "Physics - Lab",
    code: "PHY-11B",
    teacher: "Prof. David Johnson",
    students: 25,
    capacity: 30,
    schedule: "Tue, Thu 10:30 AM",
    grade: "11",
  },
  {
    id: "CLS003",
    name: "English Literature",
    code: "ENG-10A",
    teacher: "Ms. Sarah Williams",
    students: 30,
    capacity: 30,
    schedule: "Mon, Wed 2:00 PM",
    grade: "10",
  },
  {
    id: "CLS004",
    name: "Chemistry - Organic",
    code: "CHEM-12C",
    teacher: "Dr. Robert Lee",
    students: 22,
    capacity: 30,
    schedule: "Tue, Thu, Fri 11:00 AM",
    grade: "12",
  },
  {
    id: "CLS005",
    name: "World History",
    code: "HIST-11A",
    teacher: "Mr. Michael Brown",
    students: 27,
    capacity: 30,
    schedule: "Mon, Wed, Fri 1:00 PM",
    grade: "11",
  },
  {
    id: "CLS006",
    name: "Biology - Advanced",
    code: "BIO-12B",
    teacher: "Dr. Emily Davis",
    students: 26,
    capacity: 30,
    schedule: "Tue, Thu 9:00 AM",
    grade: "12",
  },
]

export function ClassesGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => {
        const occupancyPercentage = (classItem.students / classItem.capacity) * 100
        const isFull = occupancyPercentage >= 100

        return (
          <Card key={classItem.id} className="hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <CardDescription className="mt-1">{classItem.code}</CardDescription>
                </div>
                <Badge variant="outline">Grade {classItem.grade}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {classItem.students}/{classItem.capacity} students
                  </span>
                  {isFull && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      Full
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{classItem.schedule}</span>
                </div>
              </div>
              <div className="border-border border-t pt-4">
                <p className="text-muted-foreground text-sm">Instructor</p>
                <p className="font-medium text-sm">{classItem.teacher}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
