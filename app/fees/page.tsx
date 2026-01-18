"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function FeesPage() {
  const feeStructure = [
    { id: 1, type: "Tuition Fee", grade: "Grade 9", amount: 15000, dueDate: "2024-04-30" },
    { id: 2, type: "Library Fee", grade: "Grade 9", amount: 500, dueDate: "2024-04-30" },
    { id: 3, type: "Sports Fee", grade: "Grade 9", amount: 1000, dueDate: "2024-04-30" },
    { id: 4, type: "Tuition Fee", grade: "Grade 10", amount: 16000, dueDate: "2024-04-30" },
  ]

  const payments = [
    {
      id: 1,
      student: "John Smith",
      feeType: "Tuition Fee",
      amount: 15000,
      paid: 15000,
      status: "paid",
      date: "2024-03-15",
      receipt: "REC001234",
    },
    {
      id: 2,
      student: "Emma Johnson",
      feeType: "Tuition Fee",
      amount: 15000,
      paid: 7500,
      status: "partial",
      date: "2024-03-10",
      receipt: "REC001235",
    },
    {
      id: 3,
      student: "Michael Brown",
      feeType: "Tuition Fee",
      amount: 15000,
      paid: 0,
      status: "pending",
      date: null,
      receipt: null,
    },
    {
      id: 4,
      student: "Sarah Davis",
      feeType: "Library Fee",
      amount: 500,
      paid: 500,
      status: "paid",
      date: "2024-03-20",
      receipt: "REC001236",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: any = {
      paid: "default",
      partial: "secondary",
      pending: "outline",
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
        <h1 className="font-semibold text-3xl text-balance">Fee Management</h1>
        <p className="text-muted-foreground">Manage fee structure and track payments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Collection</p>
                <p className="font-bold text-2xl">$485,000</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Outstanding</p>
                <p className="font-bold text-2xl">$125,000</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Paid This Month</p>
                <p className="font-bold text-2xl">$45,000</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Full Payments</p>
                <p className="font-bold text-2xl">142</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="structure">Fee Structure</TabsTrigger>
          <TabsTrigger value="collect">Collect Fee</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>View all fee payments and pending dues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.student}</TableCell>
                        <TableCell>{payment.feeType}</TableCell>
                        <TableCell>${payment.amount}</TableCell>
                        <TableCell>${payment.paid}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>{payment.date ? new Date(payment.date).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>{payment.receipt || "-"}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View Details
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

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
              <CardDescription>Academic year 2024-2025 fee structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStructure.map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell className="font-medium">{fee.type}</TableCell>
                        <TableCell>{fee.grade}</TableCell>
                        <TableCell>${fee.amount}</TableCell>
                        <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Edit
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

        <TabsContent value="collect" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collect Fee Payment</CardTitle>
              <CardDescription>Record a new fee payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="student">Select Student</Label>
                    <Select>
                      <SelectTrigger id="student">
                        <SelectValue placeholder="Choose student" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">John Smith - STU001</SelectItem>
                        <SelectItem value="2">Emma Johnson - STU002</SelectItem>
                        <SelectItem value="3">Michael Brown - STU003</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feeType">Fee Type</Label>
                    <Select>
                      <SelectTrigger id="feeType">
                        <SelectValue placeholder="Choose fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tuition">Tuition Fee</SelectItem>
                        <SelectItem value="library">Library Fee</SelectItem>
                        <SelectItem value="sports">Sports Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="15000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select>
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                    <Input id="transactionId" placeholder="TXN123456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input id="paymentDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Input id="remarks" placeholder="Add any notes about this payment" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Record Payment</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
