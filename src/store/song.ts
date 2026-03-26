import type { ISong, ISongItem } from '@/api/types/songs'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSongDetail, getSongList } from '@/api/songs'

export const useSongStore = defineStore('song', () => {
  // 歌曲列表缓存
  const songs = ref<ISongItem[]>([])
  // 当前浏览/播放的歌曲详情
  const currentSong = ref<ISong | null>(null)
  // 播放状态
  const isPlaying = ref(false)
  // 列表是否已加载
  const isLoaded = ref(false)

  /**
   * 获取歌曲列表（有缓存则不重复请求）
   */
  const fetchSongList = async (forceRefresh = false) => {
    if (isLoaded.value && !forceRefresh) return songs.value
    const res = await getSongList()
    songs.value = res
    isLoaded.value = true
    return res
  }

  /**
   * 获取歌曲详情并设置为当前歌曲
   */
  const fetchSongDetail = async (id: number) => {
    const res = await getSongDetail(id)
    currentSong.value = res
    return res
  }

  /**
   * 设置播放状态
   */
  const setPlaying = (playing: boolean) => {
    isPlaying.value = playing
  }

  /**
   * 更新列表中单首歌的收藏状态（本地同步，避免重新请求列表）
   */
  const updateSongLike = (id: number, liked: boolean) => {
    const song = songs.value.find(s => s.id === id)
    if (song) song.isLiked = liked
    if (currentSong.value?.id === id) currentSong.value.isLiked = liked
  }

  return {
    songs,
    currentSong,
    isPlaying,
    isLoaded,
    fetchSongList,
    fetchSongDetail,
    setPlaying,
    updateSongLike,
  }
})
