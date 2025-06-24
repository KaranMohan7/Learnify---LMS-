import { useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'


const Routeprotector = ({children}) => {

    const {user, isLoaded} = useUser()

    if(!isLoaded){
        return null
    }

    if(!user){
       return  <Navigate to="/" />  
    }

    return children
}

export default Routeprotector