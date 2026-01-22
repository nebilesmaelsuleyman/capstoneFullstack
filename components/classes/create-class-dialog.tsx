'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
    class_name: z.string().min(2, {
        message: 'Class name must be at least 2 characters.',
    }),
    class_code: z.string().min(2, {
        message: 'Class code must be at least 2 characters.',
    }),
    grade_level: z.coerce.number().min(1, {
        message: 'Grade level must be at least 1.',
    }),
    section: z.string().optional(),
    room_number: z.string().optional(),
    capacity: z.coerce.number().min(1, {
        message: 'Capacity must be at least 1.',
    }),
    academic_year: z.string().optional(),
})

export function CreateClassDialog() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            class_name: '',
            class_code: '',
            grade_level: 1,
            section: '',
            room_number: '',
            capacity: 30,
            academic_year: new Date().getFullYear().toString(),
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error: ${response.status} ${response.statusText}`, errorText);
                throw new Error('Failed to create class')
            }

            toast({
                title: 'Success',
                description: 'Class created successfully',
            })
            setOpen(false)
            form.reset()
            router.refresh()
        } catch (error) {
            console.error('Failed to create class:', error);
            toast({
                title: 'Error',
                description: 'Failed to create class. Please try again.',
                variant: 'destructive',
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Class
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Class</DialogTitle>
                    <DialogDescription>
                        Add a new class to the system. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="class_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mathematics 101" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="class_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="MATH101" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="grade_level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Grade Level</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="section"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section</FormLabel>
                                        <FormControl>
                                            <Input placeholder="A" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="room_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="101" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="academic_year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Academic Year</FormLabel>
                                    <FormControl>
                                        <Input placeholder="2024-2025" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
