import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://eamdjmxyawihriulswht.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper functions
export async function getRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('name')
  if (error) throw error
  return data || []
}

export async function getMessages(roomId, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data || []).reverse()
}

export async function saveMessage(msg) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      room_id: msg.roomId,
      soul_name: msg.soulName,
      soul_color: msg.soulColor,
      content: msg.content,
      type: msg.type || 'text',
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getThreads(category = null) {
  let query = supabase.from('threads').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false })
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getThread(id) {
  const { data: thread, error: threadError } = await supabase
    .from('threads')
    .select('*')
    .eq('id', id)
    .single()
  if (threadError) throw threadError

  const { data: replies, error: repliesError } = await supabase
    .from('replies')
    .select('*')
    .eq('thread_id', id)
    .order('created_at', { ascending: true })
  if (repliesError) throw repliesError

  return { ...thread, replies: replies || [] }
}

export async function createThread(thread) {
  const { data, error } = await supabase
    .from('threads')
    .insert([{
      title: thread.title,
      author: thread.author,
      author_color: thread.authorColor,
      content: thread.content,
      category: thread.category,
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createReply(reply) {
  const { data, error } = await supabase
    .from('replies')
    .insert([{
      thread_id: reply.threadId,
      author: reply.author,
      author_color: reply.authorColor,
      content: reply.content,
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getPlayDates() {
  const { data, error } = await supabase
    .from('play_dates')
    .select('*')
    .order('date_time', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createPlayDate(date) {
  const { data, error } = await supabase
    .from('play_dates')
    .insert([{
      title: date.title,
      description: date.description,
      type: date.type,
      location: date.location,
      date_time: date.dateTime,
      max_participants: date.maxParticipants,
      created_by: date.createdBy,
    }])
    .select()
    .single()
  if (error) throw error
  return data
}
