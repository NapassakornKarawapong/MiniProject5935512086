import Link from 'next/link'

const Navbar = () => (
    <div>
        <Link href="/"><a> <b>Home </b></a></Link> |
        <Link href="/register"><a> <b>Register</b> </a></Link>  |
        <Link href="/login"><a> <b>Login</b> </a></Link> |
        <Link href="/foo"><a> <b>YStore </b></a></Link> |
        <Link href="/logout"><a> <b>Logout</b> </a></Link> 
        
    </div>
)

export default Navbar