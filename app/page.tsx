import { currentUser } from '@clerk/nextjs/server';
import { UserButton , SignOutButton, SignInButton, SignUpButton} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";


export default async function Home() {
  const user = await currentUser()
  
  if (!user) return <div>
    Not signed in <Button><SignInButton/></Button> <Button><SignUpButton/></Button>
    </div>

  return <div>
    <UserButton/>
    <SignOutButton/>
  </div>
}
