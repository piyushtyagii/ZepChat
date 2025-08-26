export function formatMessageTime(date){
    const today = new Date(); //today date
    const d = new Date(date); //date recieved as parameter

    const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()

    if(isToday){
        return "Today " + d.toLocaleTimeString("en-US",{
            hour : "2-digit",
            minute : "2-digit",
            hour12 : false
        })
    }

    return d.toLocaleString("en-US",{
       month : "short",
       day : "2-digit",
        hour : "2-digit",
        minute : "2-digit",
        hour12 : false
    })
}