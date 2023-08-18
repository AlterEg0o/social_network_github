import './userChoice.css'


export default function UserChoice({ users,onUserChange }) {

    function addUser(event){
        const username = event.target.innerText
        onUserChange(username)
    }

    return (
        <div>
            <h4>User choice</h4>
            {users.map((user, index) => (
                <div className='userChoice' onClick={addUser} key={index}> {user.Username} </div>
            )
            )}
        </div>
    )

}