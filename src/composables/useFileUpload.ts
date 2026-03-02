import { ref } from 'vue'
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { storage } from '@/firebase'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function useFileUpload() {
  const uploading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  async function uploadFile(
    file: File,
    conversationId: string,
  ): Promise<{ url: string; name: string; type: string; size: number }> {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit')
    }

    uploading.value = true
    progress.value = 0
    error.value = null

    const fileRef = storageRef(storage, `chat/${conversationId}/${Date.now()}_${file.name}`)
    const task = uploadBytesResumable(fileRef, file)

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (err) => {
          error.value = err.message
          uploading.value = false
          reject(err)
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          uploading.value = false
          progress.value = 100
          resolve({ url, name: file.name, type: file.type, size: file.size })
        },
      )
    })
  }

  return { uploading, progress, error, uploadFile }
}
