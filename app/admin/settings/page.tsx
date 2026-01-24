
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default function SettingsPage() {
 return (
   <div className="flex flex-col gap-6 p-8">
     <div>
       <h1 className="font-semibold text-3xl text-balance">Settings</h1>
       <p className="text-muted-foreground">Manage your account and preferences</p>
     </div>


     <div className="grid gap-6">
       <Card>
         <CardHeader>
           <CardTitle>Profile Information</CardTitle>
           <CardDescription>Update your account details</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="grid gap-2">
             <Label htmlFor="name">Full Name</Label>
             <Input id="name" placeholder="Enter your name" />
           </div>
           <div className="grid gap-2">
             <Label htmlFor="email">Email</Label>
             <Input id="email" type="email" placeholder="Enter your email" />
           </div>
           <Button>Save Changes</Button>
         </CardContent>
       </Card>


       <Card>
         <CardHeader>
           <CardTitle>Security</CardTitle>
           <CardDescription>Manage your password and security settings</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="grid gap-2">
             <Label htmlFor="current-password">Current Password</Label>
             <Input id="current-password" type="password" />
           </div>
           <div className="grid gap-2">
             <Label htmlFor="new-password">New Password</Label>
             <Input id="new-password" type="password" />
           </div>
           <Button>Update Password</Button>
         </CardContent>
       </Card>
     </div>
   </div>
 )
}





