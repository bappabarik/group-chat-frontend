import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { addName } from './store/nameSlice'
import {useDispatch} from 'react-redux'

function App() {
  const [name, setName] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setName(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() !== '') {
      dispatch(addName(name))
      navigate('/chat')
    }
    setName('')
  }

  return (
    <div className='h-screen bg-slate-900 flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='flex gap-4'>
          <input type="text"
          value={name}
          placeholder='Enter your name'
          onChange={handleChange}
          className='outline-none rounded-md p-2'
          />
          <button type='submit' className='bg-slate-700 px-2 rounded-md text-white'>Start Chatting</button>
      </form>
    </div>
  );
}

export default App
