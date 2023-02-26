/*
  function to hide the action button on data grid table
*/
const TableActionControl = (hasAccess, permission) => {
  if (permission.role === "Super Admin" || permission.role === "Admin") {
      return false
    }
  
  if (permission.permissions.includes(hasAccess)) {
    return false
  }

  return  true
}

export default TableActionControl