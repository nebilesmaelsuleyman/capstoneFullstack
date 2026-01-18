"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, TrendingUp, Users, Clock } from "lucide-react"

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const books = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0061120084",
      category: "Fiction",
      total: 5,
      available: 3,
    },
    {
      id: 2,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0743273565",
      category: "Fiction",
      total: 4,
      available: 1,
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0451524935",
      category: "Fiction",
      total: 6,
      available: 6,
    },
    {
      id: 4,
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "978-0262033848",
      category: "Computer Science",
      total: 3,
      available: 2,
    },
  ]

  const issues = [
    {
      id: 1,
      student: "John Smith",
      book: "The Great Gatsby",
      issueDate: "2024-03-01",
      dueDate: "2024-03-15",
      status: "issued",
    },
    {
      id: 2,
      student: "Emma Johnson",
      book: "To Kill a Mockingbird",
      issueDate: "2024-02-25",
      dueDate: "2024-03-11",
      status: "overdue",
    },
    {
      id: 3,
      student: "Michael Brown",
      book: "1984",
      issueDate: "2024-02-20",
      dueDate: "2024-03-06",
      status: "returned",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: any = {
      issued: "default",
      returned: "secondary",
      overdue: "destructive",
    }
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="font-semibold text-3xl text-balance">Library Management</h1>
        <p className="text-muted-foreground">Manage books and track book issues</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Books</p>
                <p className="font-bold text-2xl">1,248</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Books Issued</p>
                <p className="font-bold text-2xl">156</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Members</p>
                <p className="font-bold text-2xl">320</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Overdue Books</p>
                <p className="font-bold text-2xl">8</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="books" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="issues">Book Issues</TabsTrigger>
          <TabsTrigger value="issue">Issue Book</TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Book Collection</CardTitle>
                  <CardDescription>Browse and search available books</CardDescription>
                </div>
                <div className="flex w-72 items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, author, or ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>ISBN</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Copies</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{book.category}</Badge>
                        </TableCell>
                        <TableCell>{book.total}</TableCell>
                        <TableCell>
                          <Badge variant={book.available > 0 ? "default" : "destructive"}>{book.available}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" disabled={book.available === 0}>
                            Issue Book
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Book Issues</CardTitle>
              <CardDescription>Track all book issues and returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.student}</TableCell>
                        <TableCell>{issue.book}</TableCell>
                        <TableCell>{new Date(issue.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(issue.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" disabled={issue.status === "returned"}>
                            {issue.status === "returned" ? "Returned" : "Mark Returned"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue New Book</CardTitle>
              <CardDescription>Issue a book to a student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="font-medium text-sm">Search Student</label>
                  <Input placeholder="Enter student name or ID..." />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-sm">Search Book</label>
                  <Input placeholder="Enter book title or ISBN..." />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-sm">Due Date</label>
                  <Input type="date" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Issue Book</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
