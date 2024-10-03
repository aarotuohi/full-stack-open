import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdotes } from '../services/anecdoteService'
import { useContext } from 'react'
import NotificationContext from '../context/NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notificationDispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdotes,
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    if (content.length < 5) {
      notificationDispatch({ type: 'SET', payload: 'Anecdote is too short!' })
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
      return
    }
    newAnecdoteMutation.mutate({ content, votes: 0 })
    e.target.anecdote.value = ''
    notificationDispatch({ type: 'SET', payload: `Anecdote '${content}' created` })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
