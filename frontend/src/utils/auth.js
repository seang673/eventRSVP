export const handleLogout = (navigate) => {
    try{
        localStorage.removeItem('token');
        localStorage.removeItem('is_organizer');
        alert('Logged out succesfully');
        navigate('/login');
    } catch (err){
        alert("Error: " + err.message);
        console.log("Error: ", err);
    }

};