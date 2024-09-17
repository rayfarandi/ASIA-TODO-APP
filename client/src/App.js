/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import ListHeader from './components/ListHeader'
import ListItem from './components/ListItem'
import Auth from './components/Auth'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [tasks, setTasks] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc') // Default sort order

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todoapp/${userEmail}`)
      const json = await response.json()
      setTasks(json)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (authToken) {
      getData()
    }
  }, [authToken])

  // Fungsi untuk menangani perubahan pilihan sorting
  const handleSortChange = (e) => {
    setSortOrder(e.target.value) // Mengubah sortOrder sesuai dengan pilihan user
  }

  // Sorting tasks berdasarkan urutan yang dipilih
  const sortedTasks = tasks?.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    if (sortOrder === 'asc') {
      return dateA - dateB
    } else if (sortOrder === 'desc') {
      return dateB - dateA
    } else if (sortOrder === 'progress100') {
      return b.progress === 100 ? 1 : -1 // Prioritaskan task dengan progress 100%
    } else if (sortOrder === 'progressUnder100') {
      return a.progress < 100 ? -1 : 1 // Prioritaskan task dengan progress di bawah 100%
    }
    return 0
  })

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listName={'To do list'} getData={getData} />
          <p className="user-email">Welcome back {userEmail}</p>

          {/* Dropdown menu untuk sorting */}
          <div className="sort-menu">
            <label htmlFor="sort">Sort by: </label>
            <select id="sort" value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Date: Ascending</option>
              <option value="desc">Date: Descending</option>
              <option value="progress100">Progress: Selesai </option>
              <option value="progressUnder100">Progress: Belum Selesai</option>
            </select>
          </div>

          {/* Render sorted tasks */}
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      )}
    </div>
  )
}

export default App
