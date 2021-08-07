import { createContext , useState , ReactNode ,  useEffect} from "react"
import { auth, firebase } from '../services/firebase';

type User = {
    id: string;
    name: string|null
    avatar: string | null ;
  }
  
type AuthContextType ={
    user: User | undefined;
    signWithGoogle: () => Promise<void>;
  }

export const AuthContext = createContext({} as AuthContextType)

type AuthContextProviderProps = {
    children: ReactNode
}

export function AuthContextProvider (props: AuthContextProviderProps){
    const [user , setUser] = useState<User>()

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged( user =>{
          if(user){
           const {displayName, photoURL , uid} = user
   
           if(!displayName || !photoURL){
             console.log(displayName , photoURL)
             throw new Error('User missing Photo or Display Name')
           }
     
           setUser({
             id:uid,
             name: displayName,           
             avatar: photoURL
           })        
          }
        })
   
        return () =>{
         unsubscribe()
       }
   
     }, [])

    async function signWithGoogle(){
        const provider = new firebase.auth.GoogleAuthProvider();
        
        const result  = await auth.signInWithPopup(provider)
    
        if(result.user){
          const {displayName, photoURL , uid} = result.user
    
          if(!displayName || !photoURL){
            console.log(displayName , photoURL)
            throw new Error('User missing Photo or Display Name')
          }
    
          setUser({
            id:uid,
            name: displayName,           
            avatar: photoURL
          })
        }
      }

    return (
        <AuthContext.Provider value = {{user, signWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    )
}