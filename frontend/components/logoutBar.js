import Link from 'next/link'

const Logoutbar = () => (
    <div>
        <Link href="/"><a> <b>Home</b> </a></Link>  |
        <Link href="/register"><a> <b>Register</b> </a></Link>  |
        <Link href="/login"><a> <b>Login</b> </a></Link>
        
    </div>
)

export default Logoutbar