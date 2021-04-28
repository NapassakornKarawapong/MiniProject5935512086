import Link from 'next/link'

const Menubar = () => (
    <div>
        <Link href="/register"><a> <b>Register</b> </a></Link>  |
        <Link href="/login"><a> <b>Login</b> </a></Link>
        
    </div>
)

export default Menubar